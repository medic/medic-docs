# Replicating production data locally

Sometimes there will be a production problem that you need to dig into locally to solve. This guide explains how to:

* Copy the data from an instance to a local CouchDB database
* Run that data with a local build

## First, a note about data safety

Our production data is medical data. It's HIV statuses and pregnancies. It's important, and it's not yours. If you're downloading it, do so on an [encrypted drive](../support/securing-computers.md) and delete it once you're done with it.

## Step 1: Get the data

First thing is to get the data onto your local CouchDB. It's advisable to create a new DB for this, so that you have a fresh untouched collection of data that isn't mixed in with anything you have locally.

### Small production instances

If there isn't much data you can replicate the entire DB locally. You can initiate this either from your local Fauxton, or from the command line. You must use an administrator username and password for this for both the source and destination.

For Fauxton, navigate to http://localhost:5984/_utils/#/replication/_create
For command line, see: http://docs.couchdb.org/en/2.1.1/api/server/common.html#post--_replicate

Note that replication may stall on one document, and you may end up with your local DB having one less document than the source. This is due to how our URLs are setup: the replicator gets confused and considers `login` (ie `https://url/login`) to be a document. You can safely ignore this difference - you're good to go once your destination database has one less document than the source.

### Large production instances

If the instance is too large to replicate locally (or you are too impatient), you can replicate the data accessible to a single user. This process downloads a user's data into a browser and then copies that data into a CouchDB database.

1. Open Firefox and navigate to `about:config`. Set `security.csp.enable` to `false` to disable Content Security Policies.
1. Navigate to the instance and login as the user with the data you want. _(If you want more data, like an entire district, you could consider logging in as a new user with a contact document at your desired place in the contact hierarchy. But that is an exercise for the reader)_
1. Wait for the data to replicate. You know this is done once the app lets you interact with it. _(If you want to get the user's data before purging, consider disabling purging. Another exercise for the reader)_
1. Make sure your local CouchDB has CORS enabled: http://docs.couchdb.org/en/2.1.1/config/http.html?highlight=CORs. Consider using [add-cors-to-couchdb](https://github.com/pouchdb/add-cors-to-couchdb#what-it-does) or its recommended settings.
1. Allow your CouchDB to be accessible via `https`. One way is to run `ngrok http 5984` to make your CouchDB accessible via a url like https://abcd1234.ngrok.io.
1. Open the console in Firefox and run `await PouchDB.replicate('medic-user-XXX', 'https://your:admin@abcd1234.ngrok.io/YYY');`. Here `XXX` is the name you logged in as, and `YYY` is the name of a database in which to store the data.
   * **Note**: If you get 401s make sure that: your CouchDB credentials are right; and you don't have a local session in the same browser already (session cookies can take precedence over basic auth);  and if you're running CouchDB in Docker you have exposed both `5984` and `5986` to localhost.
1. Wait for the replication to complete. In Fauxton you should see the database YYY with the same number of documents reported during the user's initial replication.
1. Log out of the instance and clear your data from the developer console (Application -> Clear storage).
1. Navigate to `about:config`. Set `security.csp.enable` to `true` to re-enable Content Security Policies.

### Regardless, do this too

To log in as a specific prod user you need to also copy them from the prod `_users` database into your own local `_users` database. The simplest way to do this is to just open the DB in Fauxton, find the document and copy it on your clipboard, then create a new document in your local `_users` DB and paste it in, deleting the `_rev` property.

You could also use this opportunity to change the password to something easier to work with locally. To do this, add a `password` property into the document with the password you want in plain text. CouchDB will convert this to a properly hashed password on save.

## Step 2, run it locally

First you need to decide if you need a local development environment (unless you already have one, in which case you might as well use it), or are happy to just use [Horticulturalist](https://github.com/medic/horticulturalist).

A local development environment will be useful to you if:

* You want to change code locally
* You want to see useful, non-minified stack traces, or otherwise browse / step through non-minified code in the browser
* You want to deploy a version of the code older than `2.14.0`, as they are not available in Horticulturalist's repos.

### Option 1, local development environment

If you don't already have a local dev env, follow the instructions on the [development setup instructions](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md).

Then you need to:

1. Push the code you want to run via `COUCH_URL=http://your:admin@localhost:5984/YYY grunt deploy`.
1. Start API and Sentinel by running `COUCH_URL=http://your:admin@localhost:5984/YYY node api/server`.

Once you've done all of that you should be able to log in with your user.

### Option 2, horticulturalist

Follow the instructions on the [horticulturalist repo](https://github.com/medic/horticulturalist) to get it installed. Then:

1. Make sure that the `medic` DB doesn't exist, so that you have a fresh database.
1. Replicate your local PROD DB into a new `medic` database using the Fauxton console.
1. Run `horti --local --bootstrap=XXX`, where `XXX` is the version you want to use (maybe the same one as production?)

You should now be able to log in as that user locally!
