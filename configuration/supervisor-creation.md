# Branch Manager Creation
This is mostly and adaptation (and some rewriting) of the user creation with supervisor process from medic/medic-bulk-utils.

Basically, we'll need to have two lists:
- One containing the be list of branches and the UUIDs
- One containing the branch managers and the branch they are associated to

One thing to note is that we'll be embedding the place in the generated CSV rather than passing it to the import command. This allows us to import supervisors for many braches at one go.

The first step just creates people (and user accounts) at the brach level. A second step modifies the _user_ and and _user-preferences_ details to add a _branch_manager_ role.

**Makefile**
```Makefile
#
#  `import` targets default to dry run, so to do a real import set some
#  variables:
#
#   EXTRA_IMPORT_FLAGS='' EXTRA_IMPORT_FILTERS=cat make import
#

EXTRA_IMPORT_FLAGS ?= -d
EXTRA_IMPORT_FILTERS ?= head -2

all: init dist/zones.csv

.PHONY: init

init:
	test -d dist || mkdir dist

dist/zones.csv: CHW_Zones.csv
	cat CHW_Zones.csv | \
	  ../node_modules/.bin/medic-format-csv -c zones-config.js \
	    > dist/zones.csv

import: import-zones import-users

import-zones:
	# create people associated with zones
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ../node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c place,contact.uuid:uuid,contact.name:name,phone\
	  people
	
import-users:
	cat dist/zones.csv | $(EXTRA_IMPORT_FILTERS) | ../node_modules/.bin/medic-import \
	  $(EXTRA_IMPORT_FLAGS) \
	  -c username,password,place,contact.uuid:contact,contact.name:name,external_id \
		users
fix-bm-role:
	cat dist/zones.csv | ./fix-bm-role-script		

clean:
	rm -rf dist
```

**branch-config.js**
```javascript
var uuid = require('uuid');

var branchConfig = {
  columns: {
    name: {
      use: 'Name',
      unique: true
    },
    uuid: 'uuid'
  }
};

module.exports = branchConfig;
```

**zones-config.js**
```javascript
var normalize = require('medic-bulk-utils').normalize,
    password = require('password-generator'),
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path'),
    relatedData,
    config;

var branchManagerConfig = {
  columns: {
    chw_name: 'Name',
    'contact.uuid': uuid,
    'contact.name': function() {
      return normalize.name(this.chw_name);
    },
    username: {
      format: function() {
        return normalize.username(normalize.name(this.chw_name));
      },
      unique: true
    },
    password: password,
    branch: {
      use: 'Branch',
      optional: true
    },

    place: function() {
      var key = this.branch.trim();
      if (!key) return;
      if (!relatedData[key]) {
        console.error(this);
        throw new Error('Branch key not found: ' + key);
      }
      return relatedData[key];
    }
  },
  related: {
    load: function(callback) {
      var file = [__dirname, 'Branches.csv'].join(path.sep);
      if (!relatedData) {
        relatedData = {};
      }
      csv
        .fromPath(file, {headers:true})
        .on("data", function(obj) {
          relatedData[obj.name] = obj.uuid;
        })
        .on("end", function() {
          callback();
        });
    }
  }
};

config = branchManagerConfig;

module.exports = function(callback) {
  if (config.related && config.related.load) {
    config.related.load(function(err) {
      if (err) {
        return console.error(err);
      }
      callback(null, config);
    });
  } else {
    callback(null, config);
  }
};
```

**fix-bm-role-script**
```javascript
#!/usr/bin/env node

var url = require('url'),
    csv = require('fast-csv'),
    PouchDB = require('pouchdb')
    _ = require('underscore');

var importer,
    options = {
      wait: 500, // wait between requests
    },
    stats = {rows: 0, requests:0, responses:{}};
    

var outputError = function() {
  var RED = '\033[0;31m';
  var NC = '\033[0m';

  var args = Array.prototype.slice.call(arguments);

  args[0] = RED + arguments[0] + NC;

  console.error.apply(null, args);
};

// requires node >= 4 because of the multi-line string.
if (process.version.match(/^v(\d+\.\d+)/)[1] < 4) {
  outputError('Please upgrade your NodeJS to >= 4.');
  process.exit(1);
}

if (process.env.COUCH_URL) {
  reqOpts = url.parse(process.env.COUCH_URL);
} else {
  console.error('Missing COUCH_URL');
  usage();
}

var recordStat = function(obj) {
  var resCode = obj.ok? 200: obj.status;
  if (resCode) {
    if (typeof stats.responses[resCode] === 'undefined') {
      stats.responses[resCode] = 0;
    }
    stats.responses[resCode]++;
  }
};

var roleUpdater = function(db, obj, task_key){
  return db.get('org.couchdb.user:' + obj.username)
    .then(function(doc){
      console.log('Now updating ' + task_key + ' for ' + obj.username);
      if (doc.roles.indexOf("branch_manager") === -1){
        doc.roles.push("branch_manager");
      }
      return db.put(doc);
    })
    .then(function(res){  
      console.log(res);
      recordStat(res);
      return Promise.resolve();
    })
    .catch(function(err) {
      recordStat(err);
      outputError(
        'failed to update user %s status: %s reason: %s',
        obj.username,
        err.status,
        err.status === 500 ? 'Server error':err.reason
      );
    });
};

var updateUser = function(obj) {
  var prefs_db = new PouchDB(url.format(reqOpts), {
    ajax: {
      timeout:false
    }
  });
  
  reqOpts.pathname = '/_users';
      
  var user_db = new PouchDB(url.format(reqOpts), {
    ajax: {
      timeout:false
    }
  });
  stats.requests++;
  
  Promise.resolve()
    .then(_.partial(roleUpdater, user_db, obj,'users'))
    .then(_.partial(roleUpdater, prefs_db, obj,'user_prefs'));
};

var onDataHandler = function(obj) {
  stats.rows++;
  console.log('Now processing user: ' + obj.username);
  updateUser(obj);
};

csv
  .fromStream(process.stdin, {headers:true})
  .on('data', onDataHandler)
  .on('end', function() {
    console.info(
      'processing %s rows, will take about %s minutes.',
      stats.rows,
      (((stats.rows * options.wait)/1000) / 60).toFixed(1)
    );
  });

var responsesContainErrors = function(responses) {
  return Object.keys(responses).some(function(key) {
    return !key.startsWith('2');
  });
};

process.on('exit', function() {
  console.info('');
  console.info(stats);
  if (stats.responses && responsesContainErrors(stats.responses)) {
    outputError('IMPORTANT: Some errors occured during this import, please read the output above!');
  }
});

process.on('SIGINT', function() {
  process.exit();
});
```



** Tying it all together **
```bash
COUCH_URL=<admin:pass@instance-url> EXTRA_IMPORT_FLAGS='' EXTRA_IMPORT_FILTERS=cat make import
```