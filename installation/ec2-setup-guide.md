# Setup guide on EC2
## Activity: Configure self-hosting
### 1. Create EC2 (use security best practices)

```
Be sure to change the file permissions to 0600 or lower
for the .pem file:
sudo chmod 0600 ~/Downloads/name_of_file.pem
```

- [Create Elastic IP and Associate EIP to EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)

`Goal`: SSH into instance

### 2. Create or Restore EBS Volume
- Create EBS Volume
    - Be sure to tag appropriately
- [Restore EBS Volume](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ebs-restoring-volume.html)
- Attach volume to EC2 instance
- (Optional): [Increase disk size](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)

- If you are using a newly created EBS Volume, you will have to format the disk approriately:
    1) SSH into instance
    2) Follow the instructions here: [Using EBS Volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)
    3) Use `sudo mkfs -t ext4 <location>` in step 4
    4) Mount disk to /srv

`Goal`: Mount EBS volume to /srv

### 3. Provision Docker server
- Follow README & Run scripts: [https://github.com/medic/medic-infrastructure/tree/master/self-hosting/prepare-system](Self-Host Prepare System)
- A zip will be shared via Slack until the scripts are moved to a public repo

`Goal`: CHT Application bootstraps and comes online

### 4. DNS configuration
- Point A records to Elastic IP given to Docker server

### 5. Review SSL certs
- Location of certs is `/srv/settings/medic-core/nginx/private/`
- Name the key file as `default.key` and the certificate file as `default.crt`
- Restarting nginx with new certs: `svc-restart medic-core nginx`

### 6. Configure couch2pg
- Basic configuration: https://github.com/medic/medic-couch2pg/blob/master/README.md
- Supervision/monitoring/notification

### 7. Setup postgres to work with couch2pg
- Creating the database, setting up permissions, exploring the tables and what they store

### 8.Debugging couch2pg/postgres
- Understanding the log and what the entries mean

## Activity: Troubleshooting
### 1. Restarting processes
- https://github.com/medic/medic-docs/blob/master/installation/self-hosting.md#how-to-access-container-retrieve-logs-isolate-security-groups
- https://github.com/medic/medic-os#service-management-scripts

### 2. Investigating logs
- Log into container: https://docs.docker.com/engine/reference/commandline/exec/
- Helpful docker commands: https://github.com/medic/medic-docs/blob/master/installation/public-docker-image-setup.md#helpful-docker-commands
- Inside container, all appropriate logs can be found in: `/srv/storage/<service_name>/logs/*.log`

### 3.Upgrading the container
- Backup all data (EBS) 
- Log into container and stop all services
- DO NOT REMOVE `/srv/storage/medic-core/`, `/srv/settings/medic-core/couchdb/local.ini`, wipe all other files in /srv [Note: Make script publicly accessibile]
- Change the image tag to the newest image release version:
https://github.com/medic/medic-docs/blob/master/installation/public-docker-image-setup.md#download-medic-mobile-image--setup-custom-docker-network
- Change image tag in docker-compose file: https://github.com/medic/medic-docs/blob/master/installation/public-docker-image-setup.md#use-docker-compose
- Launch new containers with appropriate COUCHDB_ADMIN_PASSWORD & HA_PASSWORD environment variables

### 4.Upgrading the webapp
- Use Admin GUI page
- CLI via horticulturalist: https://github.com/medic/medic-docs/blob/master/installation/self-hosting.md#links-to-medic-documentation-for-horticulturalist-for-upgrades

### 4a. RDS help
- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html

## Activity: Restore from backup and monitoring
### 1. Configure backups
- EBS Snapshot Lifecycle Manager: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html

### 2. Restoring from backup
- Create volume from snapshot
- Tag appropriately for backups
- Mount volume to docker server

### 3. Process supervison
- supvisorctl
- /boot/supervisor-inspect

### 4. Monitoring
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html

## Activity: Own Infrastructure Setup
### 1. Team to set up own infrastructure based on best-practices and recommendations above







