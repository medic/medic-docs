# How to bulk load users

First, using the webapp, create the top level places/facilities like
districts/branches that the users will belong to.  Save the UUIDs of these
places in a spreadsheet with their names.

Then use curl against the users API to create the user, place and contact. In
this example the place and contact.parent are the same so we're creating
`demo*` users that can manage records associated to a specific place.

Create a comma separated data file like /tmp/data:

```
Name,Phone,Branch Name,Branch UUID,Username,Password
Gary Gnu,48839938,Iganga Branch,54cc7-accd-e1cf9-ef203,demo01,keratejevu
Dianna Dempsey,4999393,Meru Branch,54cc1-1a7a-ccddd-e1203,demo02,duwuradixu
```

Create a script like `users-bulk-load` and edit it to include the district:

```
#!/bin/sh

PHONE_PREFIX=+256
#DISTRICT=5627c50f05a75003fe51685c596fefee

COUCH_URL=${COUCH_URL-http://admin:secret@localhost:5988}
LANG=en # no language prompt, please.
KNOWN=true # no tour, please.
IFS=$',' # comma delimited

while IFS=$IFS read name phone district uuid username password; do \
  curl -v -H 'content-type:application/json' -d '{
    "username":"'"$username"'",
    "password":"'"$password"'",
    "type":"district-manager",
    "place": {
      "name": "'"$name Area"'",
      "type": "health_center",
      "parent": "'"$uuid"'"
    },
    "language":"'"$LANG"'",
    "known":'"$KNOWN"',
    "contact":{
      "name":"'"$name"'",
      "phone": "'"$PHONE_PREFIX$phone"'"
    }
  }' "$COUCH_URL/api/v1/users";
done
```

Load the data into the loop:

```
tail -n+2 /tmp/data | COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
  users-bulk-load # tail skips header row
```
