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
    - [Tasks](#tasks)
        - [External link](#external-link)
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
## SMS Forms
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
## Tasks

This is now documented [here](https://github.com/medic/medic-docs/tree/master/configuration/declarative-config.md#tasks) using the new declarative config.

## Targets

This is now documented [here](https://github.com/medic/medic-docs/tree/master/configuration/declarative-config.md#targets) using the new declarative config.

### Tips & Tricks
1. You can use Utils functions just as you can with Task rules. See [Tasks>Utils](#utils) for more information. 
1. Percentage targets are always equal to: `(number of true targets) / (number of true targets + number of false targets)`
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
