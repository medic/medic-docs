# Purging server-side [beta]

*Only available in 3.7.0 and above*

Purging is a tool that allows you to increase performance and available disk space for 
offline users (eg CHWs) by removing unneeded documents from their device.

As users continually generate new reports their performance may naturally degrade as a result. 
You can use purging to remove older documents that are no longer relevant from their devices. 
Purging only removes documents from user's devices: these reports are still available for 
online analytics and impact metrics.

Purging is disabled by default, and is enabled if a purge function is specified in 
`app_settings.json`, along with a run schedule.

The following example would purge all reports that were created more than a year ago:
```json
{
    "//": "other app_settings settings",
    "purge": {
        "fn": "function(userCtx, contact, reports, messages) { const old = Date.now() - (1000 * 60 * 60 * 24 * 365); return reports.filter(r => r.reported_date < old).map(r => r._id);}",
        "text_expression": "at 12 am on Sunday"
    }
}
```


**Purging is both very powerful and also very dangerous**. Read the rest of this document carefully to make sure you completely understand how to purge and the ramifications of doing so, before using purging in your project.

## How purging works server-side

Purging runs on the server on a configurable schedule. 

It will iterate over all users to generate a list of unique roles groups that represent every user. 
Each group will have their purged docs saved in an individual database.

Then, it will iterate over all existent contacts, collecting all reports about that contact along 
with all sms messages that the contact has sent or received. 
This is similar to the scoping you may have encountered when configuring [tasks](./tasks.md) and [targets](./targets.md).

The configured purge function runs over all combinations of purge scope (contact + reports + messages) 
and user context (unique list of roles) to determine which docs should be purged. 

The resulting list of docs to be purged is compared to the existent purged docs so that only the differences
are saved (old purges are reverted and new purges are added). 

A document is considered purged for a user if a document with the same id, prefixed by `purge`, 
exists in the corresponding purge database. 
The following user:
```json
{
    "name": "org.couchdb.user:<your user>",
    "roles": [
       "district_admin",
       "supervisor"
    ]
}
```
would get their purges from a `medic-purged-role-<role_hash>` where `role_hash` is an md5 hash of the
user's roles.

When users sync (includes initial sync), they will only download documents that are not purged for their roles. 

## How purging works client-side

Purging runs on the user's device at startup, before the application booting, when any of these 
conditions are met:

- The device was just setup and so initial sync just occurred.
- The user's roles list has changed
- It has been more than 7 days since the user has purged.

Purging will not run on startup if purge is not configured, if last purge occurred recently or if 
the user doesn't have an internet connection. 

When purging runs, the device calls an API endpoint that returns batches of doc ids that have
been purged since last time the same device has run purge.
The system is similar to CouchDB replication, in the sense that a `checkpointer` document 
is saved in the corresponding server-side database, that stores the `last_seq` that the device has 
downloaded and is used to get the next batch of ids.
After receiving a batch of ids, the device simply deletes the indicated docs locally, 
marking them with a `purged` flag. 

## Purging configuration

To enable purging, write your purge configuration to `purge.js` in your project root:

```js
module.exports = {
  text_expression: 'at 9 am on Sunday',
  run_every_days: 7,
  cron: '0 1 * * SUN',
  fn: function(userCtx, contact, reports, messages) {
        const old = Date.now() - (1000 * 60 * 60 * 24 * 365);
        const oldMessages = Date.now() - (1000 * 60 * 60 * 24 * 90);
      
        const reportsToPurge = reports
                                 .filter(r => r.reported_date < old)
                                 .map(r => r._id);
        const messagesToPurge = messages
                                 .filter(m => m.reported_date < oldMessages)
                                 .map(m => m._id);
      
        return [...reportsToPurge, ...messagesToPurge];
      } 
};
```

##### Purge function configuration

As shown above, you should be exporting a property `fn` defining a self contained function: 
it should have no outside dependencies - like used variables, required modules or call outside functions. 

This function takes four parameters:
 - `userCtx`, an object with the user's `roles` as fields. For more information read the [documentation for the User Context Object](https://docs.couchdb.org/en/stable/json-structure.html#userctx-object).
 - `contact`, the contact document of a patient or other contact who has reports about them.
 - `reports`, an array of all reports for that patient that are present on the server.
 - `messages`, an array of sms messages that the contact has sent or received

And should return an array of `_id` values for docs you would like to be purged 
(or `undefined` / nothing if you don't wish to purge anything). 
Only ids of docs that were passed to the function are valid for purging: you are not allowed to purge other documents.

In the cases of reports that do not have patients or their patients are not found, the `purge` function
will receive an empty object as `contact`. 
In the cases of reports about deleted patients, the `purge` function will receive a `{ _deleted: true }`
object as the `contact`. 

##### Schedule configuration

You must set a schedule for purging to run server-side.
Depending on the size of the database and server capacity, purging could be a lengthy and 
resource intensive operation, so it is recommended you run purge on a schedule that your server
can sustain (for example at nighttime in the weekends). 

You can also change the frequency of local purge downloads (default being every 7 days).

|property|description|required|
|-------|---------|----------|
|`fn`|Self-contained purge function | yes|
|`run_every_days`|The interval (in days) at which purges will be downloaded client-side. *Default 7*.|no|
|`text_expression`|Any valid text expression to describe the interval of running purge server-side. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#text)|no if `cron` provided|
|`cron`|Any valid Cron expression to describe the interval of running purge server-side. For more information, see [LaterJS](https://bunkat.github.io/later/parsers.html#cron)|no if `text_expression` provided|

Example of purge configured in your app_settings:

```json
 "//": "other app_settings settings",
 "purge": {
    "fn": "function(userCtx, contact, reports, messages) { return  []; }",
    "cron": "0 1 * * SUN",
    "text_expression": "at 1:00 am on Sun",
    "run_every_days": 5
  }
```

## Things to be aware of when purging

##### Purged documents server-side

Purging is run as a scheduled task in Sentinel. 

Purging does not touch documents in the `medic` database, everything is done in separate purge databases 
(`medic-purged-roles-<roles-hash>`).

The purge databases names contain an md5 of the JSON representation of a list of unique roles. 
They also contain a `_local/info` doc where the roles are listed in clear text.

A `purgelog` document is saved in `medic-sentinel` after every purge. The purgelog has a meaningful 
ID: `purgelog:<timestamp>`, where timestamp represents the moment when purge was completed. The doc
also contains a property `roles` with the collection of roles purge has run for, and a `duration` property
representing the time it took to run purge, in ms.
You can retrieve a list of all your purge logs, descending from newest to oldest, with this request: 

`https(s)://<host>/medic-sentinel/_all_docs?end_key="purgelog:"&start_key="purgelog:\ufff0"&descending=true`

Purging is reversible. If you update your purge function, when running purge the old invalid
purges will be deleted. This does not mean that devices will automatically re-download documents that
become unpurged. In order for the user to re-download a previously purged document, the document either
needs to be updated in the `medic` database on the server or the user has to download all data again. 

Running purge will not remove old purge databases, even if they don't correspond to any existent users. 
Their removal is a manual process. 

Purge does not run when adding new roles or adding said new roles to users. It also does not run when an existent
user is updated to have a new unique list of roles (one that purge has not run over yet). 
This means that roles need to be planned carefully in order to take advantage of serverside purge. If purge
has not run for the user's list of roles at the moment of initial replication, the user will download **all** 
documents - only to be purged later. 

##### Purged documents client-side

The key thing to keep in mind while purging is that **documents that you purge are deleted on 
user's device**. This sounds obvious, but it's important to understand _how_ this affects 
the running of the application:
 - Any **rules** you have written that presume that the document exists may break. 
 For example, if the document completes a task, purging it will reopen that task, 
 unless you *also* purge the document that created the task in the first place 
 (while making sure that purging _that_ report doesn't break more things!)
 - Similarly **targets** won't be able to use the report to generate values, so counts may go 
 down or become inaccurate
 - Additionally, the **contact summary** will also lose out on being able to use that report
 - Changing the user's roles list (adding/removing roles) will cause the user to download **all purged docs ids**
 from the purge database corresponding to their new roles list. 

More subtly, you may also confuse your users!

If you purge documents too quickly, they may get confused as to whether they created the report 
or not, and may create it again, causing data problems. Users are not told that purging is 
occurring in a very obvious way: the expectation is that purging will naturally occur as 
documents become irrelevant, and so users should never really notice.

Users may search for their own documents, and use data from them in novel ways you may not anticipate. 
It's important to work with your users to ensure documents are only removed once there are no uses 
for them.

It is key then, that you test your purge rules thoroughly!
