## Replicating with Futon

Typically when creating  a new instance of Kujua Lite, one of the first configuration steps is 
to copy some data that is shared amongst all instances.

You will have your own unique seed data URL, this is an example.

* Navigate your browser to Futon by appending `:5984/_utils` to the IP address.
* Choose Replicator on the right column and replicate the market seed data:
* Choose Remote
* Paste in seed URL: <br/>
  `http://admin:123qwe@mandric.iriscouch.com/ohw-nepal-seed`
* Enter `dashboard` into Local DB name
* Click Replicate and wait or spinner to complete
* Verify some documents were written

![CouchDB Vals](img/futon/replicate_ohw_seed.png)
