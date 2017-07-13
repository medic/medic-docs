# Direct access

We block access Futon, Fauxton, Dashboard, and the CouchDB instance for security reasons. To access these services you need to tunnel into the machine.

To do this on linux use this command:

```
ssh vm@<your-host>.medicmobile.org -p 33696 -L 5984:localhost:5984
```

Now when you access `http://localhost:5984` it'll be forwarded through to your host.
