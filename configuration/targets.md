# Targets

Targets refers to our in-app analytics widgets. These widgets can be configured to track metrics for an individual CHW or for an entire health facility, depending on what data the logged in user has access to. Targets can be configured for any user that has offline access (user type is "restricted to their place"). When configuring targets, you have access to the currently selected contact and all of the reports about that contact.

## Types of Widgets

We currently have 3 types of widgets available:

1. Plain count with no goal
![Count no goal](img/target_count_no_goal.png)
1. Count with a goal
![Count with goal](img/target_count_with_goal.png)
1. Percentage with a goal
![Percentage with goal](img/target_percent_with_goal.png)

## Using Targets

As you'll see in the `task-rules.js` files for existing project, in order to make targets work, you have to first create the target and then emit the target. There are functions for both of these steps already written.

### Creating a Target

```
var createTargetInstance = function(type, report, pass) {
  return new Target({
    _id: report._id + '-' + type,
    deleted: !!report.deleted,
    type: type,
    pass: pass,
    date: report.reported_date
  });
};
```

### Emitting a Target
```
var emitTargetInstance = function(instance) {
  emit('target', instance);
};
```
## Target Properties

When creating a target, you are required to pass in a type, a report and pass (as shown in the above function). Targets have several properties:

* `_id`: By default, the `_id` is set to [report ID]-[type]. [report ID] is the `_id` of the report that you passed in.
* `deleted`: Set based on whether the report that generated the target is deleted.
* `type`: Set to the passed in value that you provide. The `type` must match the `id` that you list in your `targets.json` file. More on the `targets.json` file below.
* `pass`: Can be true or false. True if the report meets the specified condition and false if the report doesn't meet the condition. The total number of target emissions is always equal to the number of targets emitted with `pass: true` plus the number of targets emitted with `pass: false`.
* `date`: By default, this is set to the `reported_date` of the report that you provided.

It's possible to change any of the properties of a target before you emit it. This can come in handy when configuring different types of targets. Some examples will be outlined later in this document. Once you have created your target and made any changes to its properties, make sure you emit the target using the `emitTargetInstance` function.

## Tips & Tricks

1. Percentage targets are always equal to: `(number of true targets) / (number of true targets + number of false targets)`
1. It's possible to emit a target that refers to the same form or contact multiple times. This can be used to calculate percentage targets by emitting a false target for each of the forms or contacts that you want to include and then emitting true only for the ones that meet certain conditions. See the Calculate Percent of Households that were Surveyed example below.
1. Remember that targets are emitted in a specific order, so if you are using the method in the previous tip, this might impact your results. The app will always use the target emitted most recently, so if you emit false, true, false for the same form or contact, then the app will consider it a false target, even though there was a true emitted at some point. 

## Configuring Targets

Targets are configured in two places: `task-rules.js` and `targets.json`. `task-rules.js` is where you define the calculation for each of your targets. `targets.json` is where you define how the target looks, including the title, icon and goal (if applicable). It is also where you set the `context` for each widget. 

### `targets.json`

Each of your targets must be defined so that the app knows how to render it. You will need to include the following properties for each of your targets:

* `type`: There are currently two types of targets, `count` and `percent`. These are illustrated above in the Types of Widgets section. 1 & 2 are the `count` type and 3 is the `percent` type.
* `id`: This can be whatever you like, but it must match the `type` property of the target being emitted in `task-rules.js`.
* `icon`: You can use any icon that you like, but make sure the icon has been uploaded to your instance and the name matches.
* `goal`: For percentage targets, you must put a positive number. For count targets, put a positive number if there is a goal. If there is no goal, put -1.
* `context`: This is an expression similar to form context that describes which users will see a certain target. In this case, you only have access to the `user` (person logged in) and not to the `contact` since you are not on a person or place profile page.
* `name`: The name of your target that will appear to the user. This field supports locales, so you can include translations if you have users viewing the app in different languages on the same instance.

#### Example Target Definition - Count

```
{
  "type": "count",
  "id": "assessments-u1",
  "icon": "infant",
  "goal": 4,
  "context": "user.parent.parent.name == 'San Francisco'",
  "name": [
    {
      "locale": "en",
      "content": "U1 Sick Child Assessments"
    }
  ]
}
```

#### Example Target Definition - Percent

```
{
  "type": "percent",
  "id": "newborn-visit-48hr",
  "icon": "mother-child",
  "goal": 85,
  "name": [
    {
      "locale": "en",
      "content": "% Newborn Care Visit within 48 hours"
    }
  ]
}
```


### `task-rules.js`

Each target must also be created and emitted, as discussed above. The creation and emission of targets happens in `task-rules.js`. This is also where you will define when a target meets the specified condition and when it doesn't. Below are some examples of targets, from the most basic to the more complex.

#### Simple Count - This Month

The most basic target is a simple count of a particular type of report. In this case, we are counting the number of pregnancy registrations.

```
if (c.contact != null) {
  if(c.contact.type === 'person'){
    c.reports.forEach(function(r) {
      if (r.form === 'pregnancy') {
        // Finds instances of the pregnancy registration form. No conditions, just counts every pregnancy form submission.
        var instance = createTargetInstance('pregnancy-registrations', r, true);
        emitTargetInstance(instance);
      }
    });
  }
}
```

You may also want to count the number of households or people registered. This target counts up the number of `clinic`s, in this case households, that have been registered. Using this target will give you a count of families registered this month.

```
if (c.contact != null) {
  if(c.contact.type === 'clinic'){
    // Find all households
    // NO condition to check the form name since place forms are not submitted as reports
    var instance = createTargetInstance('hh-registration', c.contact, true);
    emitTargetInstance(instance);    
  }
}
```

#### Simple Count - All Time

You may also want to count the total number of pregnancies registered over all time. The key to all time targets is adjusting the target date to sometime in the current month. The easiest way is to set the target's date to today.

```
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    var today = new Date();

    if (r.form === 'pregnancy') {
      // Find instances of the pregnancy registration form.
      var instance = createTargetInstance('pregnancy-registrations', r, true);
      // Set the target's date to today's date
      instance.date = now.getTime();
      emitTargetInstance(instance);
    }
  });
}
```

You can do the same with all-time household registrations. Simply set the target's date to today's date to get an all-time count.

```
if (c.contact != null) {
  var today = new Date();

  if(c.contact.type === 'clinic') {
    // Find all households
    var instance = createTargetInstance('hh-registration', c.contact, true);
    // Set the target's date to today's date
    instance.date = today.getTime();
    emitTargetInstance(instance);
  }
}
```

#### Count with Conditions - This Month

Sometimes you may want to count a subset of a particular type of form that meets certain conditions. This example looks for ICCM assessments where the diagnosis was malaria and will give us the total this month.

```
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    // Find all assessment forms where the CHW was instructed to treat for malaria.
    if (r.form === 'assessment' && r.fields.treat_for_malaria == 'true') {
	  // Create a target instance for each of these assessments where the CHW treated for malaria
      var instance = createTargetInstance('treatment-malaria', r, true);
      emitTargetInstance(instance);
    }
  });
}
```

#### Count with Conditions - All Time

If you want to count a subset of a particular form that meets certain conditions over all time, simply set the target's date to today's date, as shown above.

```
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    var today = new Date();
    var dob_1yr = new Date();
    dob_1yr.setFullYear(today.getFullYear()-1);

    // Find all assessment forms where a child under 1 year was assessed
    if (r.form === 'assessment && dob_contact > dob_1yr) {
      var instance = createTargetInstance('assessments-u1', r, true);
      // Set the target's date to today's date
      instance.date = today.getTime();
      emitTargetInstance(instance);
    }
  });
}
```

#### Percent - This Month

Percent targets always have a condition, so you will be emitting some targets that have `pass: true` and some that have `pass: false`. This is achieved by setting a variable, `pass`, equal to an expression that evaluates to either true or false. When calculating the percentage, it will be number of true targets divided by number of true targets plus number of false targets.

```
// % Newborn Care Visit within 48 hours
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    var today = new Date();
    // Find all delivery reports
    if (r.form === 'postnatal_care' && r.fields.delivery_date != '') {
      // Calculate the 48 hour cutoff
      var followup_cutoff = new Date(r.fields.delivery_date);
      followup_cutoff.setDate(followup_cutoff.getDate() + 2);
      followup_cutoff.setHours(23, 59, 59);
      // See if the date the delivery report was submitted is before the 48 hour cutoff
      var pass = new Date(r.reported_date) <= followup_cutoff;
      // Pass in the pass variable when creating the target instead of true or false
      var instance = createTargetInstance('newborn-visit-48hr', r, pass);
      emitTargetInstance(instance);
    }
  });
}
```

#### Percent - All-time

This target finds all delivery reports and checks to see if the delivery was at the health facility. It sets the target's date to today's date so that we can count over all time.

```
// % DELIVERIES AT HEALTH FACILITY ALL-TIME
if (c.contact != null && c.contact.type === 'person') {
  var today = new Date();
  // Calculate most recent delivery timestamp for the current contact
  var newestDeliveryTimestamp = Math.max(
		                                 Utils.getMostRecentTimestamp(c.reports, 'D'),
		                                 Utils.getMostRecentTimestamp(c.reports, 'delivery')
		                                 );

  c.reports.forEach(function(r) {
    // Find all delivery reports
    if (r.reported_date === newestDeliveryTimestamp && (r.form === 'D' || r.form === 'delivery')) {
      // If the delivery was in a facility, pass = true; if not, pass = false
      var pass = r.fields.delivery_code && r.fields.delivery_code.toUpperCase() == 'F';
      // Pass in the variable pass when creating the target
      var instance = createTargetInstance('delivery-at-facility-total', r, pass);
      instance.date = today.getTime();
      emitTargetInstance(instance);
    }
  });
}
```

### More Target Examples

This section contains some other examples of more complex targets. For more examples, review `task-rules.js` for [LG Kenya](https://github.com/medic/medic-projects/blob/master/lg-kenya/tasks/task-rules.jshttps://github.com/medic/medic-projects/blob/master/brac-uganda/tasks/task-rules.js).

#### Calculate Percent of Households that were Surveyed - All-Time

In this case, we are emitting a false target for every household and then a true target for every household for which a survey was done. Because the true target will be emitted after the false target, it will overwrite the false target.

```
// Find all households
if(c.contact.type === 'clinic'){
  var today = new Date();
  // Find the time of the most recent survey
  var newestEquitySurveyTimestamp = Utils.getMostRecentTimestamp(c.reports, 'family_equity');

  // Emit a false target for every household that has been registered to make sure that we capture every household
  var instance = createTargetInstance('surveys-conducted', c.contact, false);
  instance.date = today.getTime();
  emitTargetInstance(instance);

  // Review all report for the current household
  c.reports.forEach(function(r) {
    // Find out if a survey form was completed for this household
    if (r.form === 'family_equity' && r.reported_date >= newestEquitySurveyTimestamp){
      // If there is a survey, emit a true target for the household to replace the false target
      // This will result in displaying the % of households registered that had a survey done
      var instance = createTargetInstance('surveys-conducted', c.contact, true);
      // Set the target's date to today to get an all-time count
      instance.date = today.getTime();
      emitTargetInstance(instance);
    }
  });
}
```

#### Count Number of Households Visited by CHW - This Month

```
if (c.contact != null && c.contact.type === 'person') {
  // For each report about a family member
  c.reports.forEach(function(r) {
    // Create a true target that refers to the household the person belongs to
    var instance = createTargetInstance('hh-visits', c.contact.parent, true);
    // Set the target date to the current report
    instance.date = r.reported_date;
    // If the current report was submitted this month, emit the target
    if(r.reported_date >= month_start_date) {
      emitTargetInstance(instance);
    }
  });
}
```

#### Calculate Percent of CHWs Visited by their Manager - This Month

This target is for a CHW manager. It calculates the percentage of the CHWs they manage that they have visited this month.

```
// health_center is a CHW area in this case
if (c.contact != null && c.contact.type === 'health_center'){
  var newestCHWVisitTimestamp = Utils.getMostRecentTimestamp(c.reports, 'chw_visit');

  // Look for all CHW areas for which you are the supervisor
  if(c.contact.supervisor == user._id) {
    // Create a false target for each CHW area
    // Note that we are using the contact to create the target
    var instance = createTargetInstance('chws-visited', c.contact, false);
    // Set the target date to today so that we have a false target this month for every CHW area
    instance.date = today.getTime();
    emitTargetInstance(instance);
  }
  c.reports.forEach(function(r) { 
    // Find all of the CHW visit forms that are the most recent and that are for CHWs you supervise
    if(r.form == 'chw_visit' && r.reported_date >= newestCHWVisitTimestamp && c.contact.supervisor == user._id) {
      // If a CHW visit was done, emit a true target
      // Use the contact to create the target so that it matches the targets emitted above and will override them as needed
      var instance = createTargetInstance('chws-visited', c.contact, true);
      // Set the target date to the date of the CHW visit so that we only count visits done this month
      instance.date = r.reported_date;
      emitTargetInstance(instance);
    }
  });
}
```

#### Percent of PNC Visits within 72 hours of Birth - This Month

This target determines the % of PNC visits that occurred within 72 hours of birth. First, it looks at the PNC visits that were done to see if they were done on time. Second, it looks at all pregnancies registered with recent EDDs to see if a PNC visit was done. If not, it counts as a PNC visit that was not on-time.

```
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    // For each PNC form, check to see if it's a delivery report and if it is more recent than the most recent pregnancy registration
    if (r.form === 'postnatal_care' && r.fields.delivery_date != '' && r.reported_date > newestPregnancyTimestamp) {
      // Create a variable to track the cutoff date for when PNC must be done
      var followup_cutoff = new Date(r.fields.delivery_date);
      followup_cutoff.setDate(followup_cutoff.getDate() + 3);
      followup_cutoff.setHours(23, 59, 59);
      // Pass = true if the PNC/delivery report was submitted before the cutoff
      var pass = new Date(r.reported_date) <= followup_cutoff;
      var instance = createTargetInstance('newborn-visit-72hr', r, pass);
      emitTargetInstance(instance);
    }

    // Look at each pregnancy registration to see if the EDD falls within the current month. This tells us if there are any pregnancies for which we expect a PNC/delivery report this month.
    // Make sure the pregnancy registration is the most recent registration and that it is more recent than the most recent PNC/delivery report so that there is no overlap with the previous section where we looked at PNC/delivery reports.
    if (r.form === 'pregnancy' && r.reported_date >= newestPregnancyTimestamp && r.reported_date > newestPostnatalTimestamp) {
      // We only want to look at pregnancies with EDDs this month that were at least 3 days ago
      // Create a variable to set the cutoff for EDDs we want to consider (3 days ago)
      var edd_cutoff = new Date();
      edd_cutoff.setDate(today.getDate() - 3);
      edd_cutoff.setHours(23, 59, 59);
      // Create a variable to keep track of the start date of this month
      var month_start_date = new Date(today.getFullYear(), today.getMonth(), 1);
      // Calculate the EDD based on the LMP reported in the pregnancy registration
      var edd = new Date(r.fields.lmp_date);
      edd.setDate(edd.getDate() + 280);
      edd.setHours(0,0,1);

      var pass;
      // Check to see if the EDD falls this month but before the EDD cutoff. 
      // Make sure the most recent pregnancy registration is more recent than the most recent pregnancy visit OR the most recent pregnancy visit is more recent than the most recent pregnancy registration but there has been no delivery report.
      if(edd >= month_start_date && edd <= edd_cutoff && (newestPregnancyTimestamp > newestPregnancyVisitTimestamp || (newestPregnancyVisitTimestamp > newestPregnancyTimestamp && newestPregnancyVisit.fields.discontinue_follow_up === 'false'))) {
        // Create a variable to track the start of the window for which we want to look for PNC/delivery reports for any EDDs this month
        var edd_window_start = new Date(edd);
        edd_window_start.setDate(edd.getDate() - 60);
        // If the most recent PNC/delivery report occurred within the 60-day window, pass = true because the PNC/delivery report was done
        // We are assuming that any PNC within 60 days would be for the pregnancy with an EDD this month
        if(newestPostnatalTimestamp >= edd_window_start && newestPostnatalTimestamp < today) {
          pass = true;
        }
        // If not, pass = false because the PNC/delivery report was not done but we were expecting it to have happened
        else {
          pass = false;
        }
        var instance = createTargetInstance('newborn-visit-72hr', r, pass);
        // Set the target date to the EDD since we know that the EDD will be within the current month
        instance.date = edd;
        emitTargetInstance(instance);
      }
    }
  });
}
```