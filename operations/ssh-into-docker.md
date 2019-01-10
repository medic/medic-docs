# SSH into a Docker image

1. Work out the name of the AWS instance your Docker container is running in, eg: "development-2a-1"
  - Log in to AWS
  - Select the availability zone (likely to be London)
  - Go to EC2 instances and select the instance
  - Check the tags for the name
2. ssh in to the Docker instance: `ssh -J admin@gateway.dev.medicmobile.org admin@<instance_name>`
3. Work out the name of the Docker container you want to connect to, eg: "alpha-dev". Get a list of available containers with: `sudo docker ps`
4. Connect to the container: `sudo docker exec -it <container-name> /bin/bash`
