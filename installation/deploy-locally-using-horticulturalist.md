# Deploy locally using Horticulturalist (beta)

[Horticulturalist](https://github.com/medic/horticulturalist) is an easy way to deploy Medic locally if you're not going to be developing against it.

Horti replaces the Market, Gardener and Dashboard as the standard way to deploy and manage Medic.

To use it locally:

- Install, [configure](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md#setup-couchdb-on-a-single-node) and [secure](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md#enabling-a-secure-couchdb) CouchDB
- Install [npm](https://npms.io/)
- Install Horticulturalist with `npm install -g horticulturalist`

Now use the `horti` tool to bootstrap Medic and launch it:

```shell
COUCH_NODE_NAME=couchdb@localhost COUCH_URL=http://myAdminUser:myAdminPass@localhost:5984/medic horti --local --bootstrap
```

This will download, configure and install the latest Master build of medic. If you're looking to deploy a specific version, provide it to the `bootstrap` command:

```shell
COUCH_NODE_NAME=couchdb@localhost COUCH_URL=http://myAdminUser:myAdminPass@localhost:5984/medic horti --local --bootstrap=3.0.0-beta.1
```

To kill Horti hit CTRL+C. To start Horti (and Medic) again, run the same command as above, but this time don't bootstrap:

```shell
COUCH_NODE_NAME=couchdb@localhost COUCH_URL=http://myAdminUser:myAdminPass@localhost:5984/medic horti --local
```

If you wish to change the version of Medic installed, you can either bootstrap again, or use the [Instance Upgrade configuration screen](http://localhost:5988/medic/_design/medic/_rewrite/#/configuration/upgrade).

**NB**: Horticulturalist doesn't wipe your database when it bootstraps, it just installs the provided version (or master) over whatever you already have. To completely start again, stop Horti and delete the `medic` database, either using Futon / Fauxton, or from the command line:

```shell
curl -X DELETE $COUCH_URL
```
