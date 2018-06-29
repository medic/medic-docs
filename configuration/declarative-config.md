# Overview
Workflows in the Medic app are highly configurable using a combination of XForms, JSON, and JavaScript files. The JavaScript portion allows for full control of tasks, targets, and contact profiles. This portion of the configuration is also time consuming to write, and error prone to maintain over time. For this reason we've developed a simpler way to define tasks in the configuration. Previously iterative code genertates all configured elements. Now, with the _declarative configuration_ method, you define each element in the app in a modular way, and then specify when and how it should show. This document is meant to be a guide for configuring tasks, targets, and contact profiles in the Medic app using declarative configurations.

# Background
Having robust configuration code is pivotal in having a successful deployment of Medic tools. Configuration for Tasks, Targets, and Contact Summary in Medic Mobile applications is driven by JavaScript code. It has historically been a series of nested loops and conditional statements, using functions and calculations to pump out each task, target, and contact profile card to show. These code heavy configurations are difficult to write, understand, maintain, and test because imperative configuration code spews out the configured elements with project-specific logic. Modifying any element requires understanding large portions of the configuration, including the code and context. As the number of Tasks, Targets, or Condition Cards increases, so does the complexity. The result is that strong development skills are needed to create and manage each project configuration, as well as considerable time to understand the workflows and context. An error in any of this code can make the application non-usable, which does not always get reported to project managers.

In order to build and maintain robust configurations quickly we now have isolated each configured element (ie task, targets, contact profile fields and condition cards) and attached to it the logic needed to display them properly. Writing new configuration elements is easier because they are independent from others. Similarly, editing existing elements requires understanding of that individual element only, and changes to one element does not impact others in the configuration.

# Declarative Tasks
All tasks are now defined in the `tasks.js` file, which contains a JavaScript array of objects. Each object corresponds to a set of task events that could show in the app. The properties for the object are used to define when the task's events can show, and what they should look like. 

Although the file contains JavaScript, its modular and declarative nature makes it much easier to manage. For instance, here is a simple example that generates two `postnatal-visit` tasks for each `delivery` form:

```js
[
  {
    icon: 'mother-child',
    title: [ { locale:'en', content:'Postnatal visit needed' } ],
    appliesToForms: [ 'delivery' ],
    actions: [ { form:'postnatal_visit' } ],
    events: [
      {
        id: 'postnatal-visit',
        days:7, start:2, end:2,
      },
      {
        id: 'postnatal-visit',
        days:14, start:2, end:2,
      }
    ]
  }
]
```

## Declarative task properties

More complex tasks can be written using the full set of properties for tasks, as detailed in the following table: 

| property | description | required |
|---|---|---|
| `name`| Unique identifier for the task. | no |
| `icon` | The icon to show alongside the task. | no |
| `title` | The title of the task when shown in the app. Structured as a localization label array. | yes |
| `appliesToType` | `'report'`, `'person'`, `'place'`. Not yet implemented, only `'report'` works. | yes |
| `appliesToForms` | array. The form codes for which this task should be associated. | yes, if `appliesToType` is `'report'` |
| `appliesToScheduledTaskIf` | function(report,index). If present, associate the task to the report's scheduled_task elements for which the function returns true. | no |
| `appliesIf` | function(contact, report). Create the task only if this function returns true. | no |
| `resolvedIf` | function(contact, report, event, dueDate, index). Create the task only if this function returns true. | yes |
| `events` | An array of task events. | yes |
| `events.id` | Unique ID for this task event | yes |
| `events.dueDate` | Date the task is due | yes, unless `days` is set |
| `events.days` | Number of days after the dueDate that the event is due  | yes, unless dueDate is set |
| `events.start` | Number of days to show the task before it is due | yes |
| `events.end` | Number of days to show the task after it is due | yes |
| `actions` | This is an array of the actions (forms) that a user can access after clicking on a task. If you put multiple forms here, then the user will see a task summary screen where they can select which action they would like to complete. Within your array of `actions` there are some additional properties that you can define. | yes |
| `actions[n].type` | Type of action, usually `'report'`. | yes |
| `actions[n].form` | The form that should open when you click on the action. | yes |
| `actions[n].label`|  The label that should appear on the button to start this action on the task summary page ('Click here to begin the follow up' in our example summary screen above). | no |
| `actions[n].content`|  Contains fields that you want to pass into the form that will open when you click on the task or action. | no |
| `priority` | Object with the priority `level` and `label`. Can alternatively be a function that, given the contact and report an object with the priority `level` and `label`. | no |
| `priority.level` | Can be `high`, `medium` (default). Tasks that are high risk will display a high risk icon with the task. | no |
| `priority.label` | Text shown with the task associated to the risk level. | no |

## Additional code
Helper variables and functions can be defined in `nools-extras.js` to keep the task definitions easy to read and manage. To enable reuse of common code, `nools-extras.js` file is shared by both the Tasks and Targets.

## Examples

### tasks.js
```js
[
  // PNC TASK 1: If a home delivery, needs clinic tasks
  {
    icon: 'mother-child',
    title: [ { locale:'en', content:'Postnatal visit needed' } ],
    appliesToForms: [ 'D', 'delivery' ],
    appliesIf: function(c, r) {
      return isCoveredByUseCase(c.contact, 'pnc') &&
          r.fields &&
             r.fields.delivery_code &&
             r.fields.delivery_code.toUpperCase() !== 'F';
    },
    actions: [ { form:'postnatal_visit' } ],
    events: [ {
      id: 'postnatal-home-birth',
      days:0, start:0, end:4,
    } ],
    priority: {
      level: 'high',
      label: [ { locale:'en', content:'Home Birth' } ],
    },
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there a visit report received in time window or a newer pregnancy
      return r.reported_date < getNewestDeliveryTimestamp(c) ||
             r.reported_date < getNewestPregnancyTimestamp(c) ||
             isFormFromArraySubmittedInWindow(c.reports, postnatalForms,
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  }
]
```

### nools-extras.js
```js
function isCoveredByUseCase(contact, usecase) {
    // ...
}
function getNewestDeliveryTimestamp(c) {
    // ...
}
function getNewestPregnancyTimestamp(c) {
    // ...
}
function isFormFromArraySubmittedInWindow(reports, formsArray, startTime, endTime) {
    // ...
}
```


# Declarative Targets
All targets are now defined in the `targets.js` file, which defines a JavaScript variable `targets` as an array of objects. Each object corresponds to a target widget that could show in the app. The properties for the object are used to define when the target widget can show, what it should look like, and what to values to include. 

Like `tasks.js`, the Targets file contains JavaScript but its modular and declarative nature makes it much easier to manage. For instance, here is a simple example that generates two `postnatal-visit` tasks for each `delivery` form:

```js
var targets = [
  // BIRTHS THIS MONTH
  {
    id: 'births-this-month',
    type: 'count',
    icon: 'infant',
    goal: -1,
    translation_key: 'targets.births.title',
    appliesToType: 'report',
    appliesIf: isHealthyDelivery,
  },
```

## Declarative target properties

More complex targets can be written using the full set of properties for targets, as detailed in the following table: 

| property | description | required |
|---|---|---|
| `id` |Unique identifier for the target | yes |
| `type` |The type of widget to show, either `count` or `percent`. | yes |
| `icon` |Icon to show with the target, matching the name in the resources file. | no, but recommended |
| `goal` |For percentage targets, you must put a positive number. For `count` targets, put a positive number if there is a goal. If there is no goal, put -1. | yes |
| `context` |The context in which this widget is relevant to the `user`. This widget will only be shown if the expression evaluates to true. | no |
| `translation_key` |Translation key for the title of this target. | no, but recommended |
| `subtitle_translation_key` |Translation key for the subtitle of this target. If none supplied the subtitle will be blank. | no |
| `percentage_count_translation_key` |Translation key for the percentage value detail shown at the bottom of the target, eg |"(5 of 6 deliveries)". The translation context has `pass` and `total` variables available. If none supplied this defaults to `targets.count.default`. | no |
| `appliesToType` | `'report'`, `'person'`, `'place'`. Currently only supports `'report'` and `'person'`. | yes |
| `appliesToForms` | array. The form codes for which this target should be associated. | yes, if `appliesToType` is `'report'` |
| `appliesIf` | function(contact, report). Create the target only if this function returns true. | no |
| `date` | By default only values for this month are shown in targets. Set to `'now'` if doing an all time count. Set to `'reported'` for time relevant counts, which relies on the doc's `reported_date`. | no |
| `emitCustom` | function(contact, report). Each defined target emits one target instance per doc. A function can be defined here to emit a custom target instance, or multiple instances. | no |
| `idType` | By default only one target instance is counted per contact. When multiple reports should be counted, eg counting multiple visits for a person, this property must be set to `'report'`. | no |
| `passesIf` | function(contact, report). Evaluated to determine if instance counts towards the value. For percent widgets this affects whether the instance is included in the numerator. | yes, if `type` is `'percent'` |

## Additional code
Helper variables and functions can be defined in `nools-extras.js` to keep the target definitions easy to read and manage. To enable reuse of common code, `nools-extras.js` file is shared by both the Tasks and Targets.

## Examples

### targets.js
```js
var targets = [
  // BIRTHS THIS MONTH
  {
    id: 'births-this-month',
    type: 'count',
    icon: 'infant',
    goal: -1,
    translation_key: 'targets.births.title',
    subtitle_translation_key: 'targets.this_month.subtitle',

    appliesToType: 'report',
    appliesIf: isHealthyDelivery,
    date: 'reported',
  },

  // % DELIVERIES ALL TIME WITH 1+ VISITS
  {
    id: 'delivery-with-min-1-visit',
    type: 'percent',
    icon: 'nurse',
    goal: 100,
    translation_key: 'targets.delivery_1_visit.title',
    subtitle_translation_key: 'targets.all_time.subtitle',

    appliesToType: 'report',
    idType: 'report',
    appliesIf: isHealthyDelivery,
    passesIf: function(c, r) {
      var visits = countReportsSubmittedInWindow(c.reports, antenatalForms, r.reported_date - MAX_DAYS_IN_PREGNANCY*MS_IN_DAY, r.reported_date);
      return visits > 0;
    },
    date: 'now',
  },
]
```

### nools-extras.js
```js
function isHealthyDelivery(c, r) {
  return r.form === 'D' ||
      (r.form === 'delivery' && r.fields.pregnancy_outcome === 'healthy');
}

function countReportsSubmittedInWindow(reports, form, start, end) {
  var reportsFound = 0;
  reports.forEach(function(r) {
    if (form.indexOf(r.form) >= 0) {
      if (r.reported_date >= start && r.reported_date <= end) {
        reportsFound++;
      }
    }
  });
  return reportsFound;
}

```

# Contacts
<!-- TODO: Flesh out documentation for Contacts section -->
## Context
An object that is made available as context for forms. 

## Fields
Each field that can be shown on a contact's profile is defined as an objects in the `fields` array. The properties for each object determine how and when the field is shown. 

| property | description | required |
|---|---|---|
| `appliesToType` | | | 
| `label` | | |
| `value` | | |
| `width` | | |
| `filter` | | |
| `appliesIf` | | |

## Cards
| property | description | required |
|---|---|---|
| `label` | | |
| `appliesToType` | | |
| `appliesIf` | | |
| `fields` | | |
| `fields.label` | | |
| `fields.value` | function(r) | |
| `fields.filter` | | |
| `fields.width` | | |
| `fields.translate` | | |
| `fields.context` | | |
| `fields.icon` | | |
| `modifyContext` | function(ctx) | |

# Notes

## Nools-extras
Helper variables and functions can be defined in `nools-extras.js`, and is shared by both `tasks.js` and `targets.js`. The following are global variables that can be used:
| variable | description |
|---|---|
| `c.contact` | The contact's doc. All contacts have `type` of either `person` or `place`.
| `c.reports` | An array of all the reports submitted about the contact.
| `console` | Useful for outputting _debugging_ statements. Should not be used in production code. |
| `Utils` | Useful functions across projects are available, and describe in the Utils section. |

## Utils
Utility functions are available for your configuration and have been included to make common tasks much easier. To use the function call `Utils.<function-name>(<params>)`, for example `Utils.addDate(report.reported_date, 10)`.

| Name | Description |
|---|---|
| isTimely(date, event) | Returns true if the given date is after the start date and before the end date of the event. |
| addDate(date, days) | Returns a new Date set to midnight the given number of days after the given date. If no date is given the date defaults to today. |
| getLmpDate(doc) | Attempts to work out the LMP from the given doc. If no LMP is given it defaults to four weeks before the reported_date. |
| getSchedule(name) | Returns the task schedule with the given name from the configuration. |
| getMostRecentTimestamp(reports, form) | Returns the reported_date of the most recent of the reports with form ID matching the given form. |
| getMostRecentReport(reports, form) | Like `getMostRecentTimestamp` but returns the report, not just the reported_date. |
| isFormSubmittedInWindow(reports, form, start, end) | Returns true if any of the given reports are for the given form and were reported after start and before end. |
| isFirstReportNewer(firstReport, secondReport) | Returns true if the firstReport was reported before the secondReport. |
| isDateValid(date) | Returns true if the given date is a validate JavaScript Date. |
| now() | Returns the current Date. |
| MS_IN_DAY | A constant for the number of milliseconds in a day. |

If you can think of any others you'd like to be included raise an issue in [medic/medic-webapp](https://github.com/medic/medic-webapp/issues).
