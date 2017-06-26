# Conflicts

Conflicts are a natural and unavoidable part of working in a distributed system, such as ours.

Conflicts occur when one client (eg PouchDB) attempts to replicate to another (eg CouchDB), and the document that the first has does not have the same tree of changes that the second one has.

## An example

To make it clear what's happening, let's walk through an example. If you already understand conflicts feel free to skip this section.

Let's say you register a pregnancy in the UI. And then you notice that you got the LMP wrong, so you hit edit and quickly make the change.

Meanwhile, sentinel notices that you registers a pregnancy, and before you have a chance to change the LMP, sets up a bunch of recurring messages, editing the document.

Sentinel has now made a change to the first version of your document, and you're trying to also make a change to the first version. These conflict.

## How to manage conflicts

Conflicts will appear on the #downtime Slack channel, along with the other alerts. If a server you manage has a conflict, you should do the following:

### Identify why conflicts are occuring

Take a look at the conflicts view, at `https://yourserver/medic/_design/medic-conflicts/_view/conflicts`. Each entry in that view looks like this:
```json
{
    "id": "1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8",
    "key": [
        "1-82d9a42305a79e403d9eca6a9a9daae9"
    ],
    "value": null
},
```

The `id` is the `_id` of the conflicting document, and the `key` is a list of conflicting `_rev`s.

For each conflicting document, download that document, as well as all the `_rev`s indicated in the `key` above. To download a document with a specific `_rev`, pass the `rev` parameter.

```sh
curl 'https://yourserver/medic/1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8' > doc.json
curl 'https://yourserver/medic/1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8?rev=1-82d9a42305a79e403d9eca6a9a9daae9' > doc-conflict1.json
```

Now you have all versions of the document, you can diff them and try to determine what went wrong.

A common problem, for example, might be sentinel hitting a document really quickly between you creating it and editing it.

A less common problem that requires some special attention, is UUID collisions (see below).

If you get stuck feel free to escalate to a developer, who can take a look.

### If appropriate, raise a bug

If you determine (or just suspect) that the problem could be in our code or data structures, feel free to raise a bug to development. For example, historically read status has been stored against the document, which can easily cause conflicts if you create a document and then instantly view it with sentinel processing in the background.

While some conflicts are inevitable, we want to architect away from them as much as possible. Ideally tech leads would never have to resolve conflicts.

### Regardless, resolve the conflicts

Now that you've diagnosed the problem, and perhaps reported a bug, you should resolve the conflict.

This is **extremely** important. Conflicts cause saved changes to not appear against documents silently, and could cause important document changes (eg fixing someone's EDD) to not occur.

For a document to no longer be conflicted, there must only be one active `_rev`. You would do this by picking one rev and updating it with the changes you want to make, and then updating the others with the `_deleted: true` property.

You can tell that a document is no longer conflicted if they don't appear in the view, or if when you request the document with `?conflicts=true` the `_conflicts` property either doesn't appear or is empty:

```
https://yourserver/medic/yourdocid?conflicts=true

{
  "_id": "yourdocid",
  "_rev": "2-the-current-rev"
  "_conflicts": [
    "2-a-conflicting-rev"
  ]
}
```

In the above example, `yourdocid` has two revisions that conflict with each other. Here you would need to update one of the revs (it doesn't matter which) with the other's changes, then delete the other rev. You would then see:

```
https://yourserver/medic/yourdocid?conflicts=true

{
  "_id": "yourdocid",
  "_rev": "3-the-new-rev"
}
```

#### A trivial example

Let's say that you have two documents, and the diff between them looks something like this:

```diff
===================================================================
--- 277533E3-A41B-3C46-909F-BCA038197C1E___2-2fff60be1557fdfef9915aa09e1b5119.json
+++ 277533E3-A41B-3C46-909F-BCA038197C1E___2-d2a7186380b72306d75cd64b64402575.json
@@ -1,7 +1,7 @@
 {
   "_id": "277533E3-A41B-3C46-909F-BCA038197C1E",
-  "_rev": "2-2fff60be1557fdfef9915aa09e1b5119",
+  "_rev": "2-d2a7186380b72306d75cd64b64402575",
   "data": "some shared data",
   "read": [
-    "some_user"
+    "admin"
   ]
 }
```

The problem here is clear: `some_user` and `admin` read the document at the same time. To solve this, we could add `some_user` to the revision with `admin` already in it, and then delete the `some_user` revision:

```json
 {
   "_id": "277533E3-A41B-3C46-909F-BCA038197C1E",
   "_rev": "2-d2a7186380b72306d75cd64b64402575",
   "data": "some shared data",
   "read": [
     "admin",
     "some_user"
   ]
 }
```

```json
 {
   "_id": "277533E3-A41B-3C46-909F-BCA038197C1E",
   "_rev": "2-2fff60be1557fdfef9915aa09e1b5119",
   "_deleted": true,
   "data": "some shared data",
   "read": [
     "some_user"
   ]
 }
```

#### Resolving UUID collisions

A UUID collision is a rare event where two clients (eg two android phones running our application) generate the same UUID ID for two completely different documents.

You can tell when your conflict is a UUID collision as there is no common root between the two conflicting versions. For example, one might be of type person and one might of type data_record.

These situations are more complicated, and require that you essentially recreate all conflicting versions as new documents, and fix any linkages that exist in the database.

Let's say you find the following situation:

```diff
{
  "_id": "7FADDF76-55E4-4E50-9444-5E468E61EA83"
- "_rev": "1-e4da228c29dc4ebc8b156967bbf48bd1",
+ "_rev": "1-ce40d1dc470643e2b9be9368ea9ff240",
- "type": "person"
+ "type": "data_record"
<snip a bunch more stuff that doesn't relate to each other>
}
```

You will want to do four things:
 - Download the `_rev` for the `person` and create a new document, with a new uuid, for that document (you can do this by uploadig the document without an `_id` or `_rev` parameter and let CouchDB generate them for you)
 - Do the same for the `data_record` version
 - Delete the main conflicting document `7FADDF76-55E4-4E50-9444-5E468E61EA83`

And finally, find any references to `7FADDF76-55E4-4E50-9444-5E468E61EA83`, work out which doc they were *supposed* to point to, and then edit those UUIDs to be the correct UUID `_id` from the docs you created above.

Because this should be a rare event and a generic view would be enormous, we do not ship a view that helps you find this out.

However, you can create your own view! You're going to want to create a DDOC specifically for this view. You can follow the following template to create what you want:

```json
{
  "_id": "_design/docs-by-reference",
  "views": {
    "docs-by-reference": {
      "map": "function(doc) {\n  var KEYS = [];\n\n  // TODO: consider switching this around to whitelist doc types\n  if (doc._id.match(/-info$/) ||\n      doc._id.match(/^_local/)) {\n    return;\n  }\n\n  var goDeeper = function(obj, path) {\n    Object.keys(obj).forEach(function(key) {\n      if (typeof obj[key] === 'string' &&\n          KEYS.indexOf(obj[key]) !== -1) {\n        emit(obj[key], path + '.' + key);\n      }\n\n      if (obj[key] && typeof obj[key] === 'object') {\n        goDeeper(obj[key], path + '.' + key);\n      }\n    });\n  };\n\n  goDeeper(doc, doc._id);\n}"
    }
  }
}
```

In this, add any IDs you want to be found in the `KEYS` variable at the top of the function. So in our case, we would change `KEYS` to look like this:

```js
var KEYS = ['7FADDF76-55E4-4E50-9444-5E468E61EA83']
```

Upload this document to CouchDB (do not just add the view to an existing DDOC, as you will force all views on that DDOC to regenerate) and then warm up the views by querying it once (it may take a long time to run).

Once it is complete you can query the view again to return a list of documents that reference the ids you hard-coded above.

This will help you to identify which documents are affected by this change. Usually the only change needed is to change the ID located to the new ones you generated.

```json
{
  "total_rows": 2,
  "offset": 0,
  "rows": [
    {
      "id": "1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8",
      "key": [
        "7FADDF76-55E4-4E50-9444-5E468E61EA83"
      ],
      "value": "1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8.fields.inputs.contact._id"
    },
    {
      "id": "1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8",
      "key": [
        "7FADDF76-55E4-4E50-9444-5E468E61EA83"
      ],
      "value": "1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8.fields.patient_id"
    }
  ]
}
```

In this example, there are two references to `7FADDF76-55E4-4E50-9444-5E468E61EA83`, both in the `1B7922A6-A6D6-C956-BBAE-DE5EB5A2E6C8` document, one at `fields.inputs.contact._id` and one at `fields.patient_id`.

If you get stuck, feel free to contact a developer (either a specific one, or just post in `#development`) and they can help you out.
