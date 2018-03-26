### Nools overview

[Nools](https://github.com/noolsjs/nools#usage) is a rete based engine written in javascript.

Understanding the Rete algorithm will be helpful in writing optimized rules for task and target (or other event) generation.

> The genius of the approach is to keep in memory the “status” of individual condition evaluations removing the need for constant calculations.  As a result, rules project that are by definition pattern-matching intensive can be evaluated much faster, especially as new facts need to be propagated, than using a systematic approach.

Read up on how Rete works [here](https://www.sparklinglogic.com/rete-algorithm-demystified-part-2/) and [here](http://www.jbug.jp/trans/jboss-rules3.0.2/ja/html/ch01s04.html) 


The basic structure of your rules.nools.js should look something like this:


```
define Target {
    _id: null,
    deleted: null,
    type: null,
    pass: null,
    date: null
}

define Contact {
    contact: null,
    reports: null
}

define Task {
    _id: null,
    deleted: null,
    doc: null,
    contact: null,
    icon: null,
    date: null,
    title: null,
    fields: null,
    resolved: null,
    priority: null,
    priorityLabel: null,
    reports: null,
    actions: null
}
rule GenerateClinicEvents {
    when {

    }
    then {

    }
}
```

`Target`, `Contact` and `Task` are object classes.

The Rete algorithm can be broken into the rule compilation and runtime execution.

The compilation algorithm describes how the Rules in the Production Memory generate and efficient discrimination network. A discrimination network is used to filter data.


We have 2 main types of objects coming from couch DB; contact and reports. These are our ObjectTypeNodes. They are defined in `Contact`.

```
define Contact {
    contact: null,
    reports: null
}
```

Terminal nodes are used to indicate that a single rule has matched all its conditions (full match) - in our case, the terminal node will be the emitted task or target.

### Writing rules

An basic example of a rule that checks whether a contact is of `type` `clinic` and populates the households registration target widget is shown below;

```
global today = new Date();

.
.
.

rule GenerateClinicEvents {
    when {
        c: Contact c.contact;
        t: String t === 'clinic'
        from c.contact.type;
    }
    then {
        var createTargetInstance = function(type, report, pass) {
            return new Target({
                _id: report._id + '-' + type,
                deleted: !!report.deleted,
                type: type,
                pass: pass,
                date: report.reported_date
            });
        };

        var emitTargetInstance = function(instance) {
            emit('target', instance);
        };


        // Get a count of all registered households
        var instance = createTargetInstance('hh-registration', c.contact, true);
        instance.date = today;
        emitTargetInstance(instance);
    }
}
```

You can also write rules on reports. Reports are an array of objects associated with a contact. Below is a rule that checks for reports of the `pregnancy` `form` and populated a new pregnancy referrals target widget.  

```
rule GeneratePersonEvents {
    when {
        c: Contact c.contact;
        t: String t === 'person'
        from c.contact.type;
        r: Object isObject(r) && r.form === 'pregnancy'
        from c.reports;
    }
    then {
        var createTargetInstance = function(type, report, pass) {
            return new Target({
                _id: report._id + '-' + type,
                deleted: !!report.deleted,
                type: type,
                pass: pass,
                date: report.reported_date
            });
        };

        var emitTargetInstance = function(instance) {
            emit('target', instance);
        };

        var ancVisits = r.fields.anc_details.anc_visits;
        if (ancVisits == 0) {
            var instance = createTargetInstance('new-pregnancy-referrals', r, true);
            emitTargetInstance(instance);
        }
    }
}
```

Note that you can do other checks within the RHS (`then`). 


### Globals

In the above households example `today` is defined as a global at the start of the document.
Globals are accessible through the current working scope of rules defined in a dsl (Domain Specific Language). See [here](https://github.com/noolsjs/nools#globals)
