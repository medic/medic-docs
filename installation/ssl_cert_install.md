## SSL Cert installation for Self-Hosting Setups

## Requirements
- Installed CHT-Core 3.x via docker-compose
- Your own SSL certifications (Let's Encrypt)

## Copy certs into medic-os container

```
Inside your server (you may need to use sudo before each command):
$ docker ps
$ docker cp /path/to/ssl.cert medic-os:/srv/settings/medic-core/nginx/private/ssl.crt
$ docker cp /path/to/ssl.key medic-os:/srv/settings/medic-core/nginx/private/ssl.key
```

## Edit nginx configuration file
```
Inside the medic-os docker container:
$ docker exec -it medic-os /bin/bash
# sed -i "s|default.crt|ssl.crt|" /srv/settings/medic-core/nginx/nginx.conf
# sed -i "s|default.key|ssl.key|" /srv/settings/medic-core/nginx/nginx.conf
```

## Restart services
```
Inside medic-os container:
$ docker exec -it medic-os /bin/bash
# /boot/svc-restart medic-core nginx
```

## View Nginx Logs
```
Inside container:
# cd /srv/storage/medic-core/nginx/logs/ 
access.log error-ssl.log error.log startup.og
```
