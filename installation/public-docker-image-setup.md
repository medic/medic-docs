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

## Download Medic Mobile Image:

Open your terminal and run this command:

```
docker pull medicmobile/medic-os
```

## Usage

To run the docker container, simply enter this command:

```
docker run -t -p 5988:5988 -p 80:80 -p 443:443 medicmobile/medic-os
```
Note the `New CouchDB Administrative User` and `New CouchDB Administrative Password` in the output terminal. These are the login credentials to use in the next step. 
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
