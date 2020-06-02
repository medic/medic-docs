# Integrating with DHIS2

The CHT Core Framework version 3.9.0 allows data from configured [Targets](./developing-community-health-applications.md#targets) to integrate into DHIS2.

## Prerequisites

1. Access to DHIS2 and an instance running the CHT Core Framework >=3.9.0.
1. DHIS2 is configured with one or more [data sets](https://docs.dhis2.org/2.22/en/user/html/ch06.html) with which you'd like to integrate.
1. DHIS2 is configured with a hierarchy of [organisation units](https://docs.dhis2.org/2.27/en/implementer/html/ch10.html).
1. Permission to manage data in DHIS2 for relevant data sets and organisation units.
1. CHT instance has a configured hierarchy of "places". This hierarchy of places doesn't need to be identical to the hierarchy of organisation units, but each organisation unit you wish to integrate with must map to a place in the CHT hierarchy.

### Limitations and Known Issues

* Data for each user is aggregated base on the contents of the user's [target document](../development/db-schema.md#targets). Note that if your users don't login and synchronize their data won't be represented in the exported data.
* Integrations are limited to _monthly_ DHIS2 data sets.
* Integrations are limited to numeric data-types. To support other data types, consider making a [DHIS2 App](https://docs.dhis2.org/master/en/developer/html/apps_creating_apps.html) for your project.

## User Experience

Once your CHT project is [configured to integrate with DHIS2](#configuration), follow these steps to export the data from CHT and import it into DHIS:

### Exporting data from CHT instance

1. Login to the CHT instance using a user account with the required permissions. You should be automatically navigated to the Admin Console.
1. Select "Import & export data" from the side
1. Select "DHIS2" from the header along the top
1. Select the data set, org unit, and time period that you'd like to send to DHIS2. Click "Export"
1. A file should download in your browser. This file contains a [dataValueSet](https://docs.dhis2.org/master/en/developer/html/webapi_data_values.html) with aggregated user's data.

### Importing data in DHIS2

1. Login to DHIS2 using a user account with permission to manage the relevant dataset and organisation units.
1. Select the "import/export" application inside DHIS2. Select "import data".
1. Upload the file you downloaded in Step 5.
1. Click "Import"

Check the UI for any errors. If you get errors you don't understand or are unable to resolve an error, you can always ask for assistance on the [CHT Forum](https://forum.communityhealthtoolkit.org/c/support/18). If there are no errors, you can review the numbers that resulted by reviewing the data set in DHIS2.

## Configuration

1. In `app_settings.json`, configure one or more data sets.
1. In `targets.js` (or the legacy `targets.json`), configure one or more data elements by setting the `dhis` attribute in the [target schema](./developing-community-health-applications.md#target-schema).
1. Update the contact document of each `place` you wish to maps to an organisation unit. Add an `dhis.orgUnit` attribute.
1. Create a new user role and a new user with that role; or update an existing user role. To export DHIS2 metrics, users need to have the following permissions: `can_configure`, `can_export_all`, and `can_export_dhis`.

### App settings schema

Property | Description | Required
-- | -- | --
id | The data set ID from DHIS2 with which to integrate | Yes
translation_key | Translation key to resolve a human readable name to be displayed in the App Management app | Yes

### Example Configuration

*app_settings.json*

```json
{
  "dhisDataSets": [
    {
      "id": "VMuFODsyWaO",
      "translation_key": "dhis.dataset.name"
    }
  ],
}
```

*contact document*

```json
{
  "_id": "my_place",
  "type": "health_center",
  "dhis": {
    "orgUnit": "HJiPOcmziQA",
  }
}
```

*targets.js*

```javascript
module.export = [
  {
    id: 'births-this-month',
    type: 'count',
    icon: 'icon-infant',
    translation_key: 'targets.births.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: contact => !!contact,
    date: (contact) => contact.contact.date_of_birth,
    dhis: {
      dataElement: 'kB0ZBFisE0e',
    }
  },
];
```

## Notes

* To integrate with data elements of type `yes/no`, use a count of 1 for "yes" and 0 for "no".
