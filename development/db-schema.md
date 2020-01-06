# Database schema conventions

CouchDB (and PouchDB in the browser) is a JSON-based NoSQL datastore that we use to store our data. While unlike SQL databases there is no enforced schema, code still follows conventions, and this document aims to describe the schema as defined by how our code operates.

In this document "record" means a JSON object that resides in CouchDB or PouchDB.

## General record data structure

|Property|Description|Required by|
|--|--|--|
|`_id`|CouchDB's unique identifier of the record|all records|
|`_rev`|CouchDB's revision marker|all records|
|`type`|The general type of the document, see below|all user-created* documents|
|`reported_date`|Numerical timestamp of when the document is first created|all user-created documents|

* User-created documents here generally means contactables and reports, but may extend further.

## Contactables (Persons and Places)

Contactables are either places (e.g. clinic), groupings (e.g. family) or people (e.g. a patient or CHW).

The `type` property of contactable records depends on the version of Medic you are running:
 - If you are running 3.7 or later you get to [configure your contact hierarchy](https://github.com/medic/medic-docs/blob/master/configuration/app-settings.md#configuring-the-contact-hierarchy), and the `type` of contactables is `contact`, and the configured type is in the `contact_type` property.
 - In earlier versions the type depended on hierarchical location of the contact. There are 3 hard coded place types: `district_hospital`, `health_centre` and `clinic` and one people type `person`. These place names are often meaningless (hence the configurable contact hierarchy in later versions) to the configured project, and are textually (ie in the UI not in data structures) renamed to mean other things. For example, as `clinic` is the lowest level it is often used to represent a family.

### Places

Represent either an actual physical location such as a clinic, or a grouping such as a family or region.

Unless a place is at the top of the hierarchy it has a `parent` place.

Each location has a primary contact, which is a `person` contactable stored in the `contact` property.

### People

People are both patients in the system and users of the system, such as CHWs or Nurses. Users have additional records marking them as users of the system (see [User](#users) below).

People always have a `parent` place.

### Parent hierachy representation

Contactables **store** their parent hierarchy as a minified hierarchical structure, which records the `_id` of each parent up until the top of the hierarchy:

```js
{
  type: 'person',
  name: 'A patient',
  parent: {
    _id: 'clinic-id',
    parent: {
      _id: 'health_centre-id',
      parent: {
        _id: 'district_hospital-id'
      }
    }
  }
}
```

Generally when contactables are **used** in the app they are first "hydrated", with the rest of the information filled in from their parent's place documents:

```js
{
  type: 'person',
  name: 'A patient',
  parent: {
    _id: 'clinic-id',
    name: 'A clinic',
    reported_date: 1234,
    ... // etc
    parent: {
      _id: 'health_centre-id',
      name: 'A Health Centre',
      reported_date: 1134,
      ... // etc
      parent: {
        _id: 'district_hospital-id',
        name: 'THE District Hospital',
        reported_date: 1034,
        ... // etc
      }
    }
  }
}
```

## Reports

Reports are created by users filling out and submitting forms, as well as sending in SMS.

All reports:
 - Use the `data_record` type
 - Have their fields stored in the `fields` property
 - Have the report author's phone number (if it exists) stored in the `from` field
 - Store the form's identifier in the `form` field
 - May have a `contact` property, which is a minified version of the report author's contact and its hierarchy (see above)

Reports can be about people or places.

Reports about people should have one or more of:
 - A patient shortcode, found at `doc.patient_id` or `doc.fields.patient_id`
 - A patient record's `_id`, found at `doc.patient_uuid` or `doc.fields.patient_uuid`, as well as potientially in the same locations as the shortcode

Reports about places should have a `doc.place_id`.

Additionally, SMS reports:
 - Have an `sms_message` property which contains, among other things, the raw SMS
 - May not have a `contact` property if the SMS comes from a phone number that does not have an associated contact

Additionally, XML reports:
 - Have the XML file that Enketo (the XForm renderer used) generates as an attachment
 - Have a `content_type` property of `xml`

## Forms

SMS forms are defined in [application config](https://github.com/medic/medic-docs/blob/master/configuration/app-settings.md#patient-reports).

XML forms are stored in the database and have:
 - An `_id` of `form:<formname>`
 - The `type` of `form`
 - The actual XML Xforms definition attached

XML forms are defined as XForm XML files

## Users

Users represent credentials and roles / permissions for accessing the application. This can either be:
 - people who can log into the application, such as CHWs or Nurses
 - or credentials granting external software restricted permissions to perform certain tasks, such as allowing an external service permission to write reports via the api.

User records have at least:
 - An `_id` of `org.couchdb.user:<username>`
 - A `name` which is the same as `<username>` above
 - A `roles` array

There are two slightly different copies of this record stored.

The record in the `_users` database includes:
 - The `type` of `user`
 - The password hash and associated data

The `_users` database is what CouchDB uses for authentication and is only editable by administrative users, so is authoritive when it comes to roles and the like.

The `medic` database stores a copy of roles and permissions along with:
 - The `type` of `user-settings`
 - They may have a `contact_id` field that is the `_id` of the _person_ that the user is attached to
 - They may also have a `facility_id` field that is the `_id` of the _place_ that the user is attached to
 - They may also have a `known` field. If this field is `true`, it means the user has logged in once and will no longer be shown the tour by default. Otherwise, it will be `undefined`.

Note that SMS users do not have a users record: their phone number will be attached to a `person` record, but they do not have a user because they do not access the application.

Users then, can be represented by up to 3 docs:
 - a `person` document that represents a physical human being in our hierarchy of places and people
 - a `users` document that represents authorisation and authentication information for physical people or authenticated external services
 - a `user-settings` document that ties the `user` and `person` documents together

 ## Tasks

[Partner configuration code](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md) running inside the Core Framework can cause tasks to appear within the Tasks tab. Each task in the tab is powered by a task document. Task documents are:

* updated only after the data for their emitting contact changes or every 7 days
* created in the database for any task due within the last 60 days
* immutable once their state is "terminal" (Cancelled, Completed, Failed)

State | Description
-- | --
Draft | Task has been calculated but it is scheduled in the future
Ready | Task is currently showing to the user
Cancelled | Task was not emitted when refreshing the requester's data. Task has invalid partner emission.
Completed | Task was emitted with { resolved: true }
Failed | Task was never terminated and the endDate has past

Attribute | Description
-- | --
user | The guid of the user who calculated and created the document. Used for controlling replication.
requester | The guid of the contact whose data brought about the creation of the document. Used for controlling cancellation.
owner | The guid of the contact whose profile this task will appear on in the contact's tab.
forId | If completing a task's action opens a form. Completing the form creates a report. `forId` is the guid of the contact information that will be passed into the form. For most forms, the resulting report will be associated with this contact.
emission | Minified task data emitted from the partner code.
stateHistory | Each time the state attribute changes, the time of the change is recorded in the state history.

```json
{
  "_id": "task~user-contact-guid~pregReport~pregnancy-facility-visit-reminder~2~523435132468",
  "type": "task",
  "authoredOn": 523435132468,
  "user": "user-contact-guid",
  "requester": "requester-contact-guid",
  "owner": "owner-contact-guid",
  "state": "Ready",
  "emission": {
    "_id": "pregReport~pregnancy-facility-visit-reminder~2",
    "forId": "for-contact-guid",
    "dueDate": "2000-01-01",
    "startDate": "1999-12-29",
    "endDate": "2000-01-08",
    // ... (minified data from the partner code)
  },
  "stateHistory": [{
    "state": "Ready",
    "timestamp": 523435132468,
  }],
}
```

## Targets
[Partner configuration code](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md) can configure targets to appear within the Targets/Analytics tab. Target documents are:

* one per analytics reporting period
* updated when the user loads the application or when they view the targets tab 
* updated a maximum of once per day

```json
{
  "_id": "target-2000-01-user-contact-guid",
  "type": "target",
  "user": "user-contact-guid",
  "updated_date": 523435132468,
  "targets": [
    {
      "id": "deaths-this-month",
      // ... (target configuration from partner code)
      "value": {
        "pass": 0,
        "total": 15
      }
    },
    // ... (many targets)
  ]
}

```
