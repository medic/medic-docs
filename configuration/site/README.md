
Configuring Medic Mobile
------------------------------
<!-- TOC depthFrom:1 depthTo:4 -->

- [Introduction](#introduction)
    - [What is Medic Mobile](#what-is-medic-mobile)
        - [Review of app structure and workflows](#review-of-app-structure-and-workflows)
        - [Overview of various pages + core functions](#overview-of-various-pages--core-functions)
            - [Tasks tab](#tasks-tab)
            - [People tab](#people-tab)
            - [Targets tab](#targets-tab)
            - [History/Reports.](#historyreports)
            - [Definitions](#definitions)
    - [What’s configurable](#whats-configurable)
- [Getting Started](#getting-started)
    - [To know before starting](#to-know-before-starting)
        - [CouchDB](#couchdb)
        - [Javascript](#javascript)
        - [JSON](#json)
        - [XLSForms and XForms](#xlsforms-and-xforms)
    - [To do before starting](#to-do-before-starting)
        - [Have access to an instance](#have-access-to-an-instance)
        - [Set up a dev instance](#set-up-a-dev-instance)
        - [Set up medic-conf](#set-up-medic-conf)
- [Configure](#configure)
    - [Overview](#overview)
        - [File structure](#file-structure)
        - [App settings](#app-settings)
        - [...and more!](#and-more)
    - [Localization](#localization)
    - [Icons](#icons)
    - [SMS Forms](#sms-forms)
    - [App Forms](#app-forms)
        - [Overview](#overview-1)
        - [Structuring a form](#structuring-a-form)
            - [Inputs](#inputs)
            - [Outputs](#outputs)
            - [Summary page](#summary-page)
        - [Showing a form](#showing-a-form)
            - [On History/Reports](#on-historyreports)
            - [On Profiles (see Profile section for how to show)](#on-profiles-see-profile-section-for-how-to-show)
        - [Getting data into a form](#getting-data-into-a-form)
            - [From Profiles](#from-profiles)
            - [From Tasks](#from-tasks)
            - [From a database object](#from-a-database-object)
        - [Uploading forms](#uploading-forms)
            - [CLI](#cli)
            - [UI](#ui)
        - [Other Medic specific XForm conventions](#other-medic-specific-xform-conventions)
            - [Dropdown with people/places](#dropdown-with-peopleplaces)
            - [Hiding fields/groups in Reports view](#hiding-fieldsgroups-in-reports-view)
            - [Creating additional docs](#creating-additional-docs)
            - [Accessing contact-summary data](#accessing-contact-summary-data)
            - [Showing fields in Reports tab](#showing-fields-in-reports-tab)
        - [Tips & Tricks](#tips--tricks)
        - [Troubleshooting](#troubleshooting)
    - [Collect Forms](#collect-forms)
    - [Profiles](#profiles)
        - [Overview](#overview-2)
        - [Info card](#info-card)
        - [Condition cards](#condition-cards)
        - [History](#history)
        - [Tasks](#tasks)
        - [Actions](#actions)
            - [Context](#context)
            - [Passing data](#passing-data)
    - [Tasks](#tasks-1)
        - [Overview](#overview-3)
        - [Definition](#definition)
        - [Creation](#creation)
        - [Uploading](#uploading)
        - [Examples](#examples)
        - [Tips & Tricks](#tips--tricks-1)
        - [Troubleshooting](#troubleshooting-1)
    - [Targets](#targets)
        - [Overview](#overview-4)
        - [Definition](#definition-1)
        - [Creation](#creation-1)
        - [Uploading](#uploading-1)
        - [Examples](#examples-1)
        - [Tips & Tricks](#tips--tricks-2)
        - [Troubleshooting](#troubleshooting-2)
- [Set-up](#set-up)
    - [Contacts](#contacts)
        - [Create [via UI, needs training module]](#create-via-ui-needs-training-module)
        - [Edit [via UI, needs training module]](#edit-via-ui-needs-training-module)
        - [Bulk create](#bulk-create)
    - [Users](#users)
        - [Overview](#overview-5)
        - [Bulk Creation (conf#61)](#bulk-creation-conf61)
        - [Permissions](#permissions)
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
## What is Medic Mobile
### Review of app structure and workflows
### Overview of various pages + core functions
#### Tasks tab
#### People tab
##### Hierarchy levels
##### People profile
###### info card
###### condition card
###### tasks
###### history
##### Place profiles
###### info card
###### (condition card)
###### sub places/people
###### tasks
###### history
#### Targets tab
##### widgets
#### History/Reports. 
##### Define Forms and where they live.
#### Definitions
## What’s configurable
------------------------------------
# Getting Started
## To know before starting
### CouchDB
### Javascript
### JSON
### XLSForms and XForms
## To do before starting
### Have access to an instance
### Set up a dev instance
### Set up medic-conf
------------------------------------
# Configure
## Overview
### File structure
### App settings
### ...and more!
------------------------------------
## Localization
------------------------------------
## Icons
------------------------------------
## SMS Forms
------------------------------------
## App Forms
### Overview
Whether using Medic Mobile in the browser or via the Android app, all Actions, Tasks, Contact creation/edit forms are created using [ODK XForms](https://opendatakit.github.io/xforms-spec/) -- a XML definition of the structure and format for a set of questions. Since writing raw XML can be tedious, we suggest creating the forms using the [XLSForm standard](http://xlsform.org/), and using the [medic-conf](https://github.com/medic/medic-conf) command line configurer tool to convert them to XForm format. The instructions below assume knowledge of XLSForm.

- A XLSForm form definition, converted to the XForm (optional) 
- A XML form definition using the ODK XForm format
- Meta information in the `{form_name}.properties.json` file (optional)
- Media files in the `{form_name}-media` directory (optional)

### Structuring a form
A typical Task form starts with an `inputs` group which contains prepopulated fields that may be needed during the completion of the form (eg patient's name, prior information), and ends with a summary group (eg `group_summary`, or `group_review`) where important information is shown to the user before they submit the form. In between these two is the form flow, usually a collection of questions grouped into pages. All data fields submitted with a form are stored, but often important information that will need to be accessed from the form is brought to the top level. Since all forms in Medic Mobile are submitted about a person or place you must make sure at least on of `place_id`, `patient_id`, and `patient_uuid` are stored at the top level.

| **type** | **name** | **label** | ... |
|---|---|---|---|
| begin group | inputs | Inputs |
| string | source | Source |
| string | source_id | Source ID |
| end group| | |
| calculate | patient_id | Patient ID |
| calculate | patient_name | Patient Name |
| calculate | edd | EDD |
| ...
| begin group | group_review | Review |
| note | r_patient_info | \*\*${patient_name}\*\* ID: ${r_patient_id} |
| note | r_followup | Follow Up \<i class="fa fa-flag"\>\</i\> |
| note | r_followup_note | ${r_followup_instructions} |
| end group| | |

#### Inputs

#### Outputs
All forms in Medic Mobile are submitted about a person or place. In order for a submitted report to be handled properly by Medic Mobile it must have at least one of the following identifiers at the top level of the data model: `place_id`, `patient_id`, `patient_uuid`.

#### Summary page
##### Structure
##### Styling

### Showing a form
#### On History/Reports
#### On Profiles (see Profile section for how to show)
### Getting data into a form
#### From Profiles
##### Inputs
##### Contact-summary (see Profile section)
#### From Tasks
##### Inputs
##### Best practices
##### source_id
#### From a database object
### Uploading forms
#### CLI
#### UI
### Other Medic specific XForm conventions
#### Dropdown with people/places
#### Hiding fields/groups in Reports view
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
#### Showing fields in Reports tab
### Tips & Tricks
### Troubleshooting
------------------------------------
## Collect Forms
------------------------------------
## Profiles
### Overview
### Info card
### Condition cards
### History
### Tasks
### Actions
#### Context
#### Passing data 
------------------------------------
## Tasks
### Overview
### Definition
### Creation
### Uploading
### Examples
### Tips & Tricks
### Troubleshooting
------------------------------------
## Targets
### Overview
### Definition
### Creation
### Uploading
### Examples
### Tips & Tricks
### Troubleshooting
------------------------------------
------------------------------------
# Set-up
## Contacts
### Create [via UI, needs training module]
### Edit [via UI, needs training module]
### Bulk create
## Users 
### Overview
### Bulk Creation (conf#61)
### Permissions 
## Data Migration
------------------------------------
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
------------------------------------
------------------------------------
