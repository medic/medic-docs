# Self Hosting

## How to access container, retrieve logs, isolate security groups
* How to restart services: Link to medic-os documentation
https://github.com/medic/medic-os#service-management-scripts
`/boot/svc-<start/stop/restart> <service-name/medic-api/medic-sentinel/medic-core couchdb/medic-core nginx>`

## AWS docs for increasing disk size:
* Stop medic: `sudo supervisorctl stop medic`
* Go to EBS in AWS and take a snapshot of the volume.
* Modify the volume size (Increase it by 2x preferably). Wait until the modification succeeds.
* Follow the following link to make the instance recognize the additional space: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html
* Turn medic back on: `sudo supervisorctl start medic`

## Links to medic documentation for horticulturalist for upgrades:
* log into container & run: `COUCH_NODE_NAME=couchdb@127.0.0.1 COUCH_URL=http://medic:<pw>@localhost:5984/medic /srv/software/horticulturalist/node_modules/.bin/horti --medic-os --install=<version>`

## Monitoring & Backup
* AWS CloudWatch and monitoring tab. Enable detailed monitoring (This costs more money)
* Set up Lifecycle Management for EBS snapshots:
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html#snapshot-lifecycle-console
* Steps to mounting a backup snapshot to the instance and restarting the application
* Please see the second-half of “Increasing disk size” reference above
* Setup a TLS cert & DNS registration