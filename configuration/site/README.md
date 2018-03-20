
Configuring Medic Mobile
------------------------------
<!-- TOC depthFrom:1 depthTo:3 -->

- [Introduction](#introduction)
    - [What is Medic Mobile](#what-is-medic-mobile)
        - [Review of app structure and workflows](#review-of-app-structure-and-workflows)
        - [Overview of various pages + core functions](#overview-of-various-pages--core-functions)
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
        - [Showing a form](#showing-a-form)
        - [Getting data into a form](#getting-data-into-a-form)
        - [Uploading forms](#uploading-forms)
        - [Other Medic specific XForm conventions](#other-medic-specific-xform-conventions)
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
### Structuring a form
#### Inputs
#### Outputs
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
##### Extra docs
###### Example Form Model
###### Resulting docs
##### Linked docs
###### Example Form Model
###### Resulting docs
##### Repeated docs
###### Example Form
###### Resulting docs
##### Linked docs example
##### Repeated docs example
#### Accessing contact-summary data
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
