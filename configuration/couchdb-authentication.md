# CouchDB Authentication

## Invalidating Sessions

To invalidate a session in couchdb, there are two options:

1. change the session signing certificate on the server
2. change the password and/or salt for the user whose session should be invalidated

There are drawbacks to note with each.  Option **_1_** will invalidate _all_ sessions; option **_2_** will invalidate all sessions _for that user_, and also his password.

Because of the nature of couch's session management, there is no way to see a list of active/open sessions.  Invalidating a specific session key could be achieved by blacklisting a cookie value in e.g. nginx or API, but this is unlikely to be of practical value.
