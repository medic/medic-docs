**_NOTE: This doc is meant to be the starting place for anyone configuring Medic Mobile. It is intentionally one large document while we reorganize and replace existing documentation, and will eventually become the README.md for this directory. The ToC is generated automatically, but not perfectly. This will be resolved before publishing more widely._**

Configuring Medic Mobile
------------------------------
<!-- TOC depthFrom:1 depthTo:3 -->

- [Introduction](#introduction)
    - [What is Medic Mobile <!-- TODO: Jill to fill in with conceptual info about app, not specific to a technical audience -->](#what-is-medic-mobile----todo-jill-to-fill-in-with-conceptual-info-about-app-not-specific-to-a-technical-audience---)
        - [Review of app structure and workflows](#review-of-app-structure-and-workflows)
        - [Overview of various pages + core functions](#overview-of-various-pages--core-functions)
    - [What’s configurable <!-- TODO: Jill to fill in with list of screenshots, with notes on what is configurable in each  -->](#whats-configurable----todo-jill-to-fill-in-with-list-of-screenshots-with-notes-on-what-is-configurable-in-each----)
- [Prerequisites](#prerequisites)
    - [Test Instance](#test-instance)
    - [Background skills](#background-skills)
        - [CouchDB](#couchdb)
        - [Javascript](#javascript)
        - [JSON](#json)
        - [XLSForms and XForms](#xlsforms-and-xforms)
        - [SQL](#sql)
- [Configure](#configure)
    - [Localization](#localization)
    - [Icons <!-- TODO: Derick -->](#icons----todo-derick---)
    - [SMS Forms](#sms-forms)
    - [App Forms <!-- TODO: review content and add subsections -->](#app-forms----todo-review-content-and-add-subsections---)
        - [Structure](#structure)
        - [Showing a form <!-- TODO: info about context field in properties -->](#showing-a-form----todo-info-about-context-field-in-properties---)
        - [Uploading forms <!-- TODO -->](#uploading-forms----todo---)
        - [Other Medic specific XForm conventions](#other-medic-specific-xform-conventions)
        - [Tips & Tricks <!-- TODO -->](#tips--tricks----todo---)
        - [Troubleshooting <!-- TODO -->](#troubleshooting----todo---)
    - [Collect Forms](#collect-forms)
    - [Profiles](#profiles)
        - [Overview](#overview)
        - [Info card](#info-card)
        - [Condition cards](#condition-cards)
        - [History](#history)
        - [Tasks](#tasks)
        - [Actions](#actions)
    - [Tasks <!-- TODO: Already rewritten, needs review and updated screenshots -->](#tasks----todo-already-rewritten-needs-review-and-updated-screenshots---)
        - [Templates: `tasks.json`](#templates-tasksjson)
        - [Logic: `rules.nools.js`](#logic-rulesnoolsjs)
        - [Uploading <!-- TODO -->](#uploading----todo---)
        - [Examples](#examples)
        - [Tips & Tricks](#tips--tricks)
        - [Troubleshooting](#troubleshooting)
    - [Targets <!-- TODO: Already rewritten, needs review and updated screenshots -->](#targets----todo-already-rewritten-needs-review-and-updated-screenshots---)
        - [Templates: `targets.json`](#templates-targetsjson)
        - [Logic: `rules.nools.js`](#logic-rulesnoolsjs-1)
        - [Uploading <!-- TODO -->](#uploading----todo----1)
        - [Examples](#examples-1)
        - [Tips & Tricks](#tips--tricks-1)
        - [Troubleshooting](#troubleshooting-1)
- [Set-up](#set-up)
    - [Contacts](#contacts)
        - [Create [via UI, needs training module]](#create-via-ui-needs-training-module)
        - [Edit [via UI, needs training module]](#edit-via-ui-needs-training-module)
        - [Bulk create](#bulk-create)
    - [Users](#users)
        - [Overview](#overview-1)
        - [Create [via UI, needs training module] <!-- TODO: Jill -->](#create-via-ui-needs-training-module----todo-jill---)
        - [Bulk Creation (conf#61)](#bulk-creation-conf61)
        - [Permissions <!-- TODO: Derick -->](#permissions----todo-derick---)
    - [User types](#user-types)
    - [Available permissions](#available-permissions)
    - [Data Migration](#data-migration)
- [Deploy + Maintain](#deploy--maintain)
    - [Versioning](#versioning)
    - [Upgrades](#upgrades)
    - [Release notes](#release-notes)
    - [Deploying](#deploying)
    - [Local](#local)
    - [Development Setup](#development-setup)
    - [Contributing code](#contributing-code)
    - [Export](#export)

<!-- /TOC -->
# Introduction 
## What is Medic Mobile <!-- TODO: Jill to fill in with conceptual info about app, not specific to a technical audience -->
### Review of app structure and workflows
Medic Mobile was designed and built for health workers delivering care in hard-to-reach areas. The toolkit supports any language and works with or without internet connectivity. Our tools run on basic phones, smartphones, tablets, and computers, supporting people working in communities, health facilities, and management offices. We are committed to developing open-source software, sharing learnings, and lowering barriers to adoption, scale, and reach for these tools.

Our mobile app was designed for a new wave of health workers and integrated health systems. It supports multiple user types, including nurses or skilled birth attendants in communities or facilities, community health workers, managers on supervisory visits, and other people who deliver care and support.

The app provides an automated and prioritized list of upcoming tasks, covering all of a health worker's activities in their community. Health workers are guided through tasks — such as screening for high-risk pregnancies or diagnosing and providing treatments for children — and get real-time indicators for progress towards their goals. Medic Mobile for Android is an offline web app with an Android container, delivering the benefits of the web and a native app. Data from every mobile user is replicated to the database and analytics tools, providing access to facility staff and managers. 

### Overview of various pages + core functions
#### Tasks tab
The Tasks tab shows a list of tasks with a due date. Tasks guide health workers through their days and weeks. Each auto-generated task prompts a preconfigured workflow, ensuring that the right actions are taken for the people at the right time.

#### People tab
Health workers easily access and manage the families and people they serve from the People tab. Profiles display important information, status and conditions, upcoming tasks, and history.

##### Hierarchy levels
Currently, there are three hierarchy levels allowed in the app - generally, they are District (the ‘highest’ one), Health Center, and CHW Area. A user logging into the app will see People, Tasks, Reports, and Analytics based on the hierarchy level that they are assigned. This allows appropriate data sharing based on the role of the user in the health system. For example, if you are a District-level user, you might see all of the Health Centers within your district, and the data and profiles for all health workers as well as patients in the CHW Areas within those Health Centers. If you are a nurse at a specific Health Center, you might see all of the CHW Areas that you manage for your Health Center and all of the patients and data in those Areas. And if you are a community health worker, you might see only the patients you manage and the data that you’ve submitted about those patients. Depending on the app configuration for a particular health system or program, each of those hierarchy levels might be titled differently. 

##### People profile
On the People tab, you will find Places as well as People. For example, if you are a Health Center level user, you can click on a CHW Area (a Place) and see the Profile of that Place. You can also click on any person - whether a health worker or a patient - and see the Profile of that Person.

The People profile contains important information about that person in the health system.
At the top is an info card that typically contains their name, age, and phone number as well as any other general information about them, such as their gender and notes. 

Below the info card, you might find a series of cards that detail their present and past health conditions. These are called condition cards, and they display information about those health conditions. For example, if a patient is currently pregnant, you might see a Pregnancy card that details the expected date of delivery, number of antenatal care visits completed, and the status of the pregnancy (normal versus high-risk). 

Below condition cards is a table of Tasks that are upcoming and open for that patient. Any of these tasks can be launched and completed from this screen.

Finally, at the very bottom, is a table of submitted reports about this Patient. These reports are generally forms that have been submitted by any health worker in the system who has access to this patient’s Profile.

##### Place profiles
The Place profile contains important information about that place in the health system.

At the top is an info card that typically contains the name of the place as well as any general information about that place such as the location.

You can display condition cards on Place profile as a way of summarizing any reports that have been submitted about a particular Place. For example, if Households occupy one level in your app hierarchy and you have a Household-level survey that is submitted against that Place, you can summarize information from that survey into a condition card to display at-a-glance household-level information.

Below the condition cards, you will find a table of People or Places that are “below” this Place in the app hierarchy. For example, if you are viewing the CHW Area profile, you will see a table of the health workers and patients that belong to this CHW Area.
 
Beneath the table of sub-people or sub-places, you will find a table of Tasks that are upcoming and open for that Place. Again, if there are forms that are required for a particular Place in the health system, Tasks can be configured to display when these forms are due, and any of these tasks can be launched and completed from this screen.

Finally, at the very bottom, is a table of submitted reports about this Place. These reports are generally forms that have been submitted by any health worker in the system who has access to this Place.

#### Targets tab
The Targets tab makes use of widgets that visualize essential data for the end user. For community health workers (CHWs), the Targets tab provides a quick summary of their progress. For CHW supervisors, nurses, and other facility-based users, it displays important insights into how health systems are performing.

There are two types of widgets: count and percentage. The count widget tallies information such as the number of active pregnancies or facility-based deliveries this month. The percentage widgets displays a proportion of success, such as pregnancies with one or more ANC visits or the percentage of on-time follow-ups. Both types of widgets can include goals.

#### History/Reports tab
##### Define Forms and where they live
All data submitted in the application is configured as a Form and can be submitted from many parts of the app including from Tasks, from Person or Place profiles, or from the Reports/History tab. The Reports/History tab is also where all of these forms are collected in one Place. Based on your role in the health system and the hierarchy level assigned to your user, you might see only the reports submitted by you (for example, if you are a community health worker) or everyone you manage (for example, if you are a community health worker supervisor). This page also contains filter for easily finding a specific report or set of reports that you might be searching for.

#### Definitions
## What’s configurable <!-- TODO: Jill to fill in with list of screenshots, with notes on what is configurable in each  -->
------------------------------------
# Prerequisites

## Test Instance
In order to configure Medic Mobile you will need an instance set up for testing. You can set up a local instance using our _Horticulturalist_ tool by [following these instructions](https://github.com/medic/medic-webapp/tree/master/#deploy-locally-using-horticulturalist-beta).

## Background skills
There are many aspects that can be configured in a Medic Mobile, and these require a variety of technical skills.

### CouchDB
A free and open source NoSQL database we use to store all our data, configuration, and even the application code. CouchDB is really good at replication which is the process of sending the data to another database, such as PouchDB in the client application, and back again.

Although configuration does not require knowledge or experience with CouchDB it would be useful to be familiar with general concept of it as a document store.

### Javascript
Many key aspects of Medic Mobile are configured with JavaScript code and expressions. This includes managing profile pages, creating tasks and targets, and even setting the condition for when to show forms. A good understanding of JavaScript is required for all but the simplest of modifications to configuration.

### JSON
JSON (JavaScript Object Notation) is a format for storing structured text. A good understanding of the JSON is key to configuring Medic Mobile. You can find more information on JSON [here](https://www.json.org/).

### XLSForms and XForms
Many workflows in Medic Mobile, including completing tasks and creating contacts, are generated using [ODK XForms](https://opendatakit.github.io/xforms-spec/). Many configurers use XLSForms as an easier way to generate XForms. A strong knowledge of [XLSForm standard](http://xlsform.org/) is therefore very useful in customizing a Medic Mobile application.

### SQL
Although the Medic Mobile application uses a NoSQL database, a parallel PostgreSQL database can be set up to make querying data. Familiarity with SQL is needed to set up and query the database.


------------------------------------
# Configure
The Medic Mobile application is designed to have a common core that can be configured for all deployments, regardless of the size or type of workflow. Some CHWs log into Medic Mobile on their Android devices to use it offline, whereas others interact with Medic Mobile using SMS on their basic phones. In both cases, the core application is the same. App and SMS workflows are defined in configuration, as are Profiles, Tasks, and Targets. This configuration defines user interactions, whether they are working in the community on their mobile device, or sitting at their computer at a health facility.

It is possible to configure parts of Medic Mobile in the app itself from the Configuration tab. The UI is intuitive to use, but does not track changes. We recommend using the Medic Mobile Configurer tool called `medic-conf`, and tracking files using a revision control system such as Git. Throughout this documentation we will refer to configuration techniques using `medic-conf` wherever possible.

To start using Configurer follow the installation instructions [here](https://github.com/medic/medic-conf/blob/master/README.md). To properly use Configurer you will need configuration files in set locations within a folder. If you are starting with a blank configuration you can initialize the file layout using the `initialise-project-layout` action:

    medic-conf initialise-project-layout

Once you are set up with the basic files structure, you will be able to make the necessary edits to configuration files. You can then use Configurer to compile or convert components as needed, and upload the configuration to your Medic Mobile instance. The configuration is saved in Medic Mobile's application CouchDB database. Much of the configuration is saved as a single doc of key value pairs, which is represented as the `app_settings.json` file. Other aspects, such as icons and forms are uploaded as separate database docs.

## Localization
Medic Mobile is used in many countries around the world and was designed with localization in mind. The app itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian. Please contact the Medic Mobile team (hello@medicmobile.org) if you are interested in translating the app into a different language, as we can work together to make that language available to all partners.

It is easy to view and add additional languages via the `Configuration > Languages` page. You'll also see there the default language for the application, and a separate default language for outgoing messages that are sent via SMS. These language settings map the following fields in `app_settings.json`:

```json
  "locales": [
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "es",
      "name": "Español (Spanish)"
    },
    {
      "code": "fr",
      "name": "Français (French)"
    },
    {
      "code": "ne",
      "name": "नेपाली (Nepali)"
    },
    {
      "code": "sw",
      "name": "Kiswahili (Swahili)"
    },
    {
      "code": "hi",
      "name": "हिन्दी (Hindi)"
    },
    {
      "code": "id",
      "name": "Bahasa Indonesia (Indonesian)"
    }
  ],
  "locale": "en",
  "locale_outgoing": "en",
```

All configurable parts of the app can be localized as well. This is done either with translation keys, or within the XLSForm that generates the forms used in the app. In all cases, the app automatically uses the proper language for each user. This may be the user's language, as specific on their profile, or the default language.

We will cover translation keys in this section since it is relevant to many configuration aspects. Using translation keys consists of two parts: specifying which key to use, and translating that key for the app.

The key to use is usually specified in JSON, as such:

    "translation_key": "targets.assessments.title"

This means that the element that we configured should use the label associated with the `targets.assessments.title` key. We then provide the text for that key in translations files. Each language has it's own `.properties` file in the `translations` folder. For instance, for English, we would have a `messages-en.properties` file as such:

```
[Application Text]
targets.assessments.title=Assessments Completed
```

All the properties files use the format `messages-{language-code}.properties`, where the language code is the same 2 letter code used to identify the language in the application. If a translation is missing for the user's language it will use that of the default language.

## Icons <!-- TODO: Derick -->

## SMS Workflow
#### app_settings.json

###### 1.  Schedules

Schedules are created to send automated SMS's at a particular time to particular recipient as a form of reminder or notification.
The fields are seen:

| Key | Description |
| ------ | ------ |
| name | This is the name of the schedule |
|summary|Contains a summary of what the schedule is all about|
|description|Contains a small description of what the schedule is about|
|start_from|This is time from which the messages offset is added to to determine the time in which the schedule message is to be sent|
|messages|This contains a list of all messages that are to be sent and the time they'll be sent. The time they'll be sent is basically `start_from ` + ` offset` The message elements are discussed in detail in the following table.|

Message elements

|key|Description|
| ------ | ------ |
|group|Unique integer that identify each schedule group |
|offset|amount of time from the specified `start_from` in which the schedule is supposed to be sent|
|send_day|This is day of the week in words which the schedule is to be sent e.g. `monday`|
|send_time|The specific time of the day in 24 hours date format in which the schedule should be sent e.g. `10:00`|
|recipient|The recipient who will receive the schedule message|

The `offset` above can be any of the following:
- x minutes
- x weeks
- x days

An example of message schedule is as illustrated below:
```
{
      "name": "Schedule Demo",
      "summary": "",
      "description": "Demo for how schedules work",
      "start_from": "reported_date",
      "messages": [
        {
          "message": [
            {
              "content": "Thank you for submitting pregnancy report. . You will get reminders to follow-up",
              "locale": "en"
            }
          ],
          "group": 1,
          "offset": "15 minutes",
          "send_day": "",
          "send_time": "",
          "recipient": "reporting_unit"
        },
        {
          "message": [
            {
              "content": "Please follow-up with {{contact.name}} for details at {{contact.phone}}.",
              "locale": "en"
            }
          ],
          "group": 1,
          "offset": "5 weeks",
          "send_day": "monday",
          "send_time": "09:00",
          "recipient": "phone_contact_for_other_community_actor_for_counseling"
        }
      ]
    }
```

The above schedule group would send a schedule exactly 15 minutes and 5 weeks from the time the report that triggers it is sent to the webapp.
# registrations
Configuration is held at `app_settings.registrations`, as a list of objects connecting forms to validations, events and messages. Its structure is described in kanso.json.
Forms that don't have a patient_id field because it is generated afterwards, e.g ANCR, IMMR, go to this `registrations` section of the app_settings.json 
The items under registration are are follows:
##### Events

Lists different events.

##### `on_create`

This is the only supported event.

#### Triggers

##### `add_patient`

Generates a patient id--or if configured to uses a provided one--, sets it onto the root of the registration document, as well as creating (if required) a person document for that patient.

###### External Patient ID

If you are providing the patient id instead of having Sentinel generate you one, name the field in a `patient_id_field` key in `"params"`:

```json
{
    "name": "on_create",
    "trigger": "add_patient",
    "params": "{\"patient_id_field\": \"external_id\"}",
    "bool_expr": ""
}
```

In this example the provided id would be in `fields.external_id` on the registration document.

**NB:** this field must not be called `patient_id`.
**NB:** the JSON passed in `"params"`` should still be a string. Support for raw JSON as shown below exists, but is in beta and may not always work correctly in all situations, because kanso.json does not support it:
```json
{
    "params": {"patient_id_field": "external_id"},
}
```


###### Alternative Name Location

To provide an alternative location for the patient name, either provide a `patient_name_field` in `"params"` or provide it directly into the `"params"` field as a String:

```json
{
    "params": "{\"patient_name_field\": \"full_name\"}",
}
```
```json
{
    "params": "full_name",
}
```

The first format is required if you wish to also provide an exteral patient id:

```json
{
    "params": "{
        \"patient_name_field\": \"full_name\",
        \"patient_id_field\": \"external_id\"
    }",
}
```

##### `add_patient_id`

**Deprecated in favour of `add_patient`.** Previously this only added a `patient_id` to the root of the registration form. This functionality has been merged into `add_patient`. Now, using this event will result in the same functionality as described in `add_patient` above.

##### `add_expected_date`
##### `add_birth_date`
##### `assign_schedule`
##### `clear_schedule`


### Generate Patient ID On People

No custom configuration for `generate_patient_id_on_people`.

## SMS Forms
Users of the medic platform can send in data over SMS using SMS forms. A form sent to the medic platform over SMS typically follows this pattern `<form code> <field value>` e.g. `V 12345`. The form must be configured in app_settings and instructions can be found [here](https://github.com/medic/medic-docs/blob/master/configuration/forms.md#json-forms).

For SMS forms to work, a gateway device must be configured so that users can send the forms to the gateway number. Instructions on how to setup a gateway device can be found [here](https://github.com/medic/medic-docs/blob/master/configuration/gateway-config.md).

## App Forms <!-- TODO: review content and add subsections -->
Whether using Medic Mobile in the browser or via the Android app, all Actions, Tasks, Contact creation/edit forms are created using [ODK XForms](https://opendatakit.github.io/xforms-spec/) -- a XML definition of the structure and format for a set of questions. Since writing raw XML can be tedious, we suggest creating the forms using the [XLSForm standard](http://xlsform.org/), and using the [medic-conf](https://github.com/medic/medic-conf) command line configurer tool to convert them to XForm format. The instructions below assume knowledge of XLSForm.

- A XLSForm form definition, converted to the XForm (optional) 
- A XML form definition using the ODK XForm format
- Meta information in the `{form_name}.properties.json` file (optional)
- Media files in the `{form_name}-media` directory (optional)

### Structure
A typical form starts with an `inputs` group which contains prepopulated fields that may be needed during the completion of the form (eg patient's name, prior information), and ends with a summary group (eg `group_summary`, or `group_review`) where important information is shown to the user before they submit the form. In between these two is the form flow, usually a collection of questions grouped into pages. All data fields submitted with a form are stored, but often important information that will need to be accessed from the form is brought to the top level. Since all forms in Medic Mobile are submitted about a person or place you must make sure at least one of `place_id`, `patient_id`, and `patient_uuid` are stored at the top level.

| type | name | label | relevant | appearance | calculate | ... |
|---|---|---|---|---|---|---|
| begin group | inputs | Inputs | ./source = 'user' | field-list |
| hidden | source |
| hidden | source_id |
| begin group | contact |
| db:person | _id | Patient ID |  | db-object |
| string | patient_id | Medic ID |  | hidden |
| string | name | Patient Name |  | hidden |
| end group
| end group
| calculate | _id | | | | ../inputs/contact/_id |
| calculate | patient_id | | | | ../inputs/contact/patient_id |
| calculate | name | | | | ../inputs/contact/name |
| ...
| begin group | group_summary | Summary |  | field-list summary |
| note | r_patient_info | \*\*${patient_name}\*\* ID: ${r_patient_id} |
| note | r_followup | Follow Up \<i class="fa fa-flag"\>\</i\> |
| note | r_followup_note | ${r_followup_instructions} |
| end group |

#### Inputs
Data is passed to forms as fields in the `inputs` group, or via the `contact-summary` instance. Fields in the `inputs` group must be explicitly declared in the XLSForm/XForm so those will be detailed here. The `contact-summary` does not require XLSForm/XForm field declaration, so are documented in the [accessing contact-summary data](#accessing-contact-summary-data) section.

| Tab | Data |
|---|---|
| Reports | No `input` fields are populated for forms opened from the Reports tab. As a result, we use a `db-object` field to have the user select the subject of the form, and then populate the `inputs.contact` field once the form has already been opened. |
| People | The `inputs.contact` field is populated with the contact from which the form is opened. Nested groups are needed in the XLSForm/XForm to access fields nested on the contact, such as the info of their `parent` place. |
| Tasks | Data provided in `actions[n].content` is directly mapped to the `inputs` group. For instance, the `contact` is passed in this way so the task form knows who the form is about. Also, the `source` and `source_id` are used in Analytics to relate a task to the action that triggered it. |

#### Outputs
All forms in Medic Mobile are submitted about a person or place. In order for a submitted report to be handled properly by Medic Mobile it must have at least one of the following identifiers at the top level of the data model: `place_id`, `patient_id`, `patient_uuid`. Additional fields can be at the top level, or nested in groups. The inputs are not saved with form, so any input fields that need to be saved in the report should be included outside of that group too, with a calculate refering back to the input field.

#### Summary page
It is a good practice for all forms to show users a summary of their actions along with followup information before they submit their report. This is often used to review that the information was submitted for the right patient, that the symptoms were properly entered, along with the diagnosis and next steps for the user.

A convention we have used for the summary page is to have it in a `group` called  `group_summary`. This group would have `field-list summary` as the `appearance`,  and several sections within it, such as Patient Details, Symptoms, Diagnosis, and Follow-Up. Each section has a header `note` that is styled with custom `appearance` values such as `h1 yellow`. These headers are followed by details for that section as `note` fields, which are shown when `relevant` based on data in the form.

### Showing a form <!-- TODO: info about context field in properties -->
#### On History/Reports
#### On Profiles (see Profile section for how to show)
### Uploading forms <!-- TODO -->
#### CLI
#### UI
### Other Medic specific XForm conventions
#### Dropdown with people/places
A Medic Mobile specific XForm widget was introduced to be able to select a person or place from the database. This widget looks like a dropdown, which is familiar to users, and when a person is selected will set the doc's `_id` to the field in question.

The items shown in the list can be constrained to show only people, or a specific type of place. To use it you must specify the appearance to be `db-object`, and then contrain the selection with one of the following XLSForm types:

| XLSForm Type | Behavior |
|----|----|
| `db:person` | List of all people that the user can see in the data |
| `db:clinic` | List of all places with `"type": "clinic"`. This corresponds to the lowest facility in the hierarchy. |
| `db:health_center` | List of all places with `"type": "health_center"`. This corresponds to the middle facility in the hierarchy. |
| `db:district_hospital` | List of all places with `"type": "district_hospital"`. This corresponds to the highest facility in the hierarchy. |
| `string` | A list of all docs, not constrained by type. Support for this may change, so use with caution. <!-- Verify status of this previously undocumented feature --> |

This type of widget is often used to obtain and use data about a particular contact in the form itself. **The default behavior of the widget is therefore to assign the value of any of the selected doc's fields to matching fields in the XForm.** For instance, if a field `name` exists in the XForm at the same level as the `db-object` field, it will be updated with the value of the selected contact's `name` field. To override this default binding behaviour, and only get the `_id` value assigned to the `db-object` field, you must also specify `bind-id-only` in the appearance.

#### Hiding fields/groups in Reports view
By default all fields saved with a report are shown when viewing a submitted report in the Reports tab. To hide any individual field or group you must set its `tag` attribute as `hidden` in the data model. 

For instance, in the following form the `inputs` group is completely hidden, as is the `patient_uuid` field:
```xml
        <delivery delimiter="#" id="delivery" prefix="J1!delivery!" version="2018-03-06_06-54">
          <inputs tag="hidden">
            <source>user</source>
            <source_id/>
            <contact>
              <_id/>
              <patient_id/>
              [...]
            </contact>
          </inputs>
          <patient_uuid tag="hidden"/>
          <patient_id/>
          <patient_name/>
          [...]
        </delivery>
```

This is can easily be done via XLSForm by adding a `attributes::tag` column, and then set the value `hidden` for the row of the fields that are to be hidden. The XLSForm snippet below corresponds to the XForm above, hiding the `inputs` group and the `patient_uuid` field.

| type | name | ... | attributes::tag | 
|---|---|---|---|
| begin group | inputs | | hidden |
| hidden | source |
| hidden | source_id |
| begin group | contact |
| db:person | _id |
| string | patient_id |
| ... |
| end group |
| end group |
| calculate | patient_uuid | | hidden |
| calculate | patient_id |
| calculate | patient_name |

_Note that hiding the `inputs` group is used as an example here but generally unnecessary since that group in particular is not saved as fields in the report's database doc._

#### Creating additional docs
In version 2.13.0 and higher, you can configure your app forms to generate additional docs upon submission. You can create one or more docs using variations on the configuration described below. One case where this can be used is to register a newborn from a delivery report, as shown below. First, here is an overview of what you can do and how the configuration should look in XML:

##### Extra docs
- Extra docs can be added by defining structures in the model with the attribute db-doc="true". **Note that you must have lower-case `true` in your XLSform, even though Excel will default to `TRUE`.**

###### Example Form Model

```
<data>
  <root_prop_1>val A</root_prop_1>
  <other_doc db-doc="true">
    <type>whatever</type>
    <other_prop>val B</other_prop>
  </other_doc>
</data>
```

###### Resulting docs

Report (as before):

```
{
  _id: '...',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    root_prop_1: 'val A',
  }
}
```

Other doc:
```
{
  _id: '...',
  _rev: '...',
  type: 'whatever',
  other_prop: 'val B',
}
```

##### Linked docs

- Linked docs can be referred to using the doc-ref attribute, with an xpath. This can be done at any point in the model, e.g.:

###### Example Form Model
```
<sickness>
  <sufferer db-doc-ref="/sickness/new">
  <new db-doc="true">
    <type>person</type>
    <name>Gómez</name>
    <original_report db-doc-ref="/sickness"/>
  </new>
</sickness>
```

###### Resulting docs

Report:
```
{
  _id: 'abc-123',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    sufferer: 'def-456',
  }
}
```

Other doc:
```
{
  _id: 'def-456',
  _rev: '...',
  type: 'person',
  name: 'Gómez',
  original_report: 'abc-123',
}
```

##### Repeated docs

- Can have references to other docs, including the parent
- These currently cannot be linked from other docs, as no provision is made for indexing these docs

###### Example Form
```
<thing>
  <name>Ab</name>
  <related db-doc="true">
    <type>relative</type>
    <name>Bo</name>
    <parent db-doc-ref="/thing"/>
  </related>
  <related db-doc="true">
    <type>relative</type>
    <name>Ca</name>
    <parent db-doc-ref="/thing"/>
  </related>
</artist>
```

###### Resulting docs

Report:
```
{
  _id: 'abc-123',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    name: 'Ab',
  }
}
```

Other docs:
```
{
  _id: '...',
  _rev: '...',
  type: 'relative',
  name: 'Bo',
  parent: 'abc-123',
}
{
  _id: '...',
  _rev: '...',
  type: 'relative',
  name: 'Ch',
  parent: 'abc-123',
}
```

##### Linked docs example
This example shows how you would register a single newborn from a delivery report.

First, the relevant section of the delivery report XLSForm file:
![Delivery report](img/linked_docs_xlsform.png)

Here is the corresponding portion of XML generated after converting the form:
```
<repeat>
  <child_repeat db-doc="true" jr:template="">
    <child_name/>
    <child_gender/>
    <child_doc db-doc-ref=" /delivery/repeat/child_repeat "/>
    <created_by_doc db-doc-ref="/delivery"/>
    <name/>
    <sex/>
    <date_of_birth/>
    <parent>
      <_id/>
      <parent>
        <_id/>
        <parent>
          <_id/>
        </parent>
      </parent>
    </parent>
    <type>person</type>
  </child_repeat>
</repeat>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is the `child_doc` field with an `_id` that corresponds to the linked doc. In this case, you could look for that `_id` on the People tab or in the DB itself to confirm that the resulting doc looks correct.

##### Repeated docs example
This example extends the above example to show how you would register one or multiple newborns from a delivery report. This allows you to handle multiple births.

First, the relevant section of the delivery report XLSForm file:
![Delivery report](img/repeated_docs_xlsform.png)

Here is the corresponding portion of XML generated after converting the form:
```
<child_doc db-doc-ref=" /postnatal_care/child "/>
<child db-doc="true">
  <created_by_doc db-doc-ref="/postnatal_care"/>
  <name/>
  <sex/>
  <date_of_birth/>
  <parent>
    <_id/>
    <parent>
      <_id/>
      <parent>
        <_id/>
      </parent>
    </parent>
  </parent>
  <type>person</type>
</child>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is the `child_doc` field with an `_id` that corresponds to the first doc that was created. The other docs will have a link to the report that created them but the report will not link directly to them. Again, you could look for that `_id` on the People tab or in the DB itself to confirm that the resulting docs look correct.

#### Accessing contact-summary data
xforms have the ability to access the output of the [configured contact-summary script](https://github.com/medic/medic-docs/blob/master/configuration/contact-summary.md). This means you can have different fields, state, or information based on any known information about the contact.

To configure this, add a new instance with the id "contact-summary" to your xform somewhere below your primary instance, then bind values where you need them. Note that medic-configurer automatically adds this instance to every form so you shouldn't need to do this manually. Example:

```xml
<h:html>
  <h:head>
    <model>
      <instance>
        <visit>
          <age/>
        </visit>
      </instance>
      <instance id="contact-summary"/>
      <bind calculate="instance('contact-summary')/context/age" nodeset="/visit/age" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/visit/age" />
  </h:body>
</h:html>
```

As long as you have this new instance, you can then use XPath to access all values returned in `result.context`. This works without declaring in the instance which fields are needed, so it is a very flexible solution and easier to manage when building forms.

For example, a form field with `instance('contact-summary')/context/lineage[2]/name` as a calculation will get `lineage[2].name` from a contact-summary with the following code included in `contact-summary.js`:

```
...
context.lineage = lineage;
var result = {
  fields: fields,
  cards: cards,
  context: context
};
return result;
```

Note that you can pass a large object to the form, which can then read any value, but doing so does noticeably slow the loading of the form. Because of this it is preferable to remove from the context any fields that are not being used. It is a good idea to future proof by maintaining the same structure so that fields can be added without needing to modify existing form calculations.
### Tips & Tricks <!-- TODO -->
### Troubleshooting <!-- TODO -->
## Collect Forms
## Profiles
### Overview
### Info card
### Condition cards
### History
### Tasks
### Actions
#### Context
#### Passing data 
## Tasks <!-- TODO: Already rewritten, needs review and updated screenshots -->
_Tasks guide health workers through their days and weeks. Each generated task prompts a preconfigured workflow, ensuring that the right actions are taken for the people at the right time._

_Tasks can be configured for any user of type "restricted to their place". When configuring tasks, you have access to all the contacts (people and places) that the logged in user can view, along with all the reports about them. Tasks can also pull in fields from the reports that trigger them and pass these fields in as inputs to the form that opens when you click on the task. For example, if you register a pregnancy and include the LMP, this generates follow-up tasks for ANC visits. When you click on an ANC visit task, it will open the ANC visit form and this form could "know" the LMP of the woman. In this section we will discuss how to configure such tasks._

A rules engine is used to generate the tasks using the data available in the client app. The data, comprised of docs for people, places, and the reports about them, are processed by rules engine code to emit tasks like this one:

![Task description](img/task_with_description.png)

The rules engine code is completely configurable in `rules.nools.js`, and is used to generate Targets and Tasks. It iterates through an object with all contacts accompanied by their reports. When the code identifies a condition that needs tasks, it generates a series of tasks based on templates in `tasks.json`. The tasks emitted by the rules engine code are then handled by the app. The app automatically shows the tasks in the Tasks tab and on contact's profiles, and removes them when they are completed.

### Templates: `tasks.json`
To separate the task structure from the logic, we have a template for each task in `tasks.json`. This file is structured as an array of task schedule objects, each with an `event` field containing one or more task templates. For each event we define the relative due date, task window, icon and title.

```json
[
  {
    "name": "task-schedule-name",
    "events": [
      {
        "id": "task-id",
        "days": 7,
        "start": 0,
        "end": 6,
        "icon": "pregnancy-1",
        "title": [
          {
            "content": "Title",
            "locale": "en"
          }
        ],
        "description": [
          {
            "content": "High risk message",
            "locale": "en"
          }
        ]
      }
    ]
  }
]
```

The individual fields are described in this table:

| field | description |
|----|----|
| `name`| This is the name of the task schedule. It's used when retrieving a particular task schedule from `tasks.json` for use in `rules.nools.js`.|
| `events`| These are the individual tasks in the schedule. You may have one or more tasks in your schedule. For each event, you need to include the following |
| `events[n].id` | This is an `id` you define for each of your tasks.|
| `events[n].days` | Due date for the task. It is the number of days after the schedule start date that a task is due.|
| `events[n].start` | The number of days before the task due date that the task should appear in the task list.|
| `events[n].end` | The number of days after the task due date that the task should continue to appear in the task list.|
| `events[n].icon` | You can use any icon that you like, but make sure the icon has been uploaded to your instance and the name matches.|
| `events[n].title` | The name of your task that will appear to the user. This field supports locales, so you can include translations if you have users viewing the app in different languages on the same instance.|
| `events[n].description` | This is optional. It is a second line of text that can appear at the right side of the task on the tasks list.|

### Logic: `rules.nools.js`
Tasks templates in `tasks.json` do not show up on their own in the app. The logic for building actual tasks is done in the rules engine code found in `rules.nools.js` -- the code to generate both Tasks and Targets. This code iterates through all contacts and their reports, and then creates tasks as needed using templates in `tasks.json`. These tasks are then emitted to the app, which shows them at the appropriate time in the Tasks tab and on contact's profiles.

The rules engine code receives an object containing the following:
- `contact`: the contact's doc. All contacts have `type` of either `person` or `place`.
- `reports`: an array of all the reports submitted about the contact.

The basic structure of the rules engine code is as follows:

```js
define Contact {
  contact: null,
  reports: null
}

rule GenerateEvents {
  when {
    c: Contact
  }
  then {
    if (c.contact && c.contact.type === 'person') {
      // Check for condition in person's doc
        // Create + emit task based on person's fields

      c.reports.forEach(
        function(report) {
          switch(report.form) {
            case 'form_id':
              // Check for condition in report
                // Create + emit task based on report fields
            // ...
          }
        }
      );
    }
    emit('_complete', { _id: true });
  }
}
```

To generate tasks the rules engine code must emit an object with the following properties:

| property | description | required |
|---|---|---|
|`_id`| Unique identifier for the task. Emitting another task with the same `_id` will overwrite the previous one. Generally `_id` includes the source report's ID and the event's ID in order to be unique. | yes |
| `deleted` | Expression to determine if the source docs for this task are deleted. If they are deleted the task itself can be deleted. | no |
| `doc` | Set to the contact you passed in and includes their contact info and an array of the reports about that contact | no |
| `contact` | Set to the contact you passed in. Has contact information only. | no |
| `icon` | Set to the `icon` specified for the task in `tasks.json`. | no |
| `priority` | Set to `high` priority if there is a description for the task in `tasks.json`. High priority means that the task displays a high risk icon. | no |
| `priorityLabel` | Set to the `description` listed in `tasks.json` for the task if there is a description. Use a translation key for internationalisation support. | yes |
| `date` | This is the due date of the task. It is left null during task creation and set later. | yes |
| `title` | Set to the `title` that you indicated in your `tasks.json` file. The title is the text that appears in the UI on the task. Use a translation key for internationalisation support. | yes |
| `fields` | Fields are pieces of data that display on the task summary screen. List a label and value for each field you want to display on the summary screen. | no |
| `resolved` | This tracks whether or not the task has been completed. It is set to false initially and then updated to a condition later. | yes |
| `actions` | This is an array of the actions (forms) that a user can access after clicking on a task. If you put multiple forms here, then the user will see a task summary screen where they can select which action they would like to complete. Within your array of `actions` there are some additional properties that you can define. | yes |
| `actions[n].type` | Type of action, usually `'report'`. | yes |
| `actions[n].form` | The form that should open when you click on the action. | yes |
| `actions[n].label`|  The label that should appear on the button to start this action on the task summary page ('Click here to begin the follow up' in our example summary screen above). | no |
| `actions[n].content`|  Contains fields that you want to pass into the form that will open when you click on the task or action. | no |

To initialize a task we use a `createTask` function, passing to it the contact the task is about, the specific `event` from the task schedule, and the `report` that triggered the task:
```js
    var createTask = function(contact, event, report) {
      return new Task({
        _id: report._id + '-' + event.id,
        deleted: (contact.contact ? contact.contact.deleted : false) || (report ? report.deleted : false),
        doc: contact,
        contact: contact.contact,
        icon: event.icon,
        priority: event.description ? 'high' : null,
        priorityLabel: event.description ? event.description : '',
        date: null,
        title: event.title,
        resolved: false,
        actions: []
      });
    };

```
The newly initialized task needs to be manipulated a bit more before it is ready to be emitted. Typically, the fields that need to be set after initialization are the actual `date` the task is due, the possible `actions` with data to be passed to forms, and the `resolved` condition. Additionally, based on the specific task, it is possible that the `_id` needs to be modified further to be unique, and that the `priority` and `priorityLabel` need to be calculated dynamically.

In order for a task to show for an appropriate number of days before and after the due date we only emit tasks when the current time is between the start and end days from the due date. To make this easier, we use the `emitTasks` function to only emit the task between the `start` and `end` days for the task, as specified in the task template.

```js
    var emitTask = function(task, scheduleEvent) {
      if (Utils.isTimely(task.date, scheduleEvent)) {
        emit('task', task);
      }
    };
```

Putting these concepts all together, here is an example snippet where a task is created, modified, then emitted for each event in a task schedule.
```js
var schedule = Utils.getSchedule('pregnancy-missing-visit');
if (schedule) {
  for (var k = 0; k < schedule.events.length; k++) {
    var event = schedule.events[k];
    var dueDate = new Date(Utils.addDate(new Date(report.scheduled_tasks[i].due), event.days));
    var task = createTask(contact, event, report);
    // each group needs its own task, otherwise will be combined into one
    task._id += '-' + i;
    task.date = dueDate;
    task.priority = isHighRiskPregnancy ? 'high' : null;
    task.priorityLabel = isHighRiskPregnancy ? ( schedule.description ? schedule.description : 'High Risk' ) : '';
    task.actions.push({
      type: 'report',
      form: 'pregnancy_visit',
      label: 'Follow up',
      content: {
        source: 'task',
        source_id: report._id,
        contact: contact.contact
      }
    });
    // Resolved if there is a newer pregnancy, there has been a delivery, or visit received in window
    task.resolved = report.reported_date < newestPregnancyTimestamp
        || report.reported_date < newestDeliveryTimestamp
        || isFormFromArraySubmittedInWindow(c.reports, antenatalForms, Utils.addDate(dueDate, event.start * -1).getTime(), Utils.addDate(dueDate, event.end + 1).getTime());

    emitTask(task, event);
  }
}
```

#### Utils
Some utility functions are available to your rule configuration and have been included to make common tasks much easier. To use the function call `Utils.<function-name>(<params>)`, for example `Utils.addDate(report.reported_date, 10)`.

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

### Uploading <!-- TODO -->
### Examples
All of the following examples show code that runs for each report of a certain type.

##### ICCM Follow-up
In this example, we are generating a follow-up for either a treatment or a referral, depending on the outcome of the ICCM assessment.

```javascript
case 'assessment':
  var followupType = 'treat'; // will be one of: treat, refer

  if (r.fields) {
    // The follow-up schedule is based on the `reported_date`, so store it for use later
    var reportedDate = new Date(r.reported_date);
    // Set schedule name to the one for treatment follow-up
    var scheduleName = 'assessment-treatment';

    // Check to see if the patient was referred
    if (r.fields.referral_follow_up == 'true') {
      // If they were, change the follow-up type and schedule name accordingly
      followupType = 'refer';
      scheduleName = 'assessment-referral';
    }

    // Get the task schedule that you specified in `tasks.json`
    var schedule = Utils.getSchedule(scheduleName);

    if (schedule) {
      schedule.events.forEach(function(s) {
        // Determine the due date by taking the base date (`reported_date` in this case) and adding the number of days specified
        var dueDate = new Date(Utils.addDate(reportedDate, s.days));
        var visit = createTask(c, s, r);
        // Set the due date of the task
        visit.date = dueDate;
        // This task should be cleared if the `assessment_follow_up` form is submitted within the task window
        visit.resolved = Utils.isFormSubmittedInWindow(c.reports, 'assessment_follow_up', Utils.addDate(dueDate, s.start * -1).getTime(), Utils.addDate(dueDate, s.end).getTime() );
        // We only have one available action this time
        visit.actions.push({
          type: 'report',
          form: 'assessment_follow_up',
          content: {
            source: 'task',
            source_id: r._id,
            contact: c.contact,
            // Include the follow-up type as an input to the `assessment_follow_up` form
            t_follow_up_type: followupType,
          }
        });
        emitTask(visit, s);
      });
    }
  }
  break;
```

##### Pregnancy Visits
In this example, we see how we can use the task summary screen and have two available actions from one task.

```javascript
case 'pregnancy':

  if ( !(r.fields && r.fields.lmp_date ) ) { break; }

  // The schedule will be based on the LMP date, so store it
  var lmp = new Date(r.fields.lmp_date);

  // Set the schedule name
  var scheduleName = 'pregnancy-healthy';
  // If the pregnancy is is high-risk, adjust the schedule name
  if ((pregnancy.fields.risk_factors && pregnancy.fields.risk_factors != '') 
    || (pregnancy.fields.danger_signs && pregnancy.fields.danger_signs != '')
    || parseInt(pregnancy.fields.patient_age_at_lmp, 10) < 18
    || parseInt(pregnancy.fields.patient_age_at_lmp, 10) > 35 ){
      scheduleName = 'pregnancy-high-risk';
  }

  // Get the specified task schedule
  var schedule = Utils.getSchedule(scheduleName);
  if (schedule) {
    schedule.events.forEach(function(s) {
      // Determine the due date by taking the base date (`lmp`) and adding the number of days you specified
      var dueDate = new Date(Utils.addDate(lmp, s.days));
      var visit = createTask(c, s, r);
      // Set the task due date
      visit.date = dueDate;
      // Add fields to be displayed on the task summary screen
      visit.fields.push({
        label: [
          {
            content: 'Patient Age',
            locale: 'en'
          }
        ],
        value: [
          {
            content: age,
          }
        ]
      },
      {
        label: [
          {
            content: 'EDD',
            locale: 'en'
          }
        ],
        value: [
          {
            content: edd_date,
          }
        ]
      });
      // This task should be cleared if there is a newer pregnancy, there has been a delivery, or visit done in the task window
      visit.resolved = r.reported_date < newestPregnancyTimestamp || r.reported_date < newestPostnatalTimestamp || Utils.isFormSubmittedInWindow(c.reports, 'pregnancy_visit', Utils.addDate(dueDate, s.start * -1).getTime(), Utils.addDate(dueDate, s.end).getTime());
      // We are adding two possible actions, Pregnancy Visit and Delivery Report
      visit.actions.push({
        type: 'report',
        form: 'pregnancy_visit',
        label: 'Pregnancy Visit',
        content: {
          source: 'task',
          source_id: r._id,
          contact: c.contact,
          // Include the LMP so that we can use it during the pregnancy visit
          t_lmp_date: lmp.toISOString()
        }
      },
      {
        type: 'report',
        form: 'delivery_report',
        label: 'Delivery Report',
        content: {
          source: 'task',
          source_id: r._id,
          contact: c.contact,
          // Include the LMP so that we can use it during the pregnancy visit
          t_lmp_date: lmp.toISOString()
        }
      });
      emitTask(visit, s);
    });
  }
```

### Tips & Tricks
1. `actions[n].content` is where you can pass form fields from the report that triggered the action to the form that will open when you click on a task. Be sure you include `content.source: 'task'`, `content.source_id: r._id` and `content.contact: c.contact`. The `source` and `source_id` are used in Analytics to relate a task to the action that triggered it.
1. There are some use cases where information collected during an action within a task schedule may mean that the task schedule must change. For example, if you register a child for malnutrition follow-ups, you collect the height and weight during registration and tasks for follow-ups are created based on the registration. At the next visit (first follow-up), you collect the height and weight again and you want to update these so that future tasks reference this new height and weight. You can either clear and regenerate the schedule after each follow-up visit is done, or you can create only one follow-up at a time so that height and weight are always referencing the most recent visit.
1. Given the way that the rules engine works, code that generates tasks must be immutable. Otherwise you will find that tasks are not clearing properly.
1. If you have more than one action, click a prompted task will show a summary screen with fields you have passed along with a button for each possible action.
![Task summary screen](img/task_summary_screen.png)
1. If you have a single action for a task, click the task will bring you straight to the specified form.
![Task form](img/task_form.png)


### Troubleshooting
1. Cannot see tasks: Makes sure your user is an offline user
1. Tasks is not clearing: Make sure the the code that generates the task is immutable.

## Targets <!-- TODO: Already rewritten, needs review and updated screenshots -->
_Health workers can easily view their goals and progress for the month, even while offline._

_Targets refers to our in-app analytics widgets. These widgets can be configured to track metrics for an individual CHW or for an entire health facility, depending on what data the logged in user has access to. Targets can be configured for any user that has offline access (user type is "restricted to their place"). When configuring targets, you have access to all the contacts (people and places) that your logged in user can view, along with all the reports about them._

Like Tasks, a rules engine is used to generate the targets using the data available in the client app. The data, comprised of docs for people, places, and the reports about them, are processed by rules engine code to emit data for widgets like these:

#### Plain count with no goal

![Count no goal](img/target_count_no_goal.png)

#### Count with a goal

![Count with goal](img/target_count_with_goal.png)

#### Percentage with no goal

![Percentage no goal](img/target_percent_no_goal.png)

#### Percentage with a goal

![Percentage with goal](img/target_percent_with_goal.png)

The rules engine code is completely configurable in `rules.nools.js`, and is used to generate Targets and Tasks. It iterates through an object with all contacts accompanied by their reports. When the code identifies a condition related to a target widget in `targets.json`, it creates data for the widget as a _target instance_. The target instances emitted by the rules engine code are handled by the app. The app takes care of showing the target instances in the appropriate widgets of the Targets tab, updating counts and percentages automatically.

### Templates: `targets.json`
To separate the target widgets from the logic, we have a template for each target in `targets.json`. This file is structured as an object of Target properties, where the `items` field is an array of widget templates. For each widget we have a template defining how it looks and who can see it, as seen here:

```JSON
{
  "enabled": true,
  "items": [
    {
      "type": "count",
      "id": "assessments-u1",
      "icon": "infant",
      "goal": 4,
      "context": "user.parent.parent.name == 'Mukono'",
      "translation_key": "targets.assessments.title",
      "subtitle_translation_key": "targets.assessments.subtitle"
    },
    {
      "type": "percent",
      "id": "newborn-visit-48hr",
      "icon": "mother-child",
      "goal": 85,
      "translation_key": "targets.visits.title",
      "subtitle_translation_key": "targets.visits.subtitle",
      "percentage_count_translation_key": "targets.visits.detail"
    }
  ]
}
```

The individual fields are described in this table:

| field | description |
|----|----|
| `type` |There are currently two types of targets, `count` and `percent`. These are illustrated above in the Types of Widgets section. 1 & 2 are the `count` type and 3 is the `percent` type. |
| `id` |This can be whatever you like, but it must match the `type` property of the target being emitted in `rules.nools.js`. |
| `icon` |You can use any icon that you like, but make sure the icon has been uploaded to your instance and the name matches. |
| `goal` |For percentage targets, you must put a positive number. For count targets, put a positive number if there is a goal. If there is no goal, put -1. |
| `context` |This is an expression similar to form context that describes which users will see a certain target. In this case, you only have access to the `user` (person logged in) and not to the `contact` since you are not on a person or place profile page. |
| `translation_key` |The name of the translation key to use for the title of this target. |
| `subtitle_translation_key` |The name of the translation key to use for the subtitle of this target. If none supplied the subtitle will be blank. |
| `percentage_count_translation_key` |The name of the translation key to use for the percentage value detail shown at the bottom of the target, eg |"(5 of 6 deliveries)". The translation context has `pass` and `total` variables available. If none supplied this defaults to "targets.count.default".


### Logic: `rules.nools.js`
Target templates, unlike Task templates, will show up on their own in the app without any logic. However, they will not have any data unless you emit data as target instances in the `rules.nools.js` rules engine code. This is the code that generates both Tasks and Targets. It iterates through all contacts and their reports, and then creates and emits _target instances_ -- data to be shown in the widgets defined in `targets.json`. The app then automatically shows the data in the corresponding widgets in the Targets tab, updating their counts and percentages as needed.

The rules engine code receives an object containing the following:
- `contact`: the contact's doc. All contacts have `type` of either `person` or `place`.
- `reports`: an array of all the reports submitted about the contact.

The basic structure of the rules engine code is as follows:

```js
define Contact {
  contact: null,
  reports: null
}

rule GenerateEvents {
  when {
    c: Contact
  }
  then {
    if (c.contact && c.contact.type === 'person') {
      // Check for condition in person's doc
        // Create + emit target instance based on person's fields

      c.reports.forEach(
        function(report) {
          switch(report.form) {
            case 'form_id':
              // Check for condition in report
                // Create + emit target instance based on report fields
            // ...
          }
        }
      );
    }
    emit('_complete', { _id: true });
  }
}
```

To generate data for targets the rules engine code must emit an object with the following properties:

| property | description | required |
|---|---|---|
| `_id` | A unique identifier for the data. Typically unique by including the target type and ID for the source data. Creating a target instance with a non-unique ID will overwrite the previous instance. | yes |
| `deleted` | Set based on whether the report that generated the target is deleted. | yes |
| `type` | Set to the passed in value that you provide. The `type` must match the target widget `id` that you listed in the `targets.json` template. | yes |
| `pass` | Can be true or false. True if the report meets the specified condition and false if the report doesn't meet the condition. The total number of target emissions is always equal to the number of targets emitted with `pass: true` plus the number of targets emitted with `pass: false`. | yes |
| `date` | The date for the data in question. Widgets only show data for the current month. Typically set to the `reported_date` of the report that generated the data. Set to `new Date().getTime()` if data needs to be shown regardless of current date. | yes |


To initialize the target instance we use a `createTargetInstance` function, passing to it the `type` of target widget, the `source` contact or report that triggered the target instance, and the `pass` condition:
```js
var createTargetInstance = function(type, source, pass) {
  return new Target({
    _id: source._id + '-' + type,
    deleted: !!source.deleted,
    type: type,
    pass: pass,
    date: source.reported_date
  });
};
```
The newly initialized target instance can be manipulated further if needed before being emitted. Typically, the fields changed after initialization are the `date` so that it shows up for the current month, and the `_id` if needed to further ensure uniqueness.

To emit a target instance we use the following function:

```js
    var emitTargetInstance = function(instance) {
      emit('target', instance);
    };
```

Putting these concepts all together, here is an example snippet where a target instance is created, modified, then emitted.
```js
        // IMM: CHILDREN WITH BCG REPORTED
        var instance = createTargetInstance('imm-children-with-bcg-reported', c.contact, isBcgReported(c));
        instance.date = now.getTime();
        emitTargetInstance(instance);
```

### Uploading <!-- TODO -->

### Examples
This section contains some examples of simple and complex targets.

#### Simple Count - This Month

The most basic target is a simple count of a particular type of report. In this case, we are counting the number of pregnancy registrations.

```javascript
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

```javascript
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

You may also want to count the total number of pregnancies registered over all time. The key to all-time targets is adjusting the target date to sometime in the current month. The easiest way is to set the target's date to today.

```javascript
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

```javascript
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

```javascript
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

```javascript
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    var today = new Date();
    var dob_1yr = new Date();
    dob_1yr.setFullYear(today.getFullYear()-1);

    // Find all assessment forms where a child under 1 year was assessed
    if (r.form === 'assessment' && dob_contact > dob_1yr) {
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

```javascript
// % Newborn Care Visit within 48 hours
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    var today = new Date();
    // Find all delivery reports
    if (r.form === 'postnatal_care' && r.fields.delivery_date != '') {
      // Calculate the 48 hour cutoff (2 days after the delivery date at 23:59)
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

```javascript
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

#### Calculate Percent of Households that were Surveyed - All-Time

In this case, we are emitting a false target for every household and then a true target for every household for which a survey was done. Because the true target will be emitted after the false target, it will overwrite the false target.

```javascript
// Find all households
if(c.contact.type === 'clinic'){
  var today = new Date();
  // Find the time of the most recent survey
  var newestEquitySurveyTimestamp = Utils.getMostRecentTimestamp(c.reports, 'family_equity');

  // Emit a false target for every household that has been registered to make sure that we capture every household
  var instance = createTargetInstance('surveys-conducted', c.contact, false);
  instance.date = today.getTime();
  emitTargetInstance(instance);

  // Review all reports for the current household
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

```javascript
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

```javascript
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

```javascript
if (c.contact != null && c.contact.type === 'person') {
  c.reports.forEach(function(r) {
    // For each PNC form, check to see if it's a delivery report and if it is more recent than the most recent pregnancy registration
    if (r.form === 'postnatal_care' && r.fields.delivery_date != '' && r.reported_date > newestPregnancyTimestamp) {
      // Create a variable to track the cutoff date for when PNC must be done (by 3 days after delivery date at 23:59)
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

### Tips & Tricks
1. You can use Utils functions just as you can with Task rules. See [Tasks>Utils](#utils) for more information. 
1. Percentage targets are always equal to: `(number of true targets) / (number of true targets + number of false targets)`
1. It's possible to emit a target that refers to the same form or contact multiple times. This can be used to calculate percentage targets by emitting a false target for each of the forms or contacts that you want to include and then emitting true only for the ones that meet certain conditions. See the [Calculate Percent of Households that were Surveyed](#calculate-percent-of-households-that-were-surveyed---all-time) example.
1. Remember that targets are emitted in a specific order, so if you are using the method in the previous tip, this might impact your results. The app will always use the target emitted most recently, so if you emit false, true, false for the same form or contact, then the app will consider it a false target, even though there was a true emitted at some point. 

### Troubleshooting
------------------------------------
# Set-up
## Contacts
### Create [via UI, needs training module]
### Edit [via UI, needs training module]
### Bulk create
## Users 
### Overview
### Create [via UI, needs training module] <!-- TODO: Jill -->
### Bulk Creation (conf#61)
### Permissions <!-- TODO: Derick -->
Certain actions/views within the app can be restricted so that they are only able to be performed/seen by certain user types.

## User types
The user types that can have permissions adjusted are:
| User Type | Description |
|----|----|
| National manager | Access to all docs |
| Regional manager | Restricted to their place |
| Data entry | Access to Medic Reporter only |
| Analytics | Data export via URL only |
| Gateway | Limited access user for Medic Gateway |

Currently mobile app users are all set to be "Regional managers".

## Available permissions

| Key | Description |
|---|---|
| can_access_gateway_api |  |
| can_bulk_delete_reports |  |
| can_configure |  |
| can_create_people |  |
| can_create_places |  |
| can_create_records |  |
| can_create_users |  |
| can_delete_contacts |  |
| can_delete_messages |  |
| can_delete_reports |  |
| can_delete_users |  |
| can_edit |  |
| can_edit_profile |  |
| can_export_audit |  |
| can_export_contacts |  |
| can_export_feedback |  |
| can_export_forms |  |
| can_export_messages |  |
| can_export_server_logs |  |
| can_update_messages |  |
| can_update_people |  |
| can_update_places |  |
| can_update_users |  |
| can_view_analytics |  |
| can_view_analytics_tab |  |
| can_view_call_action | When viewing a contact, the user can see the call action in the action bar |
| can_view_contacts |  |
| can_view_contacts_tab |  |
| can_view_data_records |  |
| can_view_message_action | When viewing a contact, the user can see the message action in the action bar |
| can_view_messages |  |
| can_view_messages_tab |  |
| can_view_reports |  |
| can_view_reports_tab |  |
| can_view_tasks |  |
| can_view_tasks_tab |  |
| can_view_unallocated_data_records |  |
| can_view_users |  |

## Data Migration
------------------------------------
# Deploy + Maintain
## Versioning
## Upgrades
## Release notes
## Deploying
## Local
## Development Setup
## Contributing code
## Export
