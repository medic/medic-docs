# Replicating production data locally

Sometimes there will be a production problem that you need to dig into locally to solve. This guide explains how to:
 - Copy the data to a new local CouchDB database
 - Set up a local deploy correctly so that you can use that data.

### First, a note about data safety

Our production data is medical data. It's HIV statuses and pregnancies. It's important, and it's not yours. If you're downloading it, do so on an [encrypted drive](../support/securing-computers.md) and delete it once you're done with it.

## Step 1, get the data

First thing is to get the data onto your local CouchDB. It's advisable to create a new DB for this, so that you have a fresh untouched collection of PROD data that isn't mixed in with anything you have locally.

### Small production instances

If their isn't much data you can just replicate the entire DB locally. You can do this either from your local futon, or from the command line.

For futon, navigate to http://localhost:5984/_utils/#/replication/_create , and note that you need to put the server's credentials in basic auth style (`https://user:pass@domain/`)
For command line, see: http://docs.couchdb.org/en/2.1.1/api/server/common.html#post--_replicate

The main thing to note is that replication may stall on one document, and you may end up with your local DB having one less document than the prod one. This is due to how our URLs are setup: the replicator gets confused and considers `login` (ie `https://url/login`) to be a document. You're good to go once you have one less than prod.

### Large production instances

If it's too large to replicate locally, you can replicate just a portion of it by using our application to restrict the data.

The goal here is to get a subset of data from prod into a DB on your local CouchDB.

**I'd recommend doing this on Chrome. I have been unable to get this to work in Firefox (due to CORS issues). If anyone gets it working in Firefox update this document with instructions :-)**

 - Log in to the production server as the user that you want, in your browser. _(If you want more data, like an entire district, you could consider creating a user at the right level and log in as them, but that is an exercise for the reader)_
 - Wait for them to replicate all the data into your browser. You know this is done once the app lets you interact with it
 - Make sure your local CouchDB has CORS enabled: http://docs.couchdb.org/en/2.1.1/config/http.html?highlight=CORs
 - Open your browsers console and use PouchDB to replicate from your browser to your local CouchDB: `PouchDB.replicate('medic-user-XXX', 'http://your:admin@localhost:5984/YYY');`. Here `XXX` is the name you logged in as, and `YYY` is where you want to put that data.
   - **NB**: If your browser complains about mixed content or unsafe scripts you'll need to work out how to bypass that. For Chrome there is a shield on the far right of the address bar which lets you reload the page and allow unsafe scripts.
   - **NB**: If you get 401s make sure that: your CouchDB credentials are right; you don't have a local session in the same browser already (session cookies can take precedence over basic auth);  and if you're running CouchDB in Docker you have exposed both `5984` and `5986` to localhost.
 - You can then log out of prod and clear your data from the developer console (Application -> Clear storage)

### Regardless, do this too

To log in as a specific prod user you need to also copy them from the prod `_users` database into your own local `_users` database. The simplest way to do this is to just open the DB in futon, find the document and copy it on your clipboard, then create a new document in your local `_users` DB and paste it in, deleting the `_rev` property.

You could also use this opportunity to change the password to something easier to work with locally. To do this, add a `password` property with the password you want in plain text. CouchDB will convert this to a properly hashed password on save.

## Step 2, run it locally

You can, in theory, run Medic from any DB. However, to avoid edge cases we're going to stick with the `medic` database.

First you need to decide if you need a local development environment (unless you already have one, in which case you might as well use it), or are happy to just use [Horticulturalist](https://github.com/medic/horticulturalist).

A local development environment will be useful to you if:
 - You want to change code locally
 - You want to see useful, non-minified stack traces, or otherwise browse / step through non-minified code in the browser
 - You want to deploy a version of the code older than `2.14.0`, as they are not available in Horticulturalist's repos.

### Option 1, local development environment

If you don't already have a local dev env, follow the instructions on the [medic repo](https://github.com/medic/medic).

Now you need to:
 - **Clear your db** by stopping everything and deleting the `medic` DB
 - **Bootstrap your data** by replicating your local PROD DB into a new `medic` database.
 - **Bootstrap the app** by running `grunt` to push the code you want to run it against
 - **Prepare to configure** by running api until it's completed, which lets you run `medic-conf`
 - **Re-configure** by running `medic-conf --local` in the correct directory for your project
 - **Re-migrate config** by stopping api, deleting the `migration-log` CouchDB document and starting api again

Once you've done all of that you should be able to log in with your user.

### Option 2, horticulturalist

Follow the instructions on the [medic repo](https://github.com/medic/horticuluralist) to get it installed.

Then:
 - Make sure that the `medic` DB doesn't exist, so that you have a fresh database
 - Replicate your local PROD DB into a new `medic` database.
 - Run `horti --local --bootstrap=XXX`, where `XXX` is the version you want to use (presumably the same one as production!)
 - Once that has completed, run `medic-conf --local` in the correct directory for your project to push your project config up to your local deployment

You should now be able to log in as that user locally!
