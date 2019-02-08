# Install ssl certificate to vm
1. Install flight plan to you machine
`npm -g install flightplan`
2. Clone the the medic servers repo 

`git clone https://github.com/medic/medic-servers.git`

3. Navigate to scripts/automated_deployment  in the medic servers repo
 
`cd ~ medic-servers/scripts/automated_deployment`

4. Install fly

`flightplan install fly`

5. Comment out line 15 in flighplan.js
6. Set the url of your vm in /etc/hosts with *.dev* or *.app* urls using the vm ip address

`sudo nano /etc/hosts  
192.168.42.130  local.dev.medicmobile.org  `

7. Pull the the ssl certificate and key from *demo.dev.medicmobile.org* or *demo.app.medicmobile.org* based on your url. 
*NB*  Do this in the */scripts/automated_deployment* folder. 

`MEDIC_URL='[your vm url e.g. local.dev.medicmobile.org]' MEDIC_PW='[your local vm password e.g. medicmobile]' fly medic-production`

Enter the demo vm pass words at the prompts . You can  get these from 1password 

`Copying valid certs to medic-servers top level directory...
localhost Copying default.key...
localhost $ ssh vm@demo.dev.medicmobile.org -p 33696 "sudo cat /srv/settings/medic-core/nginx/private/default.key" > default.key
vm@demo.dev.medicmobile.org's password:`

NB. Remember to insert your vm password at respective prompt
 
