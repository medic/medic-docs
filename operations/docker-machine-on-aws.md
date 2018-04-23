General Setup
=============

1. Install the `aws` command-line tools. These are available on Mac OS X via
   Homebrew via `brew install awscli amazon-ecs-cli`, and are built-in to Amazon
   Linux AMIs.

2. You'll need an Amazon Web Services (AWS) Identity and Access Management (IAM)
   account (read: non-root) that is a member of the `docker-machine-administrators`
   IAM group. This group has policies attached to it that allow you to access
   the Elastic Container Registry (ECR) and AWS APIs required by Docker Machine.

3. If you wish to operate on a non-default region (that is, a region other than
   the one you select while running `aws configure`), you *must* add the
   `--region "$region"` option to each and every command in this guide, where
   `$region` is the name of the region you wish to operate (e.g. `eu-west-1`).

Authentication Setup
====================

1. Obtain your AWS user access key ID and secret access key (usually referred to
   as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_ID`) from the AWS IAM console.

2. Run `aws configure`, and supply your AWS user access key ID and secret
   access key. These are long-term credentials that are saved to disk by the `aws`
   utility. Additionally, choose a default region.

3. Since we use multi-factor authentication (MFA), you'll need to obtain a second
   time-limited set of credentials in order to access AWS. These credentials will
   be stored as environment variables, overriding the long-term credentials maintained
   by `aws configure`. The following script will issue an `aws sts get-session-token`
   API call, reformat the output from JSON, and `export` the credentials as
   environment variables.
   ```shell
   #!/bin/sh

   reset_environment() {

     unset AWS_ACCESS_KEY_ID
     unset AWS_SECRET_ACCESS_KEY
     unset AWS_SESSION_TOKEN
   }

   authenticate() {

     local mfa_serial="$1"
     local mfa_code="$2"
     shift 2;

     aws sts get-session-token \
       --serial-number "$mfa_serial" --token-code "$mfa_code" | format_exports
   }

   main()
   {
     reset_environment
     authenticate "$@"
   }

   format_exports() {

     jq -r "
       \"export AWS_ACCESS_KEY_ID='\" + .Credentials.AccessKeyId + \
       \"'\nexport AWS_SECRET_ACCESS_KEY='\" + .Credentials.SecretAccessKey + \
       \"'\nexport AWS_SESSION_TOKEN='\" + .Credentials.SessionToken + \"'\"
     "
   }

   main "$@"
   ```
   Run the script in the following way, where `$user` is your AWS IAM username,
   and `$mfa_code` is the six-digit code being currently displayed on your MFA
   device:
   ```shell
   eval "`./aws-sts-login.sh "arn:aws:iam::720541322708:mfa/$user" "$mfa_code"`";
   ```
   If no error is printed and the exit status is zero, you should now have a
   12-hour time-limited access token that is valid for AWS API calls. Use
   `echo "$AWS_ACCESS_KEY_ID"` if you need to further confirm that the operation
   was successful.

Container Registry Setup
========================

1. To log in to our Docker-compatible Elastic Container Registry (ECR), run the
   following command. The `sed` pipeline is currently required to remove an unsupported
   Docker command-line option emitted by `aws`. Reasons for this are currently unknown.
   ```shell
   eval "`aws ecr get-login | sed 's/ -e none//;'`";
   ```
   The URL for our ECR host is `https://720541322708.dkr.ecr.eu-west-2.amazonaws.com`.
   According to ECS documentation, this is (i) hideous and (ii) currently incompatible
   with CNAME DNS entries due to the use of HTTPS and the lack of a custom certificate/key
   upload feature.

2. To push a new Docker image to the registry, you'll need to notify ECR in advance by
   creating a _repository_. This can be accomplished using the following command, where
   `$image` is replaced by the fully-unqualified (i.e. no hostname and no tag) name
   of the Docker image you'd like to push. This will not push the image; it merely
   creates a destination for the image to be pushed to.
   ```shell
   aws ecr create-repository --repository-name "$image";
   ```
3. If you ever need to remove a repository and its entire contents, use the following
   command, where `$image` is the repository (N.B. image) name you used in step 2.
   ```shell
   aws ecr delete-repository --force --repository-name "$image";
   ```
   Deleting individual tagged images from a repository can be accomplished via
   `batch-delete-image`; consult `aws ecr batch-delete-image help` for details.

4. Use Docker to tag the local image(s) you wish to push to ECR. The following
   example tags two releases of Medic OS with our ECR hostname.
   ```shell
   docker tag medic-os:1.7.1 720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic-os:1.7.1;
   docker tag medic-os:2.1.1 720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic-os:2.1.1;
   ```
   Then, push the newly-tagged images to the AWS ECR Docker registry using `docker push`.
   ```shell
   docker push 720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic-os:1.7.1;
   docker push 720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic-os:2.1.1;
   ```
   If the operation was successful, you'll see `Pushed` and a cryptographic digest
   of the image printed on standard output. To further verify the operation was successful,
   you can run the following command, where `image` is the repository (N.B. image)
   name you used in steps 2 and 3.
   ```shell
   aws ecr describe-images --repository-name image;
   ```

Virtual Private Cloud Setup
===========================

1. We'll create an AWS Virtual Private Cloud (VPC) for each ECS cluster.
   Each VPC will contain one private subnet per availability zone. To create
   the VPC, run the following command. Each CIDR block can only be used once
   within a given region. We'll be using a CIDR `/16` ("class B") IP space
   for the VPC. Let `$net` be the second octet (e.g. `16`) of the CIDR
   block for this VPC.
   ```shell
   aws ec2 create-vpc --cidr-block "10.$net.0.0/16" | jq -r '.Vpc.VpcId';
   ```

2. Give the VPC a name by tagging it. Replace `$name` with the intended name
   of the new VPC, and `$vpc_id` with the VPC identifier you obtained in step one.
   ```shell
   aws ec2 create-tags --resources "$vpc_id" --tags "Key=Name,Value=$name";
   ```
Public Subnet Setup
-------------------

3. Create new "public" subnets for all availability zones in the region. These
   subnets will use private addressing, but will have an associated route table
   and internet gateway that will optionally allow incoming connections for NAT
   gateways and/or direct-attached Elastic IP address allocations. There is
   no requirement to place Docker Machine instances in more than one availability
   zone, but you must create at least two in order to create a load balancer later.
   Run the following commands, where `$vpc_id` is the VPC identifier you obtained
   in step one, and `$azs` is a whitespace-separated list of availability zones
   (e.g. `a b c d`).
   ```shell
   i=0; for az in $azs; do
     aws ec2 create-subnet \
       --vpc "$vpc_id" --cidr-block "10.16.$i.0/21" \
       --availability-zone "${region}${az}" | jq -r '.Subnet.SubnetId';
     i=$[$i + 8];
   done
   ```
   This network layout provides approximately 2094 valid private IP addresses
   per subnet in each availability zone, each of which *may* have an additional
   public IP attached if desired.

4. Tag each of the newly-created public subnets to give it a name. Let `$name` be the
   `Name` tag of the VPC that you used in step two, and `$az` be the availability
   zone that `$subnet_id` was placed in. Then, run the following command.
   ```shell
   aws ec2 create-tags --resources "$subnet_id" --tags "Key=Name,Value=$name-public-$az";
   ```

5. Create an internet gateway for the VPC. Run the following command.
   ```shell
   aws ec2 create-internet-gateway \
     | jq -r '.InternetGateway.InternetGatewayId';
   ```
   
6. Tag the internet gateway to give it a name. Let `$name` be the
   `Name` tag of the VPC that you used in step two, and let `$igw_id`
   be the internet gateway identifier you obtained in step five.
   ```shell
   aws ec2 create-tags --resources "$igw_id" --tags "Key=Name,Value=$name-gateway";
   ```

7. Attach the internet gateway to the VPC. Run the following command, where
   `$igw_id` is the internet gateway identifier you obtained in step five,
   and `$vpc_id` is the VPC identifier you obtained in step one.
   ```shell
   aws ec2 attach-internet-gateway --vpc "$vpc_id" --internet-gateway-id "$igw_id";
   ```
   If the command prints nothing and has an exit status of zero, it was successful.

8. A route table was automatically created along with the VPC we created in step one.
   We need to find its identifier. Use the following command to find the route table
   identifier associated with the new VPC. This command returns the first associated
   route table; if you have created additional tables, you may have to adjust this.
   ```shell
   aws ec2 describe-route-tables \
     | jq -r ".RouteTables | map(select(.VpcId == \"$vpc_id\"))[0].RouteTableId";
   ```

9. Tag the default route table. Let `$name` be the `Name` tag of the VPC that you used
   in step two, and let `$rtb_id` be the routing table identifier you obtained in step
   eight. Run the following command.
   ```shell
   aws ec2 create-tags --resources "$rtb_id" --tags "Key=Name,Value=$name-public";
   ```

10. Call the route table identifier that we found in step eight `$rtb_id`. For
    *each and every* subnet identifier `$subnet_id` created in step three, run the
    following command to associate the subnet to the new route table.
    ```shell
    aws ec2 associate-route-table --subnet-id "$subnet_id" --route-table-id "$rtb_id" \
      | jq -r '.AssociationId';
    ```

11. Add a default route to the route table pointing to the internet gateway.
    This will connect all subnets in the VPC to the public internet. Egress traffic
    will always be allowed; ingress traffic will only arrive if an EC2 instance in
    the VPC has a publicly-addressible Elastic IP address. Run the following command,
    where `$rtb_id` is the route table identifier from step eight, and `$igw_id` is
    the internet gateway identifier from step five.
    ```shell
    aws ec2 create-route --route-table-id "$rtb_id" --gateway-id "$igw_id" \
      --destination-cidr-block 0.0.0.0/0 | jq -r '.Return';
    ```
    If the command prints `true`, it was successful.
    
12. Allocate a new elastic IP address (EIP). This doesn't need to be associated
    to anything in this step; it will be associated with a NAT gateway later.
    ```shell
    aws ec2 allocate-address --domain vpc | jq -r '.AllocationId';
    ```

13. Create a single managed NAT gateway in a single availability zone to be used by all
    instances within your VPC. Let `$eip_id` be the Elastic IP address that you obtained
    in step twelve, and let `$az` be the availability zone (e.g. `a`, `b`, or `c`) that
    you wish to create the NAT gateway in. Run the following command.
    ```shell
    aws ec2 create-nat-gateway \
      --subnet-id "$subnet_id" --allocation-id "$eip_id" | jq -r '.NatGateway.NatGatewayId';
    ```
    NAT gateways may take as long as a few minutes to start up; gateway startup status can
    be reported asynchronously via `describe-nat-gateways`. Backup NAT gateways could be
    placed in additional availability zones, but we currently believe this to be unnecessary.

14. Tag the newly-created NAT gateway to give it a name. Let `$name` be the `Name` tag of the
    VPC that you used in step two. Run the following command to tag the NAT gateway.
    ```shell
    aws ec2 create-tags \
      --resources "$nat_id" --tags "Key=Name,Value=$name-public";
    ```
    Public subnet setup is now complete.

Private Subnet Setup
--------------------

15. Create new private subnets for all availability zones in the region. These
    subnets will use private addressing, will have *no* incoming internet connection,
    and will have traffic delivered to them via an application load balancer (ALB).
    These subnets will be provided with outbount internet access (e.g. for software updates)
    via the NAT gateway(s) created in step twelve, above. The number of private subnets
    and choice of availability zones should exactly match those you selected in step three.
    Run the following commands, where `$vpc_id` is the VPC identifier you obtained
    in step one, and `$azs` is a whitespace-separated list of availability zones
    (e.g. `a b c d`) that exactly matches the list you used in step three.
    ```shell
    i=128; for az in $azs; do
      aws ec2 create-subnet \
        --vpc "$vpc_id" --cidr-block "10.16.$i.0/21" \
        --availability-zone "${region}${az}" | jq -r '.Subnet.SubnetId';
      i=$[$i + 8];
    done
    ```
    This network layout provides approximately 2094 valid private IP addresses
    per subnet in each availability zone.

16. Tag each of the newly-created public subnets to give it a name. Let `$name` be the
    `Name` tag of the VPC that you used in step two, and `$az` be the availability
    zone that `$subnet_id` was placed in. Then, run the following command.
    ```shell
    aws ec2 create-tags --resources "$subnet_id" --tags "Key=Name,Value=$name-private-$az";
    ```

17. Create a new route table for your new private subnets. We'll use this route
    table to deliver traffic to/from the internet using the NAT gateway you created
    in step thirteen. Run the following command.
    ```shell
    aws ec2 create-route-table --vpc-id "$vpc_id" | jq -r '.RouteTable.RouteTableId';
    ```

18. Tag the route table we just created. Let `$name` be the `Name` tag of the VPC that
    you used in step two, and let `$rtb_id` be the route table identifier you obtained
    in step seventeen. Run the following command.
   ```shell
   aws ec2 create-tags --resources "$rtb_id" --tags "Key=Name,Value=$name-private";
   ```

18. Call the route table identifier that we created in step seventeen `$rtb_id`. For
    *each and every* subnet identifier `$subnet_id` created in step fifteen, run the
    following command to associate the subnet to the new route table.
    ```shell
    aws ec2 associate-route-table --subnet-id "$subnet_id" --route-table-id "$rtb_id" \
      | jq -r '.AssociationId';
    ```

18. Add a default route to the route table pointing to the NAT gateway you created
    thirteen. This will connect allow egress connections to be made to the internet
    from any of the private subnets you created in step fifteen, but will allow no
    ingress access of any kind from outside of AWS due to the lack of an internet
    gateway. Run the following command, where `$rtb_id` is the route table identifier
    from step fifteen, and `$nat_id` is the NAT gateway identifier you obtained in step
    thirteen.
    ```shell
    aws ec2 create-route --route-table-id "$rtb_id" --nat-gateway-id "$nat_id" \
      --destination-cidr-block "0.0.0.0/0" | jq -r '.Return';
    ```
    If the command prints `true`, it was successful. Private subnet setup is now
    complete.


Elastic Load Balancer Initial Setup
===================================

1. Docker Machine instances will be placed inside of a private subnet; instances will
   not be directly reachable from the public internet. Assigning Elastic IPs directly
   to individual EC2 instances within a VPC is possible, but in this case is undesirable
   due to port mapping requirements – two containers can't both e.g. listen on port 443 on
   the same EC2 instance. We'll be creating a layer seven (application-level) HTTPS load
   balancer. This load balancer will use the HTTP `Host:` header to route traffic to the
   proper container (read: port on an Docker Machine node). In order to avoid SNI and access
   the `Host:` header, SSL/TLS must be terminated at the load balancer. Containers will run
   on privately-addressed Docker Machine instances within a VPC, and will use ordinary
   unencrypted HTTP to talk to the ALB.

3. First, we'll create an IAM SSL/TLS server certificate. Assume that `$cert_file` is the
   path to your certificate, `$key_file` is the path to your certificate's private key,
   and `$chain_file` it the path to a file containing one or more SSL/TLS certificates
   that collectively comprise the SSL/TLS intermediate chain. If there is no intermediate
   certificate chain; omit the `--certificate-chain` option: an empty file will not work.
   Pick a name for the certificate that corresponds to the name of the VPC you'll be using
   it in, and call this `$name`. Run the following command:
   ```shell
   aws iam upload-server-certificate \
     --server-certificate-name "$name" --certificate-body "file://$cert_file" \
     --private-key "file://$key_file" --certificate-chain "file://$chain_file" \
       | jq -r '.ServerCertificateMetadata.Arn';
   ```
   If successful, this will print the Amazon Resource Name (ARN) for the certificate. If
   you need to delete the certificate, use `aws iam delete-server-certificate` with
   the `--server-certificate-name` option set to `$name` from above. The certificate
   and key are now ready to be used with an HTTPS load balancer.

4. A default security group was created automatically when you created a VPC. Find
   its unique identifier using the following command, where `$vpc_id` is the identifier
   for the VPC you created in the previous section.
   ```shell
   aws ec2 describe-security-groups \
     | jq -r ".SecurityGroups | map(select(.VpcId==\"$vpc_id\"))[0].GroupId";
   ```

5. Tag the default security group with a name. Let `$name` be the `Name` tag
   of the VPC that you created earlier, and let `$sg_id` be the security group
   we found in step four. Run the following command.
   ```shell
   aws ec2 create-tags --resources "$sg_id" --tags "Key=Name,Value=$name-default";
   ```

6. Create an HTTPS load balancer. Let `$subnet_ids` be a *whitespace-separated* list of
   the **private** subnets that you created during the VPC setup process. Let `$sg_id`
   be the security group identifier you discovered in step four. Choose a unique name
   for this load balancer that contains the `Name` tag of the VPC you created earlier
   (e.g. `development-1`), and call that `$name`. Run the following command; missing
   quotes are intentional.
   ```shell
   aws elbv2 create-load-balancer --name "$name" \
     --subnets $subnet_ids --security-groups "$sg_id" \
       | jq -r '.LoadBalancers[0].LoadBalancerArn + "\n" + .LoadBalancers[0].DNSName';
   ```
   If successful, this will print two lines. The first line is the ARN of the new load
   balancer; the second is the AWS-provided DNS domain name for the external-facing side
   of the new load balancer.

7. Create a default load balancing target group. A target group represents a collection
   of one or more instances to which traffic can be delivered. This default target
   group will be used to respond to requests that, for whatever reason, don't match
   any of the load balancer's other (container-specific) rules. Let `$vpc_id` be the
   identifier of the VPC we created initially, and let `$name` be the tagged `Name`
   of that same VPC. Run the following command.
   ```shell
   aws elbv2 create-target-group --name "$name-default" --vpc-id "$vpc_id" \
     --protocol HTTP --port 80 | jq -r '.TargetGroups[0].TargetGroupArn';
   ```
   If successful, this will print the ARN of the new default target group.

8. Create an HTTPS listener for the new load balancer. Let `$cert_arn` be the ARN
   of the SSL/TLS server certificate you received at the end of step three, let
   `$elb_arn` be the ARN you received in step six, and let `$target_group_arn` be
   the ARN of the load balancing target group you created in step seven.
   Run the following command.
   ```shell
   aws elbv2 create-listener --load-balancer-arn "$elb_arn" \
     --protocol HTTPS --port 443 --certificates "CertificateArn=$cert_arn" \
     --default-actions "Type=forward,TargetGroupArn=$target_group_arn" \
       | jq -r '.Listeners[0].ListenerArn';
   ```
    If successful, this will print the ARN of the load balancer's new HTTPS listener.

Docker Machine Setup
====================

We'll now set up a collection of Docker Machine instances inside of our VPC,
with a single SSH-only "head-end" machine in the VPC's "public" subnet. This
"head-end" gateway machine will be used to provision and manage instances using
the `docker` and `docker-machine` commands. All instances that are managed by
Docker Machine will live in the VPC's private subnet. For purposes of the following
steps, we'll call this entire arrangement a "cell" of machines.

1. If it doesn't already exist, create a security group *in the VPC you created*
   in order to permit inbound SSH traffic. If one already exists in the VPC, note
   its security group identifier and skip to step four. Otherwise, run the following
   command, where `$vpc_id` is the VPC identifier you created earlier.
   ```shell
   aws ec2 create-security-group --vpc-id "$vpc_id" \
     --group-name ssh-only --description "SSH access only" | jq -r '.GroupId';
   ```
   
2. Tag the security group with a name. Run the following command, where `$sg_id`
   is the security group identifier you obtained in step one.
   ```shell
   aws ec2 create-tags --resources "$sg_id" --tags "Key=Name,Value=ssh-only";
   ```

3. Authorize ingress SSH traffic on ports 22 and 33696 for the security group you
   created in step one. Run the following commands, where `$sg_id` is the security
   croup identifier you created in step one.
   ```shell
   aws ec2 authorize-security-group-ingress --group-id "$sg_id" \
     --protocol tcp --port 22 --cidr 0.0.0.0/0 &&
   aws ec2 authorize-security-group-ingress --group-id "$sg_id" \
     --protocol tcp --port 33696 --cidr 0.0.0.0/0;
   ```

Gateway Instance Creation
-------------------------

4. Select a single **public** subnet in which to place a publicly-accessible "head-end"
   SSH gateway machine by creating a new `t2.nano` Ubuntu LTS instance. Let `$subnet_id`
   be your chosen public subnet, let `$region` be the region in which your chosen subnet
   exists, let `$az` be your the availability zone (e.g. `a`, `b`, `c`) that your chosen
   subnet exists in, let `$sg_id` be the identifier of the security group you created
   or located in step one, and let `$key_name` be the name of a registered EC2 SSH
   keypair that you'll use to access the headend instance. Run the following command.
   ```shell
   aws ec2 run-instances --image-id ami-f4f21593 --count 1 \
     --no-associate-public-ip-address --subnet-id "$subnet_id" \
     --placement "AvailabilityZone=${region}${az},Tenancy=default" \
     --disable-api-termination --instance-initiated-shutdown-behavior stop \
     --instance-type t2.nano --key-name "$key_name" --security-group-id "$sg_id" \
     --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=16,VolumeType=gp2}' \
       | jq -r '.Instances[0].InstanceId';
   ```
   The "head-end" gateway machine should now be booting. It will be able to access
   machines on *any* of the private or public subnets you created during VPC setup.

5. Tag the instance you just created in step four. The full tag management scheme
   for EC2 instances is outside the scope of this guide, but we'll at least give it
   a sensible name for now. Let `$name` be the instance name, and let `$instance_id`
   be the instance identifier you obtained in step four. Run the following command.
   ```shell
   aws ec2 create-tags --resources "$instance_id" --tags "Key=Name,Value=$name";
   ```

6. Allocate a new elastic IP address (EIP). This doesn't need to be associated
   to anything in this step; it will be associated with an instance in the next step.
    ```shell
    aws ec2 allocate-address --domain vpc | jq -r '.AllocationId';
    ```

7. Attach the elastic IP to the "head-end" gateway instance to make it accessible
   from the public internet. Let `$instance_id` be the instance identifier you created
   in step four, and let `$eip_id` be the Elastic IP you allocated in step six. Run
   the following command to associate the Elastic IP to the instance.
   ```shell
   aws ec2 associate-address --no-allow-reassociation \
     --instance-id "$instance_id" --allocation-id "$eip_id" | jq -r '.AssociationId';
   ```

8. Determine the public IP address for the Elastic IP you just attached. You'll
   need this IP to connect to the machine and/or make modifications to the DNS.
   Run the following command, where `$eip_id` is the Elastic IP address you obtained
   in step six.
   ```shell
   aws ec2 describe-addresses --allocation-ids "$eip_id" \
     | jq -r '.Addresses[0].PublicIp';
   ```

9. Connect to the instance via SSH using the following command, where `$ip` is the
   IP address you discovered in step eight.
   ```shell
   ssh -p22 "ubuntu@$ip";
   ```
   Depending upon your SSH configuration, you may need to specify additional
   options (e.g. `-i` to select the proper private key file to connect with).

Gateway Software Setup
----------------------

10. Now that you're connected to the gateway instance, we'll need to update software
    and perform some basic configuration. Choose a host name for this instance
    (e.g. `docker-headend-2a-1`) then run the following commands, replacing every
    occurrence of `$hostname` with the host name you've selected.
    ```shell
    temp="`mktemp`" &&
    apt_env='DEBIAN_FRONTEND=noninteractive' &&
    docker_machine_url='https://github.com/docker/machine/releases/download/v0.14.0' &&
    \
    sudo sh -c "echo '127.0.0.1 $hostname' >> /etc/hosts 2>/dev/null" &&
    sudo hostnamectl set-hostname "$hostname" 2>/dev/null &&
    sudo sh -c "echo '$hostname' > /etc/hostname" 2>/dev/null &&
    \
    sudo sh -c "$apt_env apt-get -y -q=2 remove cloud-init" &&
    \
    sudo apt-get -y -q=2 update &&
    sudo sh -c "$apt_env apt-get -y -q=2 upgrade" &&
    sudo sh -c "$apt_env apt-get -y -q=2 install docker.io awscli jq" &&
    \
    cd /usr/local/bin &&
    curl -L# "$docker_machine_url/docker-machine-`uname -s`-`uname -m`" > "$temp" &&
    sudo install "$temp" /usr/local/bin/docker-machine && rm -f "$temp" &&
    \
    cd &&
    ssh-keygen -q -b 4096 -f ~/.ssh/id_rsa -t rsa -C "hostmaster@$hostname" -P '' &&
    echo && cat ~/.ssh/id_rsa.pub;
    ```
    An SSH public key will be printed as the final line of output. Save it for later;
    we'll add it to AWS and instruct this copy of Docker Machine to automatically
    authorize it on all of the instances it manages. (**To do**: add a passphrase as an
    extra layer of security to contain potential compromises of the gateway instance).

11. Reboot the head-end gateway instance to allow any kernel updates to take
    effect. Run the following command.
    ```shell
    sudo reboot;
    ```

Machine Setup
-------------

12. Revisit the [Authentication Setup](#authentication-setup) section at the top of this
    guide. Repeat the AWS IAM STS authentication procedure while connected to the cell's
    head-end gateway via SSH. This will give you (and Docker Machine) access to the AWS API.
    (**To do**: `aws configure` stores AWS access key credentials in the clear in `~/.aws`, which
    isn't desirable on a head-end server such as this; find a strategy to avoid storing access
    keys in this way).

13. Now that you're authenticated to AWS, use the SSH public key you received in step ten
    to register a new SSH keypair with AWS, where `$public_key` is the entire contents of
    the public key that you received in step ten.
    ```shell
    aws ec2 import-key-pair \
      --key-name "hostmaster@`hostname`" \
      --public-key-material "$public_key" | jq -r '.KeyName';
    ```

14. Now, use Docker Machine to provision one or more new machines in this cell. Docker
    Machine will keep track of the underlying instances it creates, and will persist the
    instance identifiers and accounting information to disk on the gateway instance.
    Run the following command, where `$vpc_id` is the VPC identifier you created during VPC
    setup, `$subnet_id` is the subnet in which you wish to deploy the new machine, `$region`
    is the region in which the VPC was created, `$az` is the availability zone (e.g. `a`,
    `b`, `c`) that `$subnet_id` exists in, `$instance_type` is the type of instance to create
    (e.g. `m5.large`), `$root_size` is the size of the machine's root filesystem, and `$name`
    is the name of the new machine. To provision multiple machines for the cell, simply repeat
    this process. 
    ```shell
      docker-machine create \
        --driver amazonec2 --amazonec2-region "$region" --amazonec2-zone "$az" \
        --amazonec2-private-address-only --amazonec2-ami ami-f4f21593 \
        --amazonec2-vpc-id "$vpc_id" --amazonec2-keypair-name "hostmaster@`hostname`" \
        --amazonec2-ssh-keypath ~/.ssh/id_rsa --amazonec2-root-size "$root_size" \
        --amazonec2-subnet-id "$subnet_id" --amazonec2-instance-type "$instance_type" "$name"
    ```

15. To point `docker` to a specific Docker Machine, run the following command in your
    shell, where `$name` is the machine name you used in the previous step.
    ```shell
    eval "`docker-machine env "$name"`"
    ```
    Docker Machine setup is now complete.

Container Deployment
====================

To do: Explain how to pull and deploy containers on a specific Docker Machine instance.


Elastic Load Balancer Rule Management
=====================================

To do: Explain how to add load balancer target groups and rules, and how to tag Docker
resources in order to provide linkage to AWS ALB rules and target groups.

