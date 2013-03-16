# Garden Setup

This document describes the steps needed to setup and install Kujua and the
Garden. This document will get phased soon once the process is more
streamlined.

## Prerequisites

* You have a freshly installed Medic Mobile Virtual Appliance running and know the IP address
* You have the CouchDB Admin password

## Configure

* Navigate your browser to Futon by appending `:5984/_utils` to the IP address.
* Choose Login in the bottom right corner and enter the username `admin` and
  your Medic VM password.

![Login to Futon](img/garden/login_to_futon.png)

### Change Auth settings

Navigate to configuration in the right column and click the following values, change them then hit enter.

* Change `allow_peristent_cookies` to `true`.
* Change `require_valid_user` to `true`.
* Change `timeout` to `86400`.

![CouchDB Vals](img/garden/couch_httpd_auth_vals.png)

### Replicate OHW Nepal market and user seed data

Navigate to Replicator on the right column and replicate the market seed data:

* Choose Remote
* Paste in market seed URL: `http://admin:4b20ab@mandric.iriscouch.com/markets-seed`
* Enter `dashboard` into Local DB name
* Click Replicate and wait or spinner to complete
* Verify 1 document was written

![CouchDB Vals](img/garden/replicate_market_seed.png)

Now do the same thing for user data:

* Choose Remote
* Paste in seed URL: <br/>
  `http://admin:4b20ab@mandric.iriscouch.com/ohw-nepal-seed`
* Enter `kujua-base` into Local DB name
* Click Replicate and wait or spinner to complete
* Verify 2 documents were written

![Replicate Users](img/garden/replicate_ohw_seed.png)

## Install Kujua via Garden Dashboard

* Navigate your browser to the dashboard URL by appending this to your IP
address and port: `/dashboard/_design/dashboard/_rewrite/`

### Install Kujua

![Install Kujua](img/garden/install_garden_app.png)

Then choose Medic Market:

![Choose Medic Market](img/garden/choose_medic_market.png)

Then choose Install:

![Install Kujua](img/garden/choose_kujua_app.png)

Again:

![Install Kujua](img/garden/install_kujua.png)

And confirm:

![Confirm Install](img/garden/confirm_install.png)

Once the install is complete choose the option to configure app:

![Choose configure app](img/garden/install_complete.png)

### Configure

