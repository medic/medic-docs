# How To Upgrade 0.3 to 0.4

This document should help you upgrade an existing install of Kujua Lite 0.3 to
Medic Mobile 0.4.  There were some major changes in 0.4, you can read more in
the [Release
Notes](https://github.com/medic/medic-webapp/blob/master/Changes.md#upgrade-notes).

## Export 0.3 Configuration

### App Settings

On 0.3 navigate your browser to the settings for your app in the dashboard using your IP address:

```
http://192.168.21.4:5984/dashboard/_design/dashboard/_rewrite/settings#/apps
```

Then:

* Click the Settings button for Kujua Lite 
* Choose the App Settings Tab
* Then the Export button

The browser should download a JSON file, save this settings file for later.

### Forms

Prior to 0.4, the forms definitions were part of the build process, essentially static and you couldn't change them.  In 0.4 forms are  managed as part of the app configuration so you will need to upload them into the new instance.

Get your forms into a configuration format that can be uploaded and configured after the upgrade.  Prior to 0.4 all forms were in version control in the [json-forms repository](https://github.com/medic/medic-data-priv/tree/master/forms) so you should be able to find all forms there. Any of those files should be compatible, 0.4 expects  an array of JSON objects.


## Download latest operating system

There are changes on 0.4 dependent on CouchDB Lucene, Nginx and Gardener.  See the [Release Notes](https://github.com/medic/medic-webapp/blob/master/Changes.md#upgrade-notes) for more information.  

Download and create a virtual machine instance using the latest Medic-OS bootable ISO:

[http://dev.medicmobile.org/downloads/medic-os/latest/](http://dev.medicmobile.org/downloads/medic-os/latest/)

## Confirm Release Market

Our OS is typically bundled with alpha and beta releases of our application.  If you are running this instance in production you should subscribe to the release channel because it is the most stable.

Run this script to set your dashboard/app manager to subscribe to the release channel:

[https://github.com/medic/medic-data/blob/master/scripts/update_markets.sh](
https://github.com/medic/medic-data/blob/master/scripts/update_markets.sh)

## Migrate Data

Copy your data to the new instance.

First copy the `.couch` files to your local desktop.

```
scp -P33696 vm@192.168.21.4/srv/storage/medic-core/couchdb/data/kujua-lite.couch Desktop/
scp -P33696 vm@192.168.21.4/srv/storage/medic-core/couchdb/data/couchmark.couch Desktop/
scp -P33696 vm@192.168.21.4/srv/storage/medic-core/couchdb/data/_users.couch Desktop/
```

Copy them to the new instance:

```
scp -P33696 Desktop/*.couch vm@192.168.21.4:
```

SSH to new instance and:

1. shutdown the medic-core services
2. install the couch files, this will overwrite the existing database files.

```
sudo /boot/svc-down medic-core
sudo cp kujua-lite.couch /srv/storage/medic-core/couchdb/data/medic.couch
sudo cp couchmark.couch /srv/storage/medic-core/couchdb/data/couchmark.couch
sudo cp couchmark.couch /srv/storage/medic-core/couchdb/data/_users.couch
sudo chown root:root /srv/storage/medic-core/couchdb/data/*.couch
```

### Rename design doc

Start up couchdb:

```
sudo /boot/svc-up medic-core couchdb
```

Copy the old kujua-lite design doc to medic.  Make sure you see an ok response.

```
curl -H "Destination: _design/medic" -XCOPY http://admin:secret@localhost:5984/medic/_design/kujua-lite

{"ok":true,"id":"_design/kujua-lite","rev":"1-9671239f52ce0abd44e38f58506c9835"}
```

Delete the kujua-lite design doc, first get the design doc revision like:

```
curl -sfI -XHEAD http://admin:secret$@localhost/medic/_design/kujua-lite 

HTTP/1.1 200 OK
Server: nginx/1.5.2
Date: Fri, 03 Apr 2015 22:10:54 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 2859534
Connection: keep-alive
Vary: Accept-Encoding
X-Powered-By: Express
etag: "4-50a1732a52333d3b86163750895bf4b4"
cache-control: must-revalidate
```

Use the etag/revision value in a `rev` query parameter to delete the old couchapp:

```
curl -XDELETE http://admin:secret@localhost/medic/_design/kujua-lite?rev=4-50a1732a52333d3b86163750895bf4b4

{"ok":true,"id":"_design/kujua-lite","rev":"5-27fd5bec722e98b9ca543c5376cb85be"}
```

Note: if you get locked out of the instance because the ssh service is not running you can reboot.

## Update Dashboard

Navigate to the dashboard settings screen using your IP address:

```
http://192.168.21.4/dashboard/_design/dashboard/_rewrite/settings#/apps
```

Click the update buttons that are visibile to get the dashboard and medic mobile on the latest release versions.  If there is a problem refresh the browser screen and try again.

## Configure

Now apply your previously exported settings to the new instance, so the new instance has the right configuration.

### Upload Forms

Navigate to the forms settings screen and upload your forms.  Even if it looks like the right forms are installed, re-install them anyway.

```
http://192.168.21.4/medic/_design/medic/_rewrite/settings#tab-forms
```

## App migration is done

You should be able to load the app in your browser now and see your data but with a new interface.

```
http://192.168.21.4/
```

If there is a lot of data that needs to be re-indexed, you might see a spinner for a few minutes before the app starts responding normally.


# Upgrade Gateway


See [SMSSync Setup](https://github.com/medic/medic-docs/blob/master/md/install/smssync.md)
