# Overview
Documentation within this directory covers developing and configuring community health applications using the Medic Mobile framework. Setting up the core framework itself is covered in the [medic repo](https://github.com/medic/medic#easy-deployment). 

# Getting Started
An introduction and reference for developing community health applications is provided in [Developing Community Health Applications](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md), which also covers building forms, tasks, targets, and contact profiles.

# SMS Workflows
Workflows that use SMS are defined in the file `app_settings.json`. The following guides should help with setting that up.
- [Defining SMS Forms](https://github.com/medic/medic-docs/blob/master/configuration/forms.md#json-forms)
- [Configuring SMS responses](app-settings.md)
- [SMS Form Validations](app-settings-validations.md)
- [Variables in outgoing SMS](variables-in-messages.md)

# Additional Features
Here are some guides on additional features that can be used within your applications: 
- [Advanced form features](forms.md)
- [Optional settings](https://github.com/medic/medic-docs/blob/master/configuration/app-settings.md#optional-settings)
- [Purging](purging.md)
- [Replication](replication.md)
- [Sentinel transitions](transitions.md)

# Other components
## Medic Gateway
- [Medic Mobile Gateway Configuration](gateway-config.md)
- [List of Phones that Work Well with Medic Gateway](gateway-phones.md)

## Medic Collect
- [Creating XForms for Medic Collect](create-xforms-for-medic-collect.md)
- [Updating Collect forms over the air](collect-form-update-over-the-air.md)

# Support Guides
- [CouchDB Authentication](couchdb-authentication.md)
- [Connecting to RDBMS in Windows](connecting-to-rdbms-in-windows.md)
- [Importing data from CSVs](csv-to-docs.md)
- [Accessing DB of production instance](direct-access.md)
- [Configuring the automated short ID](shortcode-identifiers.md)
- [Installing the Standard configuration](installing-a-standard-project.md)
- [Updating the Standard forms](update-standard-forms.md)

# Legacy Documentation
- [Installing TRB files to Turbo Sim on Windows](legacy/installing-trb-windows.md) → No longer deployed
- [Targets](legacy/targets.md) → Replaced by declarative Targets section in [this guide](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md#targets)
- [Tasks](legacy/tasks.md) → Replaced by declarative Tasks section in [this guide](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md#tasks)
- [Contact Summary](legacy/contact-summary.md) → Replaced by declarative Contacts section in [this guide](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md#contacts)
- [Setting up XForms in V2 (MM App)](legacy/setting-up-xforms-for-mm-app.md) → Replaced by Forms section in [this guide](https://github.com/medic/medic-docs/blob/master/configuration/developing-community-health-applications.md#forms)
- [Install SSL Cerificates to VM](legacy/install-ssl-certificates-to-vm.md) → Not supported for Medic projects. Self hosting instructions to come in CHT
- [Pyxform](legacy/pyxform.md) → Should now use [medic-conf](https://github.com/medic/medic-conf#installation)
- [Supervisor creation](legacy/supervisor-creation.md) → To be moved to `medic-conf` if still useful.
- [Data deletion](legacy/data-deletion.md) → To be moved to `medic-conf` if still useful.
- [Revalidate Invalidated Reports](legacy/revalidate-invalidated-report.md) → To be moved to `medic-conf` if still useful.
- [Garden](legacy/garden.md) → Obsolete instructions on Kujua Lite.
- [Gateway Testing](legacy/gateway-testing.md) → Obsolete project instructions for testing gateway
