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

If you get stuck feel free to escalate to a developer, who can take a look.

### If appropriate, raise a bug

If you determine (or just suspect) that the problem is caused by bad design, feel free to raise a bug to development. For example, historically read status has been stored against the document, which can easily cause conflicts if you create a document and then instantly view it with sentinel processing in the background.

While conflicts are inevitable, we want to architect away from them as much as possible. Ideally tech leads would never have to resolve conflicts.

### Regardless, resolve the conflicts

Now that you've diagnosed the problem, and perhaps reported a bug, you should resolve the conflict. This is important, as conflicts can cause important changes to not be recognised.

For a document to no longer be conflicted, there must only be one active `_rev`. You would do this by picking one rev and updating it with the changes you want to make, and then updating the others with the `_deleted: true` property.

You can tell that a document is no longer conflicted if they don't appear _in the view, or if when you request the document with `?conflicts=true` the `_conflicts` property either doesn't appear or is empty.

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
