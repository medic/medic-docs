# Purging [beta]

*Purging is only available in 3.3.0 and above.*

Purging is a tool that allows you to increase performance and available disk space for offline users (eg CHWs) by removing unneeded documents from their device.

As users continually generate new reports their performance may naturally degrade as a result. You can use purging to remove older documents that are no longer relevant from their devices. Purging only removes documents from user's devices: these reports are still available for online analytics and impact metrics.

Purging is disabled by default, and is enabled if a purge function is specified in `app_settings.json`.

The following example would purge all reports that were created more than a year ago:

```json
{
    "//": "other app_settings settings",
    "purge": {
        "fn": "function(userCtx, contact, reports) { const old = Date.now() - (1000 * 60 * 60 * 24 * 365); return reports.filter(r => r.reported_date < old).map(r => r_.id);}"
    }
}
```

**Purging is both very powerful and also very dangerous**. Read the rest of this document carefully to make sure you completely understand how to purge and the ramifications of doing so, before using purging in your project.

## How purging works

Purging runs on the user's offline device such as their phone (online users cannot purge documents). When it runs, it runs on startup, between the initial replication check and the application booting.

Purging does not run every time the application starts, as that would be very slow. Instead, it only runs occasionally, and only when it is safe to do so.

Reasons why purging would run on startup:
 - The server has just upgraded to a version of Medic that supports purging
 - The device was just setup and so initial replication just occurred. Importantly, purging here will allow users to login who otherwise would have too many documents to be able to.
 - The purging function changed
 - Roughly every 30 days otherwise

Reasons why purging would **not** run on startup:
 - If purging is not configured
 - If we detect that the user has not fully replicated upwards. That is to say, that we think there may be a chance there are reports on the device that are not on the server
 - Purging already happened recently (eg in the last 30 days)

When purging runs, it walks through every single person in the user's DB that has reports about them (eg patients), and runs your configured function against each set of person and reports to determine if any reports should be purged. This is idential to the scoping your may have encountered when configuring [tasks](./tasks.md) and [targets](./targets.md).

## Purging function configuration

To enable purging, write your purging function to `purging.js` in your project root:

```js
function(userCtx, contact, reports) {
  const old = Date.now() - (1000 * 60 * 60 * 24 * 365);

  return reports
    .filter(r => r.reported_date < old)
    .map(r => r_.id);
}
```

As shown above, you should be declaring an _anonymous_ function (with no name).

This function takes three parameters:
 - `userCtx`, an object with the user's `name` and `roles` as fields, which is particularly useful to configure different purging functions for different roles. For more information read the [documentation for the User Context Object](https://docs.couchdb.org/en/stable/json-structure.html#userctx-object).
 - `contact`, the contact document of a patient or other contact who has reports about them.
 - `reports`, an array of all reports for that patient that are present on the device (if you have already purged a report it will not show up here).

And should return an array of `_id` values for reports you would like to be purged (or `undefined` / nothing if you don't wish to purge anything). Only ids of reports that were passed to the function are valid for purging: you are not allowed to purge contacts, other reports or any other documents.

## Other configuration

You can also change the frequency in which purging occurs. However, we recommend that you leave it as the default. Purging is not free, and purging more frequently is almost certainly not going to help performance.

Specifically, purging slows down boot time considerably, and forces PouchDB to re-index views, which is specifically a major source of performance problems on many devices.

If you're finding that even after purging your devices are running too slow, either look into if you can purge more documents, and / or talk to the product team about your specific performance issues and setup. 

If you're really sure you want to change the frequency, you can do so by setting the `run_every_days` parameter:

```json
{
    "purge": {
        "fn": "...",
        "run_every_days": 60
    }
}
```

Note that purging is not guaranteed to run as frequently as you configure, as purging only runs if we deem it safe (eg all reports are replicated upwards).

## Things to be aware of when purging

The key thing to keep in mind while purging is that **documents that you purge no longer exist on the user's device**. This sounds obvious, but it's important to understand _how_ this affects the running of the application:
 - Any **rules** you have written that presume that the document exists may break. For example, if the document completes a task, purging it will reopen that task, unless you *also* purge the document that created the task in the first place (while making sure that purging _that_ report doesn't break more things!)
 - Similarly **targets** won't be able to use the report to generate values, so counts may go down or become inaccurate
 - Additionally, the **contact summary** will also lose out on being able to use that report

More subtly, you may also confuse your users!

If you purge documents too quickly, they may get confused as to whether they created the report or not, and may create it again, causing data problems. Users are not told that purging is occurring in a very obvious way: the expectation is that purging will naturally occur as documents become irrelevant, and so users should never really notice.

Users may search for their own documents, and use data from them in novel ways you may not anticipate. It's important to work with your users to ensure documents are only removed once there are no uses for them.

It is key then, that you test your purge rules thoroughly!

## Testing

Unfortunately there is no testing framework, yet!

It is up to you to be careful with the purging rules you create, and manually test them against your real configuration (and real data) thoroughly.

As the function is anonymous it's harder to test than a normal javascript file with exports might be. You can easily solve this by loading the file as a string, wrapping it in parenthesis and then `eval`ing the result.

Here is an example in Node:

```js
const fs = require('fs');
const purgeFnStr = `(${fs.readFileSync('./purging.js', 'utf8')})`;
const fn = eval(purgeFnStr);

const results = fn(userCtx, contact, reports);
```

Here are some quick tips and things to think about:
 - Don't use JavaScript features that we do not support. See the [support matrix](../installation/supported-software.md) to determine what the minimum browser version you're allowed to use is, and use tools such as [caniuse](https://caniuse.com/) to determine if the feature you wish to use is supported.
 - Have the browser development tools open when starting the app, as any errors which may occur are written to the console
 - It is recommended you test against real data as part of your testing strategy. Once you've made sure your development environment is a suitably secure location to hold real data, you can follow [the guide to replicating production data locally](../troubleshooting/replicating-production-locally.md)
 - If the function doesn't parse (eg it's not valid JS, check your JS feature support) an error will be thrown and the app will not start at all. If you are using [medic-conf](https://github.com/medic/medic-conf/) (and you should be!) your function will fail to upload if it cannot be compiled.
 - The simplest way of getting purging to run consistently is to wipe your local application data, reload and re-login. In Chrom(e|ium), use "Clear Site Data" under the Application tab of the dev tools.
 - Test purging both when you have something to purge, as well as when there is nothing to purge. To trick purging into happening every time (provided everything is synced upward) you can set `run_every_days` to `0`. Do not do this in production.
 - Write your function defensively. You do not want it to crash.
 - Think about performance: this code will run over every single patient each user can see, and be passed every report for every patient. In the future we may kill purge function executions that take too long.
 - Finally, test the purge rules on a real device your users might use! This will help with both final bug catching, as well as giving you an idea of how long it runs for users
