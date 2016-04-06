# How to bulk load users

First create the facility structure you need using the webapp.

- Typically one top level place (District/Branch)
- Save the top level ID for later.

Then use curl against the users API to create the user, place and contact. In
this example the place and contact.parent are the same so we're creating
`demo*` users that can manage records associated to a specific place.

Create a comma separated data file like /tmp/data:

```
Name,Phone,Username,Password,
Gary Gannu,48839938,demo01,keratejevu
Dianna Dempsey,4999393,demo02,duwuradixu
```

Create a script like `users-bulk-load` and edit it to include the district:

```
#!/bin/sh

#PHONE_PREFIX=+256
DISTRICT=5627c50f05a75003fe51685c596fefee

COUCH_URL=${COUCH_URL-http://admin:secret@localhost:5988}
LANG=en # no language prompt, please.
KNOWN=true # no tour, please.
IFS=$',' # comma delimited

while IFS=$IFS read name phone username password; do \
  curl -v -H 'content-type:application/json' -d '{
    "username":"'"$username"'",
    "password":"'"$password"'",
    "type":"district-manager",
    "place": {
      "name": "'"$name Area"'",
      "type": "health_center",
      "parent": "'"$DISTRICT"'"
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
