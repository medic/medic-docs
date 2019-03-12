# Install

## Intro

This document should help you quickly install the necessary tools to download and run the Medic Mobile public docker image.

## Download Docker

Mac OSX:
` Docker for Mac` : 
[Docker for Mac](https://download.docker.com/mac/stable/Docker.dmg)

Windows:
` Docker for Windows` :
[Docker for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

Open the installation and follow the instructions

Launch Docker. 

Performance Settings that can be changed:
Memory: 4 GiB
CPUs: 2

## Use Docker-Compose:

In the location you would like to host your configuration files, create a file titled <project_name>-medic-os-compose.yml with the following contents:
```
version: '3.1'

services:
  medic-os:
    image: medicmobile/medic-os:3.2.1-rc.4
    volumes:
      - /srv:/srv
    ports:
      - 443:443
      - 80:80
    working_dir: /srv
    network_mode: host
    
  haproxy:
    image: medicmobile/haproxy:rc-1.16
    volumes:
      - /srv:/srv    
    depends_on:
      - medic-os
    network_mode: host
    environment:
      - COUCHDB_HOST=localhost
      - HA_PASSWORD=${HA_PASSWORD}
```

## Download Medic Mobile Image:

Open your terminal and run this command:

```
# Current image build
docker pull medicmobile/medic-os:3.2.1-rc.4

# Latest tag
# Ensure your local system does not include a previously downloaded medic-os image with the latest tag
docker pull medicmobile/medic-os:latest

# Pull down our haproxy image
docker pull medicmobile/haproxy:rc-1.16
or
docker pull medicmobile/haproxy:latest
```

## Usage

To run the docker container, simply enter this command:

```
docker run -t -p 5988:5988 -p 80:80 -p 443:443 medicmobile/medic-os
```

If you wish to run multiple projects, you will need to change the above ports:

```
docker run -t -p 5989:5988 -p 81:80 -p 444:443 medicmobile/medic-os
```

Note the `New CouchDB Administrative User` and `New CouchDB Administrative Password` in the output terminal. These are the login credentials to use in the next step.


If you have any **port conflicts**, substitute with an unused local port. For reference, the port forwarding syntax is as follows `<forwarded-port>:<port-from-docker>`

To find out which service is using a conflicting port:

On Linux
```
sudo netstat -plnt | grep ':<port>'
```

On Mac (10.10 and above)
```
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep ':<port>'
```

After bootstrap, visit: https://localhost and accept the self-signed SSL certificate warning.
(Use the login credentials shown in the terminal output when the docker container was launched).
## Helpful Docker commands

```
# list running containers
docker ps

# ssh into container/application
docker exec -it <container_name> /bin/bash


# View container stderr/stdout logs:
docker logs <container_name>
```

## Clean Up

```
# list running containers
docker ps

# list all available docker containers with their status
sudo docker ps -a

# stop container
docker stop <container ID>

# start container
docker start <container ID>

# list all stoped containers 
docker ps -f "status=exited"

```
