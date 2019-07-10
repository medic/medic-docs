# Setup guide on EC2
## Activity: Configure self-hosting
### 1. Review server requirements & best practices
### 2. Restore EBS/ Data from backup

- Restore - https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ebs-restoring-volume.html
- Attach volume to EC2 instance
- (Optional): Increase disk size - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html

### 3. Provision Docker server
- Run scripts: https://github.com/medic/medic-infrastructure/tree/master/self-hosting/prepare-system

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







