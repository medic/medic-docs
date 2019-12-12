# Fixing Couch2pg Out of Memory errors
Some times when couch2pg is replicating documents to postgres, it encounters very large info docs that are larger than the memory allocation of the document sync array.
To fix this, we need to delete this document so that couch2pg can proceed.  Below are steps to follow to achieve this. 

1. Reduce the size of the replicated docs to a value of say 4 in the couch2pg.conf file so that you can get within the range of the failing document.
2. Clone the existng [couc2pg](https://github.com/medic/couch2pg) repo so that you can run couch2pg locally
3. Edit the file lib/importer.js in the couch2pg source code to be able to log the doc-id of the problem doc
4. Edit  just logs doc_ids to the console 
Around line 100  of importer.js 
  `console.log(row.doc._id);`

5. Get the remote couc2pg environment variable settings and export them into your profile terminal
6. Create an ssh reverse tunnel from the postgres server to your laptop

7. Run couch2pg locally so that you can see the doc-ids on console till it fails

8. From the ids printed on console try loading the docs in the couchdb web access(Futon or Fauxton) , the problem doc is usually big and won't load 

10. This will help you identify the problem doc

11. Curl the document to your pc and back it up 

12. Back up the document for further analysis

13. Delete the document using curl
`curl --head "<HOST>/<DB>/<DOC_ID>"`
This returns something like 
`HTTP/1.1 200 OK
Cache-Control: must-revalidate
Content-Length: 307
Content-Type: application/json
Date: Tue, 25 Jun 2019 11:58:29 GMT
ETag: "2-6beeb38da9b096bacfe2fa769e5171be"
Server: CouchDB/2.3.1 (Erlang OTP/21)
X-Couch-Request-ID: e4aa7a8696
X-CouchDB-Body-Time: 0`

ETag is the rev 
Delete document with curl 
`curl -X DELETE "<HOST>/<DB>/<DOC_ID>?rev=<THE_REV>"`
