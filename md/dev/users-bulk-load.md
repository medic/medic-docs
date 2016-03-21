# How to bulk load users

First create the place/facility structure you need in the webapp UI. 

- Typically one top level place and several children. 
- Save the top level ID for later.
- Save the IDs of the children places since that will be used to create the contact for the new user.

Then use curl against the users API to create the user and contact. In this example the place and contact.parent are the same so we're creating `demo*` users that can manage records associated to a specific place and an `admin1` user that can manage them all because that place is a parent in the hierarchy we created.

Create a whitespace separated data file like /tmp/data:

```
username password place contact.parent
demo01 keratejevu b8cb4bee30ff595f7025c49175ce0c88 b8cb4bee30ff595f7025c49175ce0c88
demo02 duwuradixu b8cb4bee30ff595f7025c49175cf987c b8cb4bee30ff595f7025c49175cf987c
demo03 josoboquya b8cb4bee30ff595f7025c49175cfda56 b8cb4bee30ff595f7025c49175cfda56
demo04 vijewipepa b8cb4bee30ff595f7025c49175d02141 b8cb4bee30ff595f7025c49175d02141
admin1 vafecuvame eeb17d6d5ddec2c062c4a1a0ca17d38b b8cb4bee30ff595f7025c49175d0ff21
```

Create a script like `users-bulk-load`:

```
#!/bin/sh

COUCH_URL=${COUCH_URL-http://admin:secret@localhost:5988}
LANG=en # no language prompt, please.
KNOWN=true # no tour, please.

while read username password place contact.parent; do \
  curl -v -H 'content-type:application/json' -d '{
    "username":"'"$username"'",
    "password":"'"$password"'",
    "type":"district-manager",
    "place":"'"$place"'",
    "language":"'"$LANG"'",
    "known":'"$KNOWN"',
    "contact":{
      "name":"'"$username"'",
      "parent":"'"$contact.parent"'"
    }
  }' "$COUCH_URL/api/v1/users";
done
```

Load the data into the loop:

```
COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
  users-bulk-load < tail -n+2 /tmp/data # tail skips header row
```
