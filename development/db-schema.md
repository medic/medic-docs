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
 - In earlier versions the type depended on hierarchical location of the contact. There are 3 hard coded place types: `district_hospital`, `health_centre` and `clinic` and one person type `people`. These place names are often meaningless (hence the configurable contact hierarchy in later versions) to the configured project, and are textually (ie in the UI not in data structures) renamed to mean other things. For example, as `clinic` is the lowest level it is often used to represent a family.

### Places

Represent either an actual physical location such as a clinic, or a grouping such as a family or region.

Unless a place is at the top of the hierarchy it has a `parent` place.

Each location has a primary contact, which is a `person` contactable stored in the `contact` property.

### People

People are both patients in the system and users of the system, such as CHWs or Nurses. Users have additional records marking them as users of the system (see [User](#users) below).

People always have a `parent` place.

### Parent hierachy representation

Contactables **store** their parent hierarchy as a "de-hydrated" hierarchical structure, which records the `_id` of each parent up until the top of the hierarchy:

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
 - Have the report author's phone number (if it existsz) stored in the `from` field
 - Store the form's identifier in the `form` field
 - May have a `contact` property, which is a dehydrated version of the report author's contact and its hierarchy (see above)

Reports also have some kind of patient identifier, which describes which `person` this report is _about_. This value can be in a few different places:
 - The patient's shortcode may be found at `doc.patient_id` or `doc.fields.patient_id`
 - A patient record's `_id` may be found at `doc.patient_uuid` or `doc.fields.patient_uuid`, as well as potientially in the same locations as the shortcode.

Additionally, SMS reports:
 - have an `sms_message` property which contains, among other things, the raw SMS
 - May not have a `contact` property if the SMS comes from a phone number that does not have an associated contact

Additionally, XML reports:
 - Has the XML file that Enketo (the XForm renderer used) generates as an attachment
 - Have a `content_type` property of `xml`.

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

The `_users` database additionally:
 - The `type` of `user`
 - The password hash and associated data
 - and is a location that only administrative users can write to, and so is authoritive when it comes to roles and the like.
 - It is also what CouchDB usess for authentication

The `medic` database stores a copy of roles and permissions along with:
 - The `type` of `user-settings`
 - They may have a `contact_id` field that is the `_id` of the _person_ that the user is attached to
 - They may also have a `facility_id` field that is the `_id` of the _place_ that the user is attached to

Note that SMS users do not have a users record: their phone number will be attached to a `person` record, but they do not have a user because they do not access the application.

Users then, can be represented by up to 3 docs:
 - a `person` document that represents a physical human being in our hierarchy of places and people
 - a `users` document that represents authorisation and authentication information for physical people or authenticated external services
 - a `user-settings` document that ties the `user` and `person` documents together
