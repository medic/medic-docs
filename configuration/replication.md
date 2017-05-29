# CouchDB replication

Replication is what we call it when users download a copy of the data on to their device.

## Restricting replication

If the user has the `can_access_directly` permission they can access all the data. If not they will get restricted access to the data.

### Restriction by place

The most common restriction is by place. This is where we check the user's `facility_id` property, and allow access to all contacts that are descendants of that place, and all reports and messages that are about one of those descendants.

For example, if a CHP's `facility_id` property is set to the ID of the Maori Hill clinic, then they will be able to see all patients and all reports about patients at that clinic.

### Depth

Sometimes though you want to only access contacts near the top of the hierarchy. This may be because returning all contacts would be too much data to be practical, or for patient privacy, or because it's just not part of your workflow. In this case you can configure a replication depth for a specific role under `replication_depth` in the app settings.

For example:

```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1 },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

### Sensitive documents

We won't replicate documents that are about the user when the sender is someone the user can't access. For example, if a supervisor submits a report about one of their CHPs, that CHP won't be able to see it.
