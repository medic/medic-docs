# Troubleshooting Sentinel

If messages are not going out, or if contacts are not being associated with reports, or if patients (or patient IDs) are not being generated from reports, that can be a sign of a Sentinel issue.

## What's in the logs?

 - from a terminal on your machine, ssh into the server : 

`ssh -p <portNumber> <username>@<hostname>` (ask a dev or tech lead for portNumber, username, hostname) 

 - Sentinel logs are in the `gardener` directory (gardener is the background task that restarts sentinel and api when they crash, and outputs their logs). 

`cd /srv/storage/gardener/logs`

 - Find the latest log files (The file numbers are not in order! The biggest number may not be the latest file!)
 
 `ls -lt` or `ls -lt | grep sentinel`
 
  - tail the log file : display the 500 last lines of the log file : 
  
  `tail -f -n 500 medic_medic_medic-sentinel3.log`
  
  - Is sentinel restarting a lot? Are there any errors? Stack traces which give info on where in the code it's crashing? 

## Restart sentinel

You can kill and restart sentinel by restarting gardener, the supervisor for sentinel. That will also kill and restart api.

`svc-restart gardener`

## Find how many changes sentinel still has to process 

Find the last change sentinel processed : Find the doc in `medic` database with `_id: sentinel-meta-data`. The `processed_seq` field is the last change that sentinel processed.

Find the last change on the `medic` database : `curl <server url>/medic/_changes` and look for `last_seq` field.
