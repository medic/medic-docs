<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Design Doc Refactor](#design-doc-refactor)
- [Kanso](#kanso)
- [Properties Index](#properties-index)
  - [._attachments](#_attachments)
    - [._attachments["duality.js"]](#_attachmentsdualityjs)
    - [._attachments["modules.js"]](#_attachmentsmodulesjs)
    - [._attachments["medic-api-0.1.0.tgz"]](#_attachmentsmedic-api-010tgz)
    - [._attachments["medic-sentinel-0.1.0.tgz"]](#_attachmentsmedic-sentinel-010tgz)
    - [._attachments["ddocs/compiled.json"]](#_attachmentsddocscompiledjson)
    - [._attachments["static/dist/manifest.appcache"]](#_attachmentsstaticdistmanifestappcache)
  - [.app-settings](#app-settings)
    - [.app-settings.app](#app-settingsapp)
    - [.app-settings.shows](#app-settingsshows)
    - [.app-settings.updates](#app-settingsupdates)
  - [.app_settings](#app_settings)
  - [.cookies](#cookies)
  - [.db](#db)
  - [.duality](#duality)
    - [.duality.core](#dualitycore)
    - [.duality.events](#dualityevents)
    - [.duality.utils](#dualityutils)
  - [.events](#events)
  - [.filters](#filters)
  - [.fulltext](#fulltext)
  - [.inbox_template](#inbox_template)
  - [.kanso](#kanso)
  - [.kujua-sms](#kujua-sms)
    - [.kujua-sms.app](#kujua-smsapp)
    - [.kujua-sms.lists](#kujua-smslists)
    - [.kujua-sms.updates](#kujua-smsupdates)
    - [.kujua-sms.shows](#kujua-smsshows)
    - [.kujua-sms.rewrites](#kujua-smsrewrites)
    - [.kujua-sms.utils](#kujua-smsutils)
    - [.kujua-sms.validate](#kujua-smsvalidate)
  - [.kujua-utils](#kujua-utils)
  - [.lib](#lib)
    - [.lib.app](#libapp)
    - [.lib.fulltext](#libfulltext)
    - [.lib.filters](#libfilters)
    - [.lib.rewrites](#librewrites)
    - [.lib.validate\_doc\_update](#libvalidate%5C_doc%5C_update)
    - [.lib.views](#libviews)
  - [.libphonenumber](#libphonenumber)
    - [.libphonenumber.libphonenumber](#libphonenumberlibphonenumber)
    - [.libphonenumber.utils](#libphonenumberutils)
    - [.lists](#lists)
  - [.moment](#moment)
  - [.node_modules](#node_modules)
  - [.rewrites](#rewrites)
  - [.session](#session)
  - [.settings](#settings)
  - [.shows](#shows)
  - [.tests](#tests)
  - [.updates](#updates)
  - [.url](#url)
  - [.validate\_doc\_update](#validate%5C_doc%5C_update)
  - [.views](#views)
    - [.views.clinic\_by\_phone](#viewsclinic%5C_by%5C_phone)
    - [.views.lib](#viewslib)
    - [.views.lib.appinfo](#viewslibappinfo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Design Doc Refactor

Kanso does too much, it does its own package management and was built to support both server and client side rendering with the same code (duality).  We put too much code into CouchDB when we started this project.  This still has not been cleaned up since 0.x (prototype phase).  Most of the code in the ddoc is not being used.

Goals:

  - Remove kanso dependencies and packages directory and replace with build process that uses couch-compile.
  - Remove duality and dependencies and confirm it's not being used anywhere, trim ddoc significantly.

Longer term goals:
  
Move complexity from CouchDB to medic-api (node process), and make the app more modular, easier to understand and develop on.  Parsing messages into records should be done in medic-api, a separate process that has more flexibility, rather than inside CouchDB.  

Have a decent way to build design docs that also keeps separate components modular and testable. Separate ddoc harnesses from functions.  See example: medic-smsparser

More:

  - build and push two ddocs in `medic-webapp`: `medic-client` and `medic`
  - medic-api should have its own ddoc(s) for requirements that need couchdb
  - Refactor `kujua-*` kanso packages as npm modules and include in medic-api
  - Move any CouchDB function that requires/uses settings to medic-api
  - Add settings and forms endpoints to medic-api
  - Only use CouchDB to serve and store raw JSON data
  - Remove smssync medic branch support (http-callbacks) (done in 2.x?)
  - Refactor ddocs/medic-client
  - In development only run `npm install` when package.json changes.
  - Commit compiled ddocs to repo, deployments can use the compiled minified or unminified (debug build) ddoc
  - Only rebuild ddocs when dependencies change
  - Every ddoc component should be available as npm modules and wrapped as needed
  
# Kanso

Kanso packages we are currently dependent on is listed below.  These should all be removed or migrated to medic-api.  The ddoc should only have shows (probably only one for inbox template), views, updates and lists.  Rewrites can be moved to medic-api.

```
$ curl $COUCH_URL/medic/_design/medic | jq -r '.kanso.config.dependencies'
```

<p style="text-align: center;">or</p>

```
$ cat kanso.json | jq .dependencies
```

```
{
  "modules": null,
  "properties": null,
  "attachments": null,
  "settings": null,
  "libphonenumber": null,
  "kujua-sms": null,
  "kujua-utils": null,
  "cookies": null,
  "kanso-app-settings": null,
  "app-settings": ">=0.0.2",
  "url": null,
  "querystring": null,
  "duality": null,
  "kanso-gardener": null
}

```


# Properties Index

List of top level properties on the design doc.

```
$ curl $COUCH_URL/medic/_design/medic | jq keys 
```

```
[
  "_attachments",
  "_id",
  "_rev",
  "app-settings",
  "app_settings",
  "cookies",
  "db",
  "duality",
  "events",
  "filters",
  "fulltext",
  "inbox_template",
  "kanso",
  "kujua-sms",
  "kujua-utils",
  "lib",
  "libphonenumber",
  "lists",
  "moment",
  "node_modules",
  "querystring",
  "rewrites",
  "session",
  "settings",
  "shows",
  "tests",
  "underscore",
  "updates",
  "url",
  "validate_doc_update",
  "views"
]
```

## ._attachments

```
[
  "ddocs/compiled.json",
  "duality.js",  
  "medic-api-0.1.0.tgz",
  "medic-sentinel-0.1.0.tgz",
  "modules.js",
  "static/audio/alert.mp3",
  "static/dist/inbox.css",
  "static/dist/inbox.js",
  "static/dist/manifest.appcache",
  "static/dist/templates.js",
  "static/dist/xslt/openrosa2html5form.xsl",
  "static/dist/xslt/openrosa2xmlmodel.xsl",
  "static/fonts/FontAwesome.otf",
  "static/fonts/enketo-icons-v2.eot",
  "static/fonts/enketo-icons-v2.svg",
  "static/fonts/enketo-icons-v2.ttf",
  "static/fonts/enketo-icons-v2.woff",
  "static/fonts/fontawesome-webfont.eot",
  "static/fonts/fontawesome-webfont.svg",
  "static/fonts/fontawesome-webfont.ttf",
  "static/fonts/fontawesome-webfont.woff",
  "static/fonts/fontawesome-webfont.woff2",
  "static/img/ico/icon_144.png",
  "static/img/ico/icon_192.png",
  "static/img/ico/icon_48.ico",
  "static/img/ico/icon_48.png",
  "static/img/ico/icon_72.png",
  "static/img/ico/icon_96.png",
  "static/img/icon-chw-selected.svg",
  "static/img/icon-chw.svg",
  "static/img/icon-nurse-selected.svg",
  "static/img/icon-nurse.svg",
  "static/img/icon-pregnant-selected.svg",
  "static/img/icon-pregnant.svg",
  "static/img/medic-logo-50h.png",
  "static/img/medic-logo-light-full.svg",
  "static/img/medic-logo-light.svg",
  "static/img/promo/icon_128.png",
  "static/img/promo/icon_16.png",
  "static/img/promo/icon_48.png",
  "static/img/promo/icon_96.png",
  "static/img/promo/promo-analytics.png",
  "static/img/promo/promo-messages.png",
  "static/img/promo/promo-reports.png",
  "static/img/promo/promo_small.png",
  "static/img/setup-wizard-demo.png",
  "static/manifest.json",
  "templates/inbox.html",
  "translations/messages-en.properties",
  "translations/messages-es.properties",
  "translations/messages-fr.properties",
  "translations/messages-hi.properties",
  "translations/messages-id.properties",
  "translations/messages-ne.properties",
  "translations/messages-sw.properties"
]
```


### ._attachments["duality.js"]
### ._attachments["modules.js"]
 
Contains every module on the ddoc, compiled for use by the browser which we don't actually use.

### ._attachments["medic-api-0.1.0.tgz"]
### ._attachments["medic-sentinel-0.1.0.tgz"]

These should only be built during production or published on npm separtely:

### ._attachments["ddocs/compiled.json"]

This is the medic-client ddoc that get oddly deployed as an attachment and is installed by medic-api see `medic-api/ddoc-extraction.js`.  Seems one reason that was done was because kanso was confusing to handle two ddocs.  We can fix this pretty easily by just using `kanso show` to build the ddoc into a file as a separate step and just push both ddocs with curl, for example.  But I would rather get rid of kanso all together and standardize on the `couch-compile` build tool.

### ._attachments["static/dist/manifest.appcache"]

Should be replaced with service workers, also handled specially in `medic-api/ddoc-extraction.js`.

## .app-settings

Refactor [app-settings functionality](https://github.com/garden20/app_settings) to medic-api, this was initially written as a hack because we used settings on the design doc.  Migrate functionality to: `medic-api/controllers/settings.js`.

### .app-settings.app


```
exports.shows = require('./shows');
exports.updates = require('./updates');
```

### .app-settings.shows


```
/**
 * @private
 * @param {Object} obj
 * @param {String} path
 */
var _objectpath = function(obj, path) {
    if (typeof path !== 'string') {
        return;
    }
    path = path.split('.');

    while (obj && path.length) {
        obj = obj[path.shift()];
    }
    return obj;
};

exports.app_settings = function(ddoc, req) {

  var settings = (ddoc && ddoc.app_settings) || {},
      meta = ddoc.kanso || ddoc.couchapp,
      schema = meta && meta.config && meta.config.settings_schema,
      path = req.query.objectpath;

  if (path) {
      settings = _objectpath(settings, path);
  }

  return {
    body: JSON.stringify({
      settings: settings,
      schema: schema,
      meta: meta
    }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  };

};
```

### .app-settings.updates
```
$  jq -r '.["app-settings"].updates' medic-5-formatted.json 
```
```
/**
 * Update the app_setings of the ddoc with the body of the req. Recursively
 * merge object properties. Where the property value is an array the
 * property is overwritten completely.
 *
 * @exports
 * @param {Object} ddoc Design document to update
 * @param {Object} req The request. The request body must be valid JSON.
 * @return {Array} The updated ddoc and the response body.
 */
exports.update_config = function (ddoc, req) {

    var replace = req.query && req.query.replace;

    return [
        ddoc,
        JSON.stringify(_process(ddoc, req.body, replace))
    ];

};

/**
 * @private
 * @param {Object} ddoc Design document to update
 * @param {String} body The request body. Must be valid JSON.
 */
var _process = function (ddoc, body, replace) {

    if (!ddoc) {
        return {
            success: false,
            error: 'Design document not found'
        };
    }

    try {
        body = JSON.parse(body);
        if (replace) {
            _replace(ddoc.app_settings, body);
        } else {
            _extend(ddoc.app_settings, body);
        }
        return { success: true };
    } catch(e) {
        return {
            success: false,
            error: 'Request body must be valid JSON'
        };
    }

};

/**
 * @private
 * @param {Object} target The settings to update into.
 * @param {Object} source The new settings to update from.
 */
var _replace = function (target, source) {
    for (var k in source) {
        target[k] = source[k];
    }
}

/**
 * @private
 * @param {Object} target The settings to update into.
 * @param {Object} source The new settings to update from.
 */
var _extend = function (target, source) {
    for (var k in source) {
        if (_isObject(source[k])) {
            // object, recurse
            if (!target[k]) {
                target[k] = {};
            }
            _extend(target[k], source[k]);
        } else {
            // simple property or array
            target[k] = source[k];
        }
    }
};

/**
 * @private
 * @param {Object} obj
 */
var _isObject = function (obj) {
    return obj === Object(obj) && toString.call(obj) !== '[object Array]';
};
```

## .app_settings

This is where the settings data is currrently stored.  Move to a separate doc, maybe like `{"_id": "settings", ...}` that is handled through medic-api.  Medic API will fetch the doc as needed.  Any previous CouchDB function that required this data will now only be supported when called through medic-api.

```
output too large
```

## .cookies

[Kanso cookies module](https://github.com/kanso/cookies) should be handled servers side through medic-api, this module should be removed.

```
output too large
```

## .db

The [kanso db module](https://github.com/kanso/db) is not useful inside CouchDB because we cannot make http requests inside CouchDb. This module should be removed.

Requires:

  - events
  - underscore


## .duality

The [kanso duality module](https://github.com/kanso/duality) is not useful anymore because we do not render web pages server side.  CouchDB is only used to serve and store raw JSON data.  This module should be removed.  

Requires:

  - settings
  - modules
  - properties
  - attachments
  - underscore
  - url
  - db
  - session
  - cookies
  - events

Keys:

```
[
  "core",
  "events",
  "utils"
]
```
        
### .duality.core

### .duality.events

### .duality.utils

## .events

The [kanso events module](https://github.com/kanso/events) is a browser port of the node.js events module, it is not needed server side since we removed duality support (server side rendering).


## .filters


```
{
  "data_records": "function(){return require(\"lib/app\")[\"filters\"][\"data_records\"].apply(this, arguments);}"
}
```

## .fulltext


```
{
  "data_records": {
    "analyzer": "perfield:{default:\"standard\",form:\"simple\"}",
    "index": "output too large"
  },
  "contacts": {
    "analyzer": "standard",
    "index": "output too large"
  }
}
```

## .inbox_template

Does the app expect `baseURL` to have a trailing slash only in the html element?

```
<!DOCTYPE html>

<html data-base-url="<%= baseURL %>" manifest="static/dist/manifest.appcache">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="<%= baseURL %>/static/dist/inbox.css" />
    <link rel="shortcut icon" href="<%= baseURL %>/static/img/ico/icon_48.ico">
    <link rel="manifest" href="<%= baseURL %>/static/manifest.json">
    <title>Medic Mobile</title>
  </head>
  <body class="inbox {{currentTab}}" ng-controller="InboxCtrl" ng-class="{'show-content': showContent, 'bootstrapped': version && dbWarmedUp, 'select-mode': selectMode}">

    <div class="bootstrap-layer">
      <div class="loader"></div>
    </div>

    <ng-include src="'templates/partials/actionbar.html'"></ng-include>

    <div class="container-fluid">
      <ng-include src="'templates/partials/header.html'" onload="updateReadStatus()"></ng-include>
      <div class="row content" ui-view></div>
    </div>

    <div id="snackbar">
      <span class="snackbar-content"></span>
    </div>

    <script src="<%= baseURL %>/static/dist/inbox.js" type="text/javascript"></script>
    <script src="<%= baseURL %>/static/dist/templates.js" type="text/javascript"></script>

  </body>
</html>
```

## .kanso

When kanso builds a ddoc it creates a special property with the following keys.  The `kanso.config.version` property is used to display the version in the [dashboard](https://github.com/garden20/dashboard/blob/master/packages/dashboard-core/lib/dashboard_views.js#L81) and [market](https://github.com/garden20/garden-market/blob/master/lib/views.js#L3).  We could probably start using `.couchapp` instead when migrating to `couch-compile`.

```
[
  "build_time",
  "config",
  "kanso_version",
  "push_time",
  "pushed_by"
]
```

## .kujua-sms

This should be refactored as an npm module and included in medic-api.

Keys:

```
[
  "app",
  "lists",
  "rewrites",
  "shows",
  "updates",
  "utils",
  "validate"
]
```

### .kujua-sms.app

```
exports.updates = require('./updates');
exports.lists = require('./lists');
exports.shows = require('./shows');
```

### .kujua-sms.lists


```
var _ = require('underscore'),
    utils = require('./utils'),
    kutils = require('kujua-utils'),
    appinfo = require('views/lib/appinfo');

var json_headers = {
    'Content-Type': 'application/json; charset=utf-8'
};

/*
 * Respond to smssync task polling, callback does a bulk update to update the
 * state field of tasks.
 */
exports.tasks_pending = function (head, req) {
    start({code: 200, headers: json_headers});

    var newDocs = [],
        appdb = require('duality/core').getDBURL(req),
        headers = req.headers.Host.split(":"),
        includeDoc,
        host = headers[0],
        port = headers[1] || "",
        row,
        doc;

    var respBody = {
        payload: {
            success: true,
            task: "send",
            secret: "",
            messages: []
        }
    };

    while (row = getRow()) {
        doc = row.doc;

        // update state attribute for the bulk update callback
        // don't process tasks that have no `to` field since we can't send a
        // message and we don't want to mark the task as sent.  TODO have
        // better support in the gateway for tasks so the gateway can verify
        // that it processed the task successfully.
        includeDoc = false;
        _.each(doc.tasks, function(task) {
            if (task.state === 'pending') {
                _.each(task.messages, function(msg) {
                    // if to and message is defined then append messages
                    if (msg.to && msg.message) {
                        kutils.setTaskState(task, 'sent');
                        task.timestamp = new Date().toISOString();
                        // append outgoing message data payload for smsssync
                        respBody.payload.messages.push(msg);
                        includeDoc = true;
                    }
                });
            }
        });

        // only process scheduled tasks if doc has no errors.
        if (!doc.errors || doc.errors.length === 0) {
            _.each(doc.scheduled_tasks || [], function(task) {
                if (task.state === 'pending') {
                    _.each(task.messages, function(msg) {
                        // if to and message is defined then append messages
                        if (msg.to && msg.message) {
                            kutils.setTaskState(task, 'sent');
                            task.timestamp = new Date().toISOString();
                            // append outgoing message data payload for smsssync
                            respBody.payload.messages.push(msg);
                            includeDoc = true;
                        }
                    });
                }
            });
        }

        if (includeDoc) {
            newDocs.push(doc);
        }
    }

    if (newDocs.length) {
        respBody.callback = {
            options: {
                host: host,
                port: port,
                path: appdb + '/_bulk_docs',
                method: "POST",
                headers: json_headers},
            // bulk update
            data: {docs: newDocs}
        };
    }

    // pass through Authorization header
    if(req.headers.Authorization && respBody.callback) {
        respBody.callback.options.headers.Authorization = req.headers.Authorization;
    }

    return JSON.stringify(respBody);
};

exports.facilities_select2 = function(head, req) {
    start({code: 200, headers: {
        'Content-Type': 'text/json; charset=utf-8'
    }});

    row = getRow();

    if (!row) {
        return send('[]');
    }

    function getData() {
        var names = [],
            //support include_docs=true
            doc = row.doc || row.value;

        if (doc.name) {
            names.unshift(doc.name);
            if (doc.parent && doc.parent.name) {
                names.unshift(doc.parent.name);
                if (doc.parent.parent && doc.parent.parent.name) {
                    names.unshift(doc.parent.parent.name);
                }
            }
        }

        return {
            text: names.join(', '),
            id: row.id
        };
    }

    // create array of facilities as valid JSON output, no comma at end.  also
    // format nicely incase someone wants to modify it and re-upload.
    send('[');
    send(JSON.stringify(getData()));
    while (row = getRow()) {
        send(',\n');
        send(JSON.stringify(getData()));
    }
    send(']');

};

exports.duplicate_form_submissions_with_count = function (head, req) {
    start({code: 200, headers: {
        'Content-Type': 'text/json;charset=utf-8'
    }});

    var row;
    var first_element = true;

    send('[');
    while (row = getRow()) {
        if (row.value > 1) {
            var delimiter = first_element ? '' : ',';
            send(delimiter + JSON.stringify({key: row.key, count: row.value}));
            first_element = false;
        }
    }
    send(']');
};

exports.duplicate_individual_form_submissions = function (head, req) {
    start({code: 200, headers: {
        'Content-Type': 'text/json;charset=utf-8'
    }});

    var row;
    var original_submission = [];
    var first_element = true;

    send('{"duplicates":[');
    while (row = getRow()) {
        if (original_submission.indexOf(JSON.stringify(row.key)) == -1) {
            original_submission.push(JSON.stringify(row.key));
        }
        else {
            var delimiter = first_element ? '' : ',';
            send(delimiter + JSON.stringify({'key': row.key, 'id': row.id, 'rev': row.value}));
            first_element = false;
        }
    }
    send(']}');
};
```



### .kujua-sms.updates

One of the uglier modules.

```
/**
 * Update functions to be exported from the design doc.
 */

var _ = require('underscore'),
    moment = require('moment'),
    kutils = require('kujua-utils'),
    info = require('views/lib/appinfo'),
    smsparser = require('views/lib/smsparser'),
    libphonenumber = require('libphonenumber/utils'),
    validate = require('./validate'),
    utils = require('./utils'),
    req = {};


/**
 * @param {String} form - form code
 * @param {Object} form_data - parsed form data
 * @returns {String} - Reporting Unit ID value (case insensitive)
 * @api private
 */
var getRefID = function(form, form_data) {

    var def = utils.info.getForm(form),
        val;

    if (!def || !def.facility_reference)
        return;

    val = form_data && form_data[def.facility_reference];

    if (val && typeof val.toUpperCase === 'function')
        return val.toUpperCase();

    return val;
};

/**
 * @param {Object} options from initial POST
 * @param {Object} form_data - parsed form data
 * @returns {Object} - data record
 * @api private
 */
var getDataRecord = function(options, form_data) {

    var form = options.form,
        def = utils.info.getForm(form);

    var record = {
        _id: req.uuid,
        type: 'data_record',
        from: libphonenumber.normalize(utils.info, options.from) || options.from,
        form: form,
        errors: [],
        tasks: [],
        fields: {},
        reported_date: new Date().valueOf(),
        // keep POST data part of record
        sms_message: options
    };

    // try to parse timestamp from gateway
    var ts = parseSentTimestamp(options.sent_timestamp);
    if (ts) {
        record.reported_date = ts;
    }

    if (def) {
        if (def.facility_reference)
            record.refid = getRefID(form, form_data);

        for (var k in def.fields) {
            var field = def.fields[k];
            smsparser.merge(form, k.split('.'), record.fields, form_data);
        }
        var errors = validate.validate(def, form_data);
        errors.forEach(function(err) {
            utils.addError(record, err);
        });
    }

    if (form_data && form_data._extra_fields) {
        utils.addError(record, 'extra_fields');
    }

    if (!def || !def.public_form) {
        utils.addError(record, 'sys.facility_not_found');
    }

    if (typeof options.message === 'string' && !options.message.trim()) {
        utils.addError(record, 'sys.empty');
    }

    if (!def) {
        if (utils.info.forms_only_mode) {
            utils.addError(record, 'sys.form_not_found');
        } else {
            // if form is undefined we treat as a regular message
            record.form = undefined;
        }
    }

    return record;
};

/*
 * Try to parse SMSSync gateway sent_timestamp field and use it for
 * reported_date.  Particularly useful when re-importing data from gateway to
 * maintain accurate reported_date field.
 *
 * return unix timestamp integer or undefined
 */
var parseSentTimestamp = function(str) {

    if (typeof str === 'number') {
        str = String(str);
    } else if (typeof str !== 'string') {
        return;
    }

    // smssync 1.1.9 format
    var match1 = str.match(/(\d{1,2})-(\d{1,2})-(\d{2})\s(\d{1,2}):(\d{2})(:(\d{2}))?/),
        ret,
        year;

    if (match1) {
        ret = new Date();

        year = ret.getFullYear();
        year -= year % 100; // round to nearest 100
        ret.setYear(year + parseInt(match1[3], 10)); // works until 2100

        ret.setMonth(parseInt(match1[1],10) - 1);
        ret.setDate(parseInt(match1[2], 10));
        ret.setHours(parseInt(match1[4], 10));
        ret.setMinutes(match1[5]);
        ret.setSeconds(match1[7] || 0);
        ret.setMilliseconds(0);
        return ret.valueOf();
    }

    // smssync 2.0 format (ms since epoch)
    var match2 = str.match(/(\d{13,})/);

    if (match2) {
        ret = new Date(Number(match2[1]));
        return ret.valueOf();
    }

    // otherwise leave it up to moment lib
    return moment(str).valueOf();
};

var getDefaultResponse = function(doc) {
    var response = {
        payload: {
            success: true
        }
    };
    if (doc && doc._id) {
        response.payload.id = doc._id;
    }
    return response;
};

var getErrorResponse = function(msg, code) {
    return {
        code: code || 500,
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            payload: {
                success: false,
                error: msg
            }
        })
    };
};

/*
 * Create new record.
 *
 * Support Medic Mobile message and JSON formatted documents in the POST body.
 * Support ODK Collect via Simple ODK server.  Adds standard fields to the
 * record like form, locale and reported_date.
 *
 * @returns {Array} Following CouchDB API, return final record object and
 *                  response with Ushahidi/SMSSync compatible JSON payload.
 */
exports.add = function(doc, request) {
    utils.info = info.getAppInfo.call(this);

    req = request;
    if (req.form && typeof req.form.message !== 'undefined') {
        return add_sms(doc, request);
    }
    return add_json(doc, request);
};

/*
 * Save parsed form submitted in JSON format when matching form definition can
 * be found.  Support ODK Collect via Simple ODK Server.  Add standard fields
 * to the record, like form, locale and reported_date.
 */
var add_json = exports.add_json = function(doc, request) {

    req = request;

    var def,
        data,
        record,
        options = {},
        form_data = {};

    try {
        data = JSON.parse(req.body);
    } catch(e) {
        kutils.logger.error(req.body);
        return [null, getErrorResponse('Error: request body not valid JSON.')];
    }

    // use locale if passed in via query param
    options.locale = req.query && req.query.locale;

    // Using `_meta` property for non-form data.
    if (data._meta) {
        options.sent_timestamp = data._meta.reported_date;
        options.form = smsparser.getFormCode(data._meta.form);
        options.from = data._meta.from;
        options.locale = data._meta.locale || options.locale;
    }

    def = utils.info.getForm(options.form);

    // require form definition
    if (!def) {
        return [null, getErrorResponse('Form not found: ' + options.form)];
    }

    // For now only save string and number fields, ignore the others.
    // Lowercase all property names.
    for (var k in data) {
        if (['string', 'number'].indexOf(typeof data[k]) >= 0) {
            form_data[k.toLowerCase()] = data[k];
        }
    }

    record = getDataRecord(options, form_data);

    return [
        record,
        JSON.stringify(getDefaultResponse(record))
    ];
};

var add_sms = exports.add_sms = function(doc, request) {

    req = request;
    var options = {
        type: 'sms_message',
        form: smsparser.getFormCode(req.form.message)
    };
    options = _.extend(req.form, options);

    /**
     * If a locale value was passed in using form or query string then save
     * that to the sms_message data, otherwise leave locale undefined.  The
     * sms_message.locale property can be used as an override when supporting
     * responses in multiple languages based on a gateway configuration or a
     * special form field `locale`.
     */
    if (!options.locale && (req.query && req.query.locale)) {
        options.locale = req.query.locale;
    }

    var def = utils.info.getForm(options.form),
        form_data = null,
        resp;

    if (options.form && def) {
        form_data = smsparser.parse(def, options);
    }

    var record = getDataRecord(options, form_data);

    return [
        record,
        JSON.stringify(getDefaultResponse(record))
    ];

};

/*
 * Given a document UUID and a message UUID update a task's state property on a
 * document.
 *
 * Method: PUT
 *
 * JSON body properties:
 *
 *   message_id {message uuid string} required
 *   state {state value} required
 *   state_message {message value}
 *
 * On success returns HTTP 200 code and JSON body. `id` is the doc id.
 *
 * {
 *   "payload":{
 *     "success":true,
 *     "id":"364c796a843fbe0a73476f9153012733"
 *   }
 * }
 *
 * On failure returns HTTP non-200 and JSON body:
 * {
 *   "payload":{
 *     "success":false,
 *     "error":"Your hair is not combed properly."
 *   }
 * }
 *
 */
exports.update_message_task = function(doc, request) {
    var data, msg;
    var fail = function(msg, code) {
        return [null, getErrorResponse(msg, code)];
    };
    if (!doc) {
        return fail('Document not found: ' + doc, 404);
    }
    try {
        data = JSON.parse(request.body);
    } catch(e) {
        return fail('Parsing JSON body failed');
    }
    if (!data.state) {
        return fail('Value required for state.');
    }
    if (!data.message_id) {
        return fail('Message id required');
    }
    msg = getTask(data.message_id, doc);
    if (!data.message_id || !msg) {
        return fail('Message not found: ' + data.message_id);
    }
    kutils.setTaskState(msg, data.state, data.details);
    return [
        doc,
        JSON.stringify(getDefaultResponse(doc))
    ];
};


/*
 * Return task object that matches message uuid or a falsey value if match
 * fails.
 */
var getTask = function(uuid, doc) {
    for (var i in doc.tasks) {
        for (var j in doc.tasks[i].messages) {
            if (uuid === doc.tasks[i].messages[j].uuid) {
                return doc.tasks[i];
            }
        }
    };
    for (var i in doc.scheduled_tasks) {
        for (var j in doc.scheduled_tasks[i].messages) {
            if (uuid === doc.scheduled_tasks[i].messages[j].uuid) {
                return doc.scheduled_tasks[i];
            }
        }
    };
    return;
};
```

### .kujua-sms.shows

```
exports.test_sms_forms = function (doc, req) {
    return {foo:'test'};
};
```



### .kujua-sms.rewrites

```
exports.rules = [
    /*
     * A rewrite entry is needed for the POST and the GET because in SMSSync
     * the Sync URL is used for both.
     */
    {
        from: '/add',
        to: '_update/add',
        method: 'POST'
    },
    {
        from: '/add',
        to: '_list/tasks_pending/tasks_pending',
        query: {
            include_docs: 'true',
            limit: '25'
        },
        method: 'GET'
    },
    /*
     * Use this path to specify a limit on the number of documents the view
     * will return. This allows you reduce the JSON payload the gateway
     * processes, or to increase it from the default of 25 hard coded above.
     */
    {
        from: '/add/limit/*',
        to: '_update/add',
        method: 'POST'
    },
    {
        from: '/add/limit/:limit',
        to: '_list/tasks_pending/tasks_pending',
        query: {
            include_docs: 'true',
            limit: ':limit'
        },
        method: 'GET'
    },
    {
        from: '/duplicate_count/:form',
        to:'_list/duplicate_form_submissions_with_count/duplicate_form_submissions',
        query: {
            group:'true',
            startkey: [':form'],
            endkey: [':form',{}]
        }
    },
    {
        from:'/duplicate_records/:form',
        to:'_list/duplicate_individual_form_submissions/duplicate_form_submissions',
        query:{
            reduce: 'false',
            startkey: [':form'],
            endkey: [':form',{}]
        }
    }
];
```


### .kujua-sms.utils

```
/*
 * Utility functions for Medic Mobile
 */
var utils = require('kujua-utils'),
    logger = utils.logger,
    _ = require('underscore'),
    objectpath = require('views/lib/objectpath');

/*
 * @param {Object} data_record - typically a data record or portion (hash)
 * @param {String} key - key for field
 * @param {Object} def - form or field definition
 * @api private
*/
var prettyVal = function(data_record, key, def) {

    if (!data_record || _.isUndefined(key) || _.isUndefined(data_record[key])) {
        return;
    }

    var val = data_record[key];

    if (!def) {
        return val;
    }

    if (def.fields && def.fields[key]) {
        def = def.fields[key];
    }

    switch (def.type) {
        case 'boolean':
            return val === true ? 'True' : 'False';
        case 'date':
            return exports.info.formatDate(data_record[key]);
        case 'integer':
            // use list value for month
            if (def.validate && def.validate.is_numeric_month) {
                if (def.list) {
                    for (var i in def.list) {
                        var item = def.list[i];
                        if (item[0] === val) {
                            return exports.info.translate(item[1], locale);
                        }
                    }
                }
            }
        default:
            return val;
    }

};

/*
 * With some forms like ORPT (patient registration), we add additional data to
 * it based on other form submissions.  Form data from other reports is used to
 * create these fields and it is useful to show these new fields in the data
 * records screen/render even though they are not defined in the form.
 *
 */
var includeNonFormFields = function(doc, form_keys, locale) {

    var fields = [
        'mother_outcome',
        'child_birth_outcome',
        'child_birth_weight',
        'child_birth_date',
        'expected_date',
        'birth_date',
        'patient_id'
    ];

    var dateFields = [
        'child_birth_date',
        'expected_date',
        'birth_date'
    ];

    _.each(fields, function(field) {
        var label = exports.info.translate(field, locale),
            value = doc[field];

        // Only include the property if we find it on the doc and not as a form
        // key since then it would be duplicated.
        if (!value || form_keys.indexOf(field) !== -1) {
            return;
        }

        if (_.contains(dateFields, field)) {
            value = exports.info.formatDate(value);
        }

        doc.fields.data.unshift({
            label: label,
            value: value,
            isArray: false,
            generated: true
        });

        doc.fields.headers.unshift({
            head: label
        });

    });
};

var getGroupName = function(task) {
    if (task.group) {
        return task.type + ':' + task.group;
    }
    return task.type;
};

var getGroupDisplayName = function(task, language) {
    if (task.translation_key) {
        return exports.info.translate(
            task.translation_key, language, { group: task.group }
        );
    }
    return getGroupName(task);
};

/*
 * Take data record document and return nice formated JSON object.
 */
exports.makeDataRecordReadable = function(doc, appinfo, language) {

    exports.info = appinfo || exports.info;

    var data_record = doc;
    var language = language || getLocale(doc);

    // adding a fields property for ease of rendering code
    if(data_record.form && data_record.content_type !== 'xml') {
        var keys = getFormKeys(exports.info.getForm(data_record.form));
        var labels = exports.getLabels(keys, data_record.form, language);
        data_record.fields = exports.fieldsToHtml(keys, labels, data_record);
        includeNonFormFields(data_record, keys, language);
    }

    if(data_record.scheduled_tasks) {
        data_record.scheduled_tasks_by_group = [];
        var groups = {};
        for (var i in data_record.scheduled_tasks) {
            var t = data_record.scheduled_tasks[i],
                copy = _.clone(t);

            // avoid crash if item is falsey
            if (!t) continue;

            if (t.due) {
                copy.due = t.due;
            }

            // timestamp is used for sorting in the frontend
            if (t.timestamp) {
                copy.timestamp = t.timestamp;
            } else if (t.due) {
                copy.timestamp = t.due;
            }

            // setup scheduled groups

            var groupName = getGroupName(t);
            var displayName = getGroupDisplayName(t, language);
            var group = groups[groupName];
            if (!group) {
                groups[groupName] = group = {
                    group: groupName,
                    name: displayName,
                    type: t.type,
                    number: t.group,
                    rows: []
                };
            }
            //
            // Warning: _idx is used on frontend during save.
            //
            copy._idx = i;
            group.rows.push(copy);
        }
        for (var k in groups) {
            data_record.scheduled_tasks_by_group.push(groups[k]);
        }
    }

    /*
     * Prepare outgoing messages for render. Reduce messages to organize by
     * properties: sent_by, from, state and message.  This helps for easier
     * display especially in the case of bulk sms.
     *
     * messages = [
     *    {
     *       recipients: [
     *          {
     *              to: '+123',
     *              facility: <facility>,
     *              timestamp: <timestamp>,
     *              uuid: <uuid>,
     *          },
     *          ...
     *        ],
     *        sent_by: 'admin',
     *        from: '+998',
     *        state: 'sent',
     *        message: 'good morning'
     *    }
     *  ]
     */
    if (data_record.kujua_message) {
        var outgoing_messages = [],
            outgoing_messages_recipients = [],
            msgs = {};
        _.each(data_record.tasks, function(task) {
            _.each(task.messages, function(msg) {
                var recipient = {
                    to: msg.to,
                    facility: msg.facility,
                    timestamp: task.timestamp,
                    uuid: msg.uuid
                };
                var done = false;
                // append recipient to existing
                _.each(outgoing_messages, function(m) {
                    if (msg.message === m.message
                            && msg.sent_by === m.sent_by
                            && msg.from === m.from
                            && task.state === m.state) {
                        m.recipients.push(recipient);
                        outgoing_messages_recipients.push(recipient);
                        done = true;
                    }
                });
                // create new entry
                if (!done) {
                    outgoing_messages.push({
                        recipients: [recipient],
                        sent_by: msg.sent_by,
                        from: msg.from,
                        state: task.state,
                        message: msg.message
                    });
                    outgoing_messages_recipients.push(recipient);
                }
            });
        });
        data_record.outgoing_messages = outgoing_messages;
        data_record.outgoing_messages_recipients = outgoing_messages_recipients;
    }

    return data_record;
};


/**
 * Return a title-case version of the supplied string.
 * @name titleize(str)
 * @param str The string to transform.
 * @returns {String}
 * @api public
 */
var titleize = function (s) {
    return s.trim()
        .toLowerCase()
        .replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .replace(/_/g, ' ')
        .replace(/(?:^|\s|-)\S/g, function(c) {
            return c.toUpperCase();
        });
};

/*
 * @api private
 */
exports.fieldsToHtml = function(keys, labels, data_record, def) {

    if (!def && data_record && data_record.form)
        def = exports.info.getForm(data_record.form);

    if (_.isString(def))
        def = exports.info.getForm(def);

    var fields = {
        headers: [],
        data: []
    };

    var data = _.extend({}, data_record, data_record.fields);

    _.each(keys, function(key) {
        if(_.isArray(key)) {
            fields.headers.push({head: titleize(key[0])});
            fields.data.push(_.extend(
                exports.fieldsToHtml(key[1], labels, data[key[0]], def),
                {isArray: true}
            ));
        } else {
            var label = labels.shift();
            fields.headers.push({head: exports.info.getMessage(label)});
            if (def && def[key]) {
                def = def[key];
            }
            fields.data.push({
                isArray: false,
                value: prettyVal(data, key, def),
                label: label
            });
        }
    });

    return fields;
};

/*
 * @api private
 * */
function translateKey(key, field, locale) {
    var label;

    if (field) {
        label = getLabel(field, locale);
    } else {
        label = exports.info.translate(key, locale);
    }
    // still haven't found a proper label; then titleize
    if (key === label) {
        return titleize(key);
    } else {
        return label;
    }
}

/*
 * Fetch labels from translation strings or jsonform object, maintaining order
 * in the returned array.
 *
 * @param Array keys - keys we want to resolve labels for
 * @param String form - form code string
 * @param String locale - locale string, e.g. 'en', 'fr', 'en-gb'
 *
 * @return Array  - form field labels based on forms definition.
 *
 * @api private
 */
exports.getLabels = function(keys, form, locale) {

    var def = exports.info.getForm(form),
        fields = def && def.fields;

    return _.reduce(keys, function(memo, key) {
        var field = fields && fields[key],
            keys;

        if (_.isString(key)) {
            memo.push(translateKey(key, field, locale));
        } else if (_.isArray(key)) {
            keys = unrollKey(key);

            _.each(keys, function(key) {
                var field = fields && fields[key];

                memo.push(translateKey(key, field, locale));
            });
        }

        return memo;
    }, []);
};

// returns the deepest array from `key`
function unrollKey(array) {
    var target = [].concat(array),
        root = [];

    while (_.isArray(_.last(target))) {
        root.push(_.first(target));
        target = _.last(target);
    }

    return _.map(target, function(item) {
        return root.concat([item]).join('.');
    });
}

function getLabel(field, locale) {
    return exports.info.getMessage(field.labels && field.labels.short, locale);
}


/**
 * Determine locale/language of a record based on a locale value:
 *  - Set on the document
 *  - Reported in a form field named `locale`
 *  - Configured in the gateway and set on message post
 *  - Configured in the settings
 *  - Defaults to 'en'
 */
function getLocale(record) {
    return record.locale ||
           (record.fields && record.fields.locale) ||
           (record.sms_message && record.sms_message.locale) ||
           exports.info.locale ||
           'en';
}

/*
 * Get an array of keys from the form.  If dot notation is used it will be an
 * array of arrays.
 *
 * @param Object def - form definition
 *
 * @return Array  - form field keys based on forms definition
 */
var getFormKeys = exports.getFormKeys = function(def) {

    var keys = {};

    var getKeys = function(key, hash) {
        if(key.length > 1) {
            var tmp = key.shift();
            if(!hash[tmp]) {
                hash[tmp] = {};
            }
            getKeys(key, hash[tmp]);
        } else {
            hash[key[0]] = '';
        }
    };

    var hashToArray = function(hash) {
        var array = [];

        _.each(hash, function(value, key) {
            if(typeof value === "string") {
                array.push(key);
            } else {
                array.push([key, hashToArray(hash[key])]);
            }
        });

        return array;
    };

    if (def) {
        for (var k in def.fields) {
            getKeys(k.split('.'), keys);
        }
    }

    return hashToArray(keys);
};

/*
 * @param {Object} record - data record
 * @param {String|Object} error - error object or code matching key in messages
 *
 * @returns boolean
 */
exports.hasError = function(record, error) {
    if (!record || !error) return;

    if (_.isString(error)) {
        error = {
            code: error,
            message: ''
        };
    }

    var existing = _.findWhere(record.errors, {
        code: error.code
    });

    return !!existing;
};

/*
 * Append error to data record if it doesn't already exist. we don't need
 * redundant errors. Error objects should always have a code and message
 * attributes.
 *
 * @param {Object} record - data record
 * @param {String|Object} error - error object or code matching key in messages
 *
 * @returns undefined
 */
exports.addError = function(record, error) {
    if (!record || !error) return;

    if (_.isString(error)) {
        error = {
            code: error,
            message: ''
        }
    }

    if (exports.hasError(record, error)) {
        return;
    }

    var form = record.form && record.sms_message && record.sms_message.form;

    if (!error.message)
        error.message = exports.info.translate(error.code, getLocale(record));

    // replace placeholder strings
    error.message = error.message
        .replace('{{fields}}', error.fields && error.fields.join(', '))
        .replace('{{form}}', form);

    record.errors ? record.errors.push(error) : record.errors = [error];

    logger.warn(JSON.stringify(error));
};

exports.capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// placeholder function that will be replaced with appInfo from the calling
// update/show/list function
exports.info = {
    getForm: function() {},
    getMessage: function(value, locale) {
        locale = locale || 'en';

        if (!value || _.isString(value)) {
            return value;
        } else if (value[locale]) {
            return value[locale];
        } else {
            // if desired locale not present return first string
            return value[_.first(_.keys(value))];
        }
    },
    translate: function(key) {
        return key;
    }
};
```

### .kujua-sms.validate

```
var _ = require('underscore')._,
    logger = require('kujua-utils').logger;

/*
 *  return array of errors or empty array.
 */
exports.validate = function(def, form_data) {
    var missing_fields = [], orig_key, key, data;

    var _isDefined = function(obj) {
        return !_.isUndefined(obj) && !_.isNull(obj);
    };

    _.each(def.fields, function(field, k) {
        orig_key = k;
        key = k.split('.');
        data = form_data;

        while(key.length > 1) {
            data = data[key.shift()];
        }

        key = key[0];

        if (!!field.required) {
            if (
                !data
                || !_isDefined(data[key])
                || (_.isArray(data[key]) && !_isDefined(data[key][0]))
            ) {
                missing_fields.push(orig_key);
            }
        }
    });

    if (!_.isEmpty(missing_fields))
        return [{code: 'sys.missing_fields', fields: missing_fields}];

    if (def.validations) {

        var errors = [];

        for (var k in def.validations) {
            if (typeof def.validations[k] !== 'string')
                continue;
            var ret = eval('('+def.validations[k]+')()');
            // assume string/error message if not object
            if (ret && !_.isObject(ret)) {
                errors.push({
                    code: 'sys.form_invalid_custom',
                    form: def.meta.code,
                    message: ret
                });
            } else if (ret) {
                errors.push(ret);
            }
        };

        if (errors.length !== 0) {
            return errors;
        }
    }

    return [];
};
```
## .kujua-utils

```
var _ = require('underscore');

exports.logger = {
    levels: {silent:0, error:1, warn:2, info:3, debug:4},
    log: function(obj) {
        if (typeof(console) !== 'undefined') {
            console.log(obj);
        } else if (typeof(log) !== 'undefined') {
            if (_.isObject(obj))
                log(JSON.stringify(obj));
            else
                log(obj);
        }
    },
    log_error: function(obj) {
        if (typeof(console) !== 'undefined') {
            console.error(obj);
        } else if (typeof(log) !== 'undefined') {
            log('Medic Mobile ERROR:');
            if (_.isObject(obj))
                log(JSON.stringify(obj,null,2));
            else
                log(obj);
        }
    },
    silent: function (obj) {},
    error: function (obj) {
        this.log_error(obj);
    },
    warn: function (obj) {
        this.log(obj);
    },
    info: function (obj) {
        this.log(obj);
    },
    debug: function (obj) {
        this.log(obj);
    }
};

/* poorly named */
exports.isUserAdmin = function(userCtx) {
    return exports.isUserNationalAdmin(userCtx) || exports.isDbAdmin(userCtx);
};

exports.isUserNationalAdmin = function(userCtx) {
    return exports.hasRole(userCtx, 'national_admin');
};

exports.isUserDistrictAdmin = function(userCtx) {
    return exports.hasRole(userCtx, 'district_admin');
};

exports.isDbAdmin = function(userCtx) {
    return exports.hasRole(userCtx, '_admin');
};

exports.hasRole = function(userCtx, role) {
    return _.contains(userCtx && userCtx.roles, role);
};

/**
 * Update task/message object in-place.  Used by message update functions when
 * a message's state changes. Also adds new values to state history.
 *
 * @param {Object} task
 * @param {String} state
 * @param {Any} details (optional)
 * @api public
 */
exports.setTaskState = function(task, state, details) {
    task.state = state;
    task.state_details = details;
    task.state_history = task.state_history || [];
    task.state_history.push({
        state: state,
        state_details: details,
        timestamp: new Date().toISOString()
    });
};
```
## .lib

.lib is created by the kanso `modules` package.  It's main purpose is to make commonjs compatible modules on the servers side and client side.  The setting in `kanso.json` is:

```
    "modules": ["lib"]
```

Keys:

```
[
  "app",
  "filters",
  "fulltext",
  "rewrites",
  "shows",
  "validate_doc_update",
  "views"
]
```

### .lib.app

```
/**
 * Values exported from this module will automatically be used to generate
 * the design doc pushed to CouchDB.
 */

module.exports = {
    shows: require('./shows'),
    fulltext: require('./fulltext'),
    filters: require('./filters'),
    rewrites: require('./rewrites'),
    views: require('./views'),
    validate_doc_update: require('./validate_doc_update').validate_doc_update
};
```

### .lib.fulltext

```
jq -r .lib.fulltext | grep export
```

```
exports.data_records = {
exports.contacts = {
```

### .lib.filters


```
/**
 * Filter functions to be exported from the design doc.
 */
exports.data_records = function(doc) {
  return doc.type === 'data_record';
};
```
### .lib.rewrites

```
var rewrites = require('kujua-sms/rewrites').rules,
    _ = require('underscore')._;

module.exports = _.union(rewrites, [
    {from: '/static/*', to: 'static/*'},
    {from: '/templates/*', to: 'templates/*'},
    {from: '/status', to: '_show/status'},
    
    // TODO delete
    {from: '/bootstrap/*', to: 'bootstrap/*'},
    // TODO delete
    {from: '/select2/*', to: 'select2/*'},

    require('app-settings/rewrites'),
    {
        from: '/facilities_select2.json',
        to: '_list/facilities_select2/facilities',
        query: {
            include_docs: 'true'
        }
    },
    {from: '/', to: '_show/inbox'},
    {from: '#/*', to: '_show/inbox'},
    {from: '/#/*', to: '_show/inbox'},
    {from: '/migration', to: '_show/migration'},
    {from: '*', to: '_show/not_found'},
]);
```

### .lib.validate\_doc\_update

```
/*
  SERVER DOCUMENT VALIDATION

  This is for validating authority. It is against the medic ddoc because it can
  only usefully be run against couchdb.

  For validations around document structure (and for a validate_doc_update script
  that runs on PouchDB) check ddocs/medic-client/validate_doc_update.js.
*/

var utils = require('kujua-utils'),
    ADMIN_ONLY_TYPES = [ 'form', 'translations' ],
    ADMIN_ONLY_IDS = [ 'resources', 'appcache', 'zscore-charts' ];

var _err = function(msg) {
    throw({ forbidden: msg });
};

var isDbAdmin = function(userCtx, secObj) {
  if (utils.hasRole(userCtx, '_admin')) {
    return true;
  }

  if (secObj.admins && secObj.admins.names &&
      secObj.admins.names.indexOf(userCtx.name) !== -1) {
    return true;
  }

  if (secObj.admins && secObj.admins.roles) {
    for (var i = 0; i < userCtx.roles; i++) {
      if (utils.hasRole(secObj.admins, userCtx.roles[i])) {
        return true;
      }
    }
  }

  return false;
};

var isAdminOnlyDoc = function(doc) {
  return (doc._id && doc._id.indexOf('_design/') === 0) ||
         (doc._id && ADMIN_ONLY_IDS.indexOf(doc._id) !== -1) ||
         (doc.type && ADMIN_ONLY_TYPES.indexOf(doc.type) !== -1);
};

var checkAuthority = function(newDoc, oldDoc, userCtx, secObj) {

  // ensure logged in
  if (!userCtx.name) {
    _err('You must be logged in to edit documents');
  }

  // admins can do anything
  if (isDbAdmin(userCtx, secObj) || utils.isUserAdmin(userCtx)) {
    return;
  }

  if (isAdminOnlyDoc(newDoc)) {
    _err('You are not authorized to edit admin only docs');
  }

  if (userCtx.facility_id === newDoc._id) {
    _err('You are not authorized to edit your own place');
  }

  // district admins can do almost anything
  if (utils.isUserDistrictAdmin(userCtx)) {
    return;
  }

  // only admins can delete
  if (oldDoc && newDoc._deleted) {
      _err('You must be an admin to delete docs');
  }

  // gateway and data_entry users can update
  if (utils.hasRole(userCtx, 'kujua_gateway') ||
      utils.hasRole(userCtx, 'data_entry')) {
    return;
  }

  // none of the above
  _err('You must be an admin, gateway, or data entry user to edit documents');
};

module.exports = {
  validate_doc_update: function(newDoc, oldDoc, userCtx, secObj) {

    checkAuthority(newDoc, oldDoc, userCtx, secObj);

    log('medic validate_doc_update passed for User "' + userCtx.name + '" changing document "' +  newDoc._id + '"');
  }
};
```

### .lib.views

```
jq -r .lib.views | grep exports
```

```
exports.clinic_by_phone = {
exports.clinic_by_refid = {
exports.data_records = {
exports.data_records_by_district = {
exports.data_records_by_year_month_form_place = {
exports.delivery_reports_by_district_and_code = {
exports.delivery_reports_by_year_month_and_code = {
exports.due_tasks = {
exports.duplicate_form_submissions = {
exports.places_by_phone = {
exports.places_by_type_parent_id_name = {
exports.contacts_by_depth = {
exports.docs_by_replication_key = {
exports.registered_patients = {
exports.reports_by_form_and_clinic = {
exports.reports_by_form_year_month_clinic_id_reported_date = {
exports.reports_by_form_year_week_clinic_id_reported_date = {
exports.sent_reminders = {
exports.tasks_messages = {
exports.tasks_pending = {
exports.usage_stats_by_year_month = {
exports.visits_by_district_and_patient = {
exports.patient_by_patient_shortcode_id = {
```



## .libphonenumber

Required by `kujus-sms.updates`.

### .libphonenumber.libphonenumber

```
$ jq  '.libphonenumber.libphonenumber | length' 
432998
```

### .libphonenumber.utils

```
/**
* Our wrapper around google's libphonenumber.
*/
var phonenumber = require('libphonenumber/libphonenumber'),
    CHARACTER_REGEX = /[a-z]/i;

var _init = function(settings, phone) {
  var instance = phonenumber.PhoneNumberUtil.getInstance();
  var countryCode = settings && settings.default_country_code;
  var regionCode = instance.getRegionCodeForCountryCode(countryCode);
  var parsed = instance.parseAndKeepRawInput(phone, regionCode);

  return {
    format: function(scheme) {
      if (!this.validate()) {
        return false;
      }
      if (typeof scheme === 'undefined') {
        if (parsed.getCountryCode() + '' === countryCode) {
          scheme = phonenumber.PhoneNumberFormat.NATIONAL;
        } else {
          scheme = phonenumber.PhoneNumberFormat.INTERNATIONAL;
        }
      }
      return instance.format(parsed, scheme).toString();
    },
    validate: function() {
      return instance.isValidNumber(parsed) &&
        // Disallow alpha numbers which libphonenumber considers valid,
        // e.g. 1-800-MICROSOFT.
        !phone.match(CHARACTER_REGEX);
    }
  };
};

/**
 * Returns international format if valid number, or false if invalid.
 */
exports.normalize = function(settings, phone) {
  try {
    return _init(settings, phone).format(phonenumber.PhoneNumberFormat.E164);
  } catch (e) {}
  return false;
};

/**
 * Returns the number formatted for display, or false if invalid.
 */
exports.format = function(settings, phone) {
  try {
    return _init(settings, phone).format();
  } catch (e) {}
  return false;
};

/**
 * Returns true if valid number.
 * Allows dots, brackets, spaces, but not letters.
 */
exports.validate = function(settings, phone) {
  try {
    return _init(settings, phone).validate();
  } catch (e) {}
  return false;
};
```

### .lists


The actual CouchDB list functions just run the code in `kujua-sms/app`.

```
{
  "tasks_pending": "function(head, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"lists\"][\"tasks_pending\"];return core.runList.call(this, fn, head, req);}",
  "facilities_select2": "function(head, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"lists\"][\"facilities_select2\"];return core.runList.call(this, fn, head, req);}",
  "duplicate_form_submissions_with_count": "function(head, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"lists\"][\"duplicate_form_submissions_with_count\"];return core.runList.call(this, fn, head, req);}",
  "duplicate_individual_form_submissions": "function(head, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"lists\"][\"duplicate_individual_form_submissions\"];return core.runList.call(this, fn, head, req);}"
}
```

## .moment

Required by `kujua-sms.updates`.

```
$ jq '.moment|length' 
316028
```

## .node_modules

It would be better to package these as npm modules and just include them in package.json.

```
"medic-api-0.1.0.tgz,medic-sentinel-0.1.0.tgz"
```


## .rewrites

Remove most these or migrate to medic-api.  They are mostly cosmetic (provide some nicer path mappings) and since we only want to use CouchDB for data, the path to resource mappings should live in medic-api.  

The single page app initialization, or inbox template, should also get served from medi-api under `/` rather than serving directly from couchdb on `/medic/_design/medic/_rewrite/`.  Anything the client side app needs should be available on the medic-client ddoc or through medic-api.

```
[
  {
    "from": "/modules.js",
    "to": "modules.js"
  },
  {
    "from": "/duality.js",
    "to": "duality.js"
  },
  {
    "from": "/_db/*",
    "to": "../../*"
  },
  {
    "from": "/_db",
    "to": "../.."
  },
  {
    "from": "/add",
    "to": "_update/add",
    "method": "POST"
  },
  {
    "from": "/add",
    "to": "_list/tasks_pending/tasks_pending",
    "query": {
      "include_docs": "true",
      "limit": "25"
    },
    "method": "GET"
  },
  {
    "from": "/add/limit/*",
    "to": "_update/add",
    "method": "POST"
  },
  {
    "from": "/add/limit/:limit",
    "to": "_list/tasks_pending/tasks_pending",
    "query": {
      "include_docs": "true",
      "limit": ":limit"
    },
    "method": "GET"
  },
  {
    "from": "/duplicate_count/:form",
    "to": "_list/duplicate_form_submissions_with_count/duplicate_form_submissions",
    "query": {
      "group": "true",
      "startkey": [
        ":form"
      ],
      "endkey": [
        ":form",
        {}
      ]
    }
  },
  {
    "from": "/duplicate_records/:form",
    "to": "_list/duplicate_individual_form_submissions/duplicate_form_submissions",
    "query": {
      "reduce": "false",
      "startkey": [
        ":form"
      ],
      "endkey": [
        ":form",
        {}
      ]
    }
  },
  {
    "from": "/static/*",
    "to": "static/*"
  },
  {
    "from": "/templates/*",
    "to": "templates/*"
  },
  {
    "from": "/status",
    "to": "_show/status"
  },
  {
    "from": "/bootstrap/*",
    "to": "bootstrap/*"
  },
  {
    "from": "/select2/*",
    "to": "select2/*"
  },
  {
    "from": "/app_settings/:ddoc/:objectpath",
    "to": "_show/app_settings/_design/:ddoc",
    "method": "GET"
  },
  {
    "from": "/app_settings/:ddoc",
    "to": "_show/app_settings/_design/:ddoc",
    "method": "GET"
  },
  {
    "from": "/update_settings/:ddoc",
    "to": "_update/update_config/_design/:ddoc",
    "method": "PUT"
  },
  {
    "from": "/facilities_select2.json",
    "to": "_list/facilities_select2/facilities",
    "query": {
      "include_docs": "true"
    }
  },
  {
    "from": "/",
    "to": "_show/inbox"
  },
  {
    "from": "#/*",
    "to": "_show/inbox"
  },
  {
    "from": "/#/*",
    "to": "_show/inbox"
  },
  {
    "from": "/migration",
    "to": "_show/migration"
  },
  {
    "from": "*",
    "to": "_show/not_found"
  }
]
```

## .session

Required by duality.

## .settings

The [kanso settings module](https://github.com/kanso/settings) saves static settings data from kanso packages here. I don't think we ever really used this data.  This module should be removed.


```
{
  "packages": {
    "duality": "module.exports = {\"name\":\"duality\",\"version\":\"0.0.19\",\"categories\":[\"frameworks\",\"duality\"],\"description\":\"The central part of the Duality framework. Implements the CouchDB design doc API in the browser and handles the dispatching of URLs\",\"modules\":\"duality\",\"attachments\":\"duality.js\",\"dependencies\":{\"settings\":null,\"modules\":null,\"properties\":null,\"attachments\":null,\"underscore\":null,\"url\":null,\"db\":\">=0.0.8\",\"session\":null,\"cookies\":null,\"events\":null},\"postprocessors\":{\"queue\":\"build/queue\",\"app\":\"build/app\"}};",
    "medic": "output too large",
    "root": "module.exports = require(\"settings/packages/medic\");"
  }
}

```

## .shows

Calls the shows in the packages.

```
{
  "inbox": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"lib/app\")[\"shows\"][\"inbox\"];return core.runShow.call(this, fn, doc, req);}",
  "status": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"lib/app\")[\"shows\"][\"status\"];return core.runShow.call(this, fn, doc, req);}",
  "not_found": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"lib/app\")[\"shows\"][\"not_found\"];return core.runShow.call(this, fn, doc, req);}",
  "migration": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"lib/app\")[\"shows\"][\"migration\"];return core.runShow.call(this, fn, doc, req);}",
  "test_sms_forms": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"shows\"][\"test_sms_forms\"];return core.runShow.call(this, fn, doc, req);}",
  "app_settings": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"app-settings/app\")[\"shows\"][\"app_settings\"];return core.runShow.call(this, fn, doc, req);}"
}
```

## .tests

Not used.

```
{
  "app-settings": {
    "update": [truncated]
  }
}
```

## .updates

Calls the related functions in `kujus-sms/app` and `app-settings/app`.

```
{
  "add": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"updates\"][\"add\"];var r;core.runUpdate.call(this, fn, doc, req, function (err, res) { r = res; });return r;}",
  "add_json": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"updates\"][\"add_json\"];var r;core.runUpdate.call(this, fn, doc, req, function (err, res) { r = res; });return r;}",
  "add_sms": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"updates\"][\"add_sms\"];var r;core.runUpdate.call(this, fn, doc, req, function (err, res) { r = res; });return r;}",
  "update_message_task": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"kujua-sms/app\")[\"updates\"][\"update_message_task\"];var r;core.runUpdate.call(this, fn, doc, req, function (err, res) { r = res; });return r;}",
  "update_config": "function(doc, req){var core = require(\"duality/core\");var fn = require(\"app-settings/app\")[\"updates\"][\"update_config\"];var r;core.runUpdate.call(this, fn, doc, req, function (err, res) { r = res; });return r;}"
}
```

## .url

## .validate\_doc\_update

```
function(){return require("lib/app")["validate_doc_update"].apply(this, arguments);}
```

## .views

Views are copied, not imported with require because there is a limitation in CouchDB using commonjs/require inside of views.

```
jq '.views|keys'
```

```
[
  "clinic_by_phone",
  "clinic_by_refid",
  "contacts_by_depth",
  "data_records",
  "data_records_by_district",
  "data_records_by_year_month_form_place",
  "delivery_reports_by_district_and_code",
  "delivery_reports_by_year_month_and_code",
  "docs_by_replication_key",
  "due_tasks",
  "duplicate_form_submissions",
  "lib",
  "patient_by_patient_shortcode_id",
  "places_by_phone",
  "places_by_type_parent_id_name",
  "registered_patients",
  "reports_by_form_and_clinic",
  "reports_by_form_year_month_clinic_id_reported_date",
  "reports_by_form_year_week_clinic_id_reported_date",
  "sent_reminders",
  "tasks_messages",
  "tasks_pending",
  "usage_stats_by_year_month",
  "visits_by_district_and_patient"
]
```

### .views.clinic\_by\_phone

Example of one of the views above:

```
{
  "map": "function (doc) {\n    if (doc.type === 'clinic' && doc.contact && doc.contact.phone) {\n      emit([doc.contact.phone]);\n    }\n  }"
}
```

### .views.lib

Code inside this special path can be referenced from anywhere inside couchdb, including views. See [CouchDB CommonJS docs](http://docs.couchdb.org/en/1.6.1/query-server/javascript.html#commonjs-modules)

Keys:

```
[
  "appinfo",
  "javarosa_parser",
  "mp_parser",
  "objectpath",
  "smsparser",
  "textforms_parser"
]
```

### .views.lib.appinfo

One of the uglier parts of the ddoc we should refactor to medic-api.  Mainly written because we needed access to settings data (app_settings property) inside  other views/lists/update functions.

Required by:

  - .kujua-sms.lists
  - .kujua-sms.updates
  
```
/**
 * This has to run in the shows/list/update context for 'this' to work
 * Specifically, needs patched duality/core.js to have correct context
 */
exports.getAppInfo = function() {
    var _ = _ || require('underscore'),
        url = url || require('url'),
        cookies = cookies || require('cookies'),
        app_settings = getSettings.call(this);

    // use mustache syntax
    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };


    /*
     * Return a json form
     */
    function getForm(code) {
        return this.forms && this.forms[code];
    };


    /*
     * On server side app_settings is available on design doc (this) and if
     * call from client side we fetch app_settings via couchdb show.
     *
     * returns object
     */
    function getSettings() {
        var settings = {};

        if (this.app_settings) {
            // server side
            settings = this.app_settings;
        } else if (typeof(window) === 'object' && window.jQuery) {
            // client side
            var baseURL = require('duality/utils').getBaseURL();
            settings = JSON.parse(
                window.jQuery.ajax({
                    type: 'GET',
                    url: baseURL + '/app_settings/medic',
                    async: false //synchronous request
                }).responseText
            ).settings;
        }

        return settings;
    }

    function getLocale() {
        var locale;
        if (typeof window !== 'undefined') {
          locale = cookies.readBrowserCookie('locale');
        }
        return locale || app_settings.locale;
    };

    /*
     * Value is object with locale strings, e.g.
     *
     *   {
     *       "key": "Search",
     *       "default": "Search",
     *       "translations": [
     *           {
     *               "locale": "en",
     *               "content": "Search"
     *           },
     *           {
     *               "locale": "fr",
     *               "content": "Search"
     *           }
     *       ]
     *   }
     *
     * return string
     */
    function getMessage(value, locale) {

        function _findTranslation(value, locale) {
            if (value.translations) {
                var translation = _.findWhere(
                    value.translations, { locale: locale }
                );
                return translation && translation.content;
            } else {
                // fallback to old translation definition to support
                // backwards compatibility with existing forms
                return value[locale];
            }
        }

        if (!_.isObject(value)) {
            return value;
        }

        locale = locale || getLocale();

        var test = false;
        if (locale === 'test') {
            test = true;
            locale = 'en';
        }

        var result =

            // 1) Look for the requested locale
            _findTranslation(value, locale)

            // 2) Look for the default
            || value.default

            // 3) Look for the English value
            || _findTranslation(value, 'en')

            // 4) Look for the first translation
            || (value.translations && value.translations[0] 
                && value.translations[0].content)

            // 5) Look for the first value
            || value[_.first(_.keys(value))];

        if (test) {
            result = '-' + result + '-';
        }

        return result;
    }

    /*
     * Translate a given string or translation object based on translations and
     * locale.
     *
     * @param {Array} translations
     * @param {Object|String} key
     * @param {String} locale
     *
     * @return String
    */
    function translate(translations, key, locale, ctx) {

        var value,
            ctx = ctx || {};

        if (_.isObject(locale)) {
            ctx = locale;
            locale = null;
        }

        if (_.isObject(key)) {
            return getMessage(key, locale) || key;
        }

        value = _.findWhere(translations, {
            key: key
        });

        value = getMessage(value, locale) || key;

        // underscore templates will return ReferenceError if all variables in
        // template are not defined.
        try {
            return _.template(value)(ctx);
        } catch(e) {
            return value;
        }
    }

    if (app_settings.muvuku_webapp_url) {
        var muvuku = url.parse(app_settings.muvuku_webapp_url, true);
        muvuku.search = null;
        muvuku.query._sync_url = require('duality/utils').getBaseURL() + '/add';

        if (app_settings.gateway_number) {
            muvuku.query._gateway_num = app_settings.gateway_number;
        }

        app_settings.muvuku_webapp_url = url.format(muvuku);
    }

    app_settings.sha = this.kanso && this.kanso.git && this.kanso.git.commit;
    app_settings.translations = app_settings.translations || [];
    app_settings.translate = _.partial(translate, app_settings.translations);
    app_settings.getMessage = getMessage;
    app_settings.getForm = getForm;
    app_settings.getLocale = getLocale;

    return app_settings;
};
```
