# Install

## Intro

This document should help you quickly install the necessary tools to download and run the Medic Mobile public docker image.

## Download Docker

Ubuntu: 
- *Note*: Install both below
- [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Docker-Compose](https://docs.docker.com/compose/install/)

Mac OSX:
- [Docker for Mac](https://download.docker.com/mac/stable/Docker.dmg)

Windows:
- *Note*: If you have Hyper-V Capability, please ensure it is enabled in order to run Linux Containers on Windows. If you are running your Windows Server in cloud services, please ensure it is running on [bare-metal](https://en.wikipedia.org/wiki/Bare_machine). You will not be able to run Linux Containers in Windows if the previous comments are not adhered due to nested virtualization. 
- [Docker for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)
- *Note*: If you do not have Hyper-V capability, but your server still supports virtualization, ensure that is enabled in your BiOS, and install the following package:
- [Docker Toolbox using VirtualBox](https://github.com/docker/toolbox/releases)

Run the installation and follow the instructions.

Launch Docker. 

Performance Settings that can be changed:
Memory: 4 GiB
CPUs: 2

## Use Docker-Compose:

In the location you would like to host your configuration files, create a file titled <project_name>-medic-os-compose.yml with the following contents:

```
version: '3.7'

services:
  medic-os:
    container_name: medic-os
    image: medicmobile/medic-os:cht-3.7.0-rc.1
    volumes:
      - medic-data:/srv
    ports:
     - 80:80
     - 443:443
    working_dir: /srv
    depends_on:
      - haproxy
    networks:
      - medic-net
    environment:
      - DOCKER_NETWORK_NAME=haproxy
      - DOCKER_COUCHDB_ADMIN_PASSWORD=$DOCKER_COUCHDB_ADMIN_PASSWORD

  haproxy:
    container_name: haproxy
    image: medicmobile/haproxy:rc-1.16
    volumes:
      - medic-data:/srv    
    environment:
      - COUCHDB_HOST=medic-os
      - HA_PASSWORD=$DOCKER_COUCHDB_ADMIN_PASSWORD
    networks:
      - medic-net

volumes:
  medic-data:
    name: medic-data

networks:
  medic-net:
    name: medic-net
```

Export a password for admin user named `medic`:
```
export DOCKER_COUCHDB_ADMIN_PASSWORD=<random_pw>
```

### Launch docker-compose containers

Inside the directory that you saved the above <project_name>-medic-os-compose.yml, run:
```
$ docker-compose -f <project_name>-medic-os-compose.yml up
```
*Note* In certain shells, docker-compose may not interpolate the admin password that was exported above. In that case, your admin user had a password automatically generated. Note the `New CouchDB Administrative User` and `New CouchDB Administrative Password` in the output terminal. You can retrieve these via running `docker logs medic-os` and searching the terminal.

Once containers are setup, please run the following command from your host terminal:
```
$ docker exec -it medic-os /bin/bash -c "sed -i 's/--install=3.7.0/--complete-install/g' /srv/scripts/horticulturalist/postrun/horticulturalist"
$ docker exec -it medic-os /bin/bash -c "/boot/svc-stop medic-core openssh && /boot/svc-stop medic-rdbms && /boot/svc-stop medic-couch2pg"
```

The first command fixes a postrun script for horticulturalist to prevent unique scenarios of re-install.
The second command stops extra services that you will not need.

### Visit your project

Open a browser to: https://localhost

You will have to click to through the SSL Security warning. Click Advanced -> Continue to site.

### Delete & Re-Install

Stop containers:
* `docker-compose down` or `docker stop medic-os && docker stop haproxy`

Remove containers:
* `docker-compose rm` or `docker rm medic-os && docker rm haproxy`

Clean data volume:
* `docker volume rm medic-data`

After following the above three commands, you can re-run `docker-compose up` and create a fresh install (no previous data present)

## Use Kitematic (GUI for Docker tools)



## Port Conflicts

In case you are already running services on HTTP(80) and HTTPS(443), you will have to map new ports to the medic-os container.

Turn down and remove all existing containers that were started: 
* `docker-compose down && docker-compose rm`

To find out which service is using a conflicting port:
On Linux:
```
sudo netstat -plnt | grep ':<port>'
```
On Mac (10.10 and above):
```
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep ':<port>'
```
You can either kill the service which is occupying HTTP/HTTPS ports, or run the container with forwarded ports that are free.
In your compose file, change the ports under medic-os:
```
services:
  medic-os:
    container_name: medic-os
    image: medicmobile/medic-os:cht-3.7.0-rc.1
    volumes:
      - medic-data:/srv
    ports:
     - 8080:80
     - 444:443
```
*Note*: You can substitute 8080, 444 with whichever ports are free on your host. You would now visit https://localhost:444 to visit your project.

## Helpful Docker commands

#### ssh into container/application & view specific service logs

* ssh: `docker exec -it medic-os /bin/bash`

#### Once inside container:
* view couchdb logs: 
  - #less /srv/storage/medic-core/couchdb/logs/startup.log
* view medic-api logs: 
  - #less /srv/storage/medic-api/logs/medic-api.log
* view medic-sentinel logs: 
  - #less /srv/storage/medic-sentinel/logs/medic-sentinel.log


#### View container stderr/stdout logs:
* docker logs medic-os
* docker logs haproxy


#### Clean Up

```
# list running containers
docker ps

# list all available docker containers with their status
sudo docker ps -a

# stop container
docker stop <container_id>

# start container
docker start <container_id>

# list all stoped containers 
docker ps -f "status=exited"

```

#### Prune entire Docker system
docker system prune
docker volume prune

