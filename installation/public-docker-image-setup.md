# Install

## Intro

This document should help you quickly install the necessary tools to download and run the Medic Mobile public docker image.

## Download Docker

Ubuntu:
`Docker CE`:[Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Mac OSX:
` Docker for Mac` : 
[Docker for Mac](https://download.docker.com/mac/stable/Docker.dmg)

*Note*: In order to run Linux Containers on Windows, please ensure Hyper-V is enabled, and the host is running on bare-metal. You will not be able to run Linux Containers in Windows if the previous comments are not adhered due to nested virtualization. 

Windows:
` Docker for Windows` :
[Docker for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

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
    image: medicmobile/medic-os:3.6.1-rc.4
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

Once containers are setup, please run the following command from your host terminal:
```
$ docker exec -it medic-os /bin/bash -c "sed -i 's/--install=3.6.1/--complete-install/g' /srv/scripts/horticulturalist/postrun/horticulturalist"
$ docker exec -it medic-os /bin/bash -c "/boot/svc-stop medic-core openssh && /boot/svc-stop medic-rdbms && /boot/svc-stop medic-couch2pg"
```

### Container Manipulation

Stop containers:
`docker-compose down` || `docker stop medic-os && docker stop haproxy`

Remove containers & clean data volume:
`docker rm medic-os && docker rm haproxy && docker volume rm medic-data`

After following the above two commands, you can re-run `docker-compose up` and create a fresh install (no previous data present)

### Visit your project

Open a browser to: https://localhost
You will have to click to through the SSL Security warning. Click Advanced -> Continue to site.


## Download Medic Mobile Image & Setup Custom Docker Network:

Legacy information is provided below. It is recommended to use the docker-compose file above.

Open your terminal and run this command:

```
# Current image build
docker pull medicmobile/medic-os:3.6.1-rc.4

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
export HA_PASSWORD=<random_gen_pw | existing_couchdb_admin>

docker run --network="host" -t medicmobile/haproxy:latest

docker run --network="host" -t medicmobile/medic-os:latest 
```

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
docker exec -it <container_id> /bin/bash


# View container stderr/stdout logs:
docker logs <container_id>
```

## Clean Up

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
