# Sentinel transitions

When sentinel detects a document has changed it runs transitions against the doc. These transitions can be used to generate a short form patient id or assign a report to a facility.

## Configuration

By default all transitions are disabled. They can be enabled by configuring the `transitions` property to have a key with the transitions name and a `truthy` value, eg:

```json
{
  "transitions": {
    "a": { },
    "b": true,
    "c": { "disable": false },
    "d": { "disable": true }
  }
}
```

In this example the `d` transition will not be applied, but the other three will be.

## Available transitions

| Key | Description |
|---|---|
| accept_patient_reports | Validates reports about a patient and silences relevant reminders. |
| conditional_alerts | Executes the configured condition and sends an alert if the condition is met. |
| default_responses | Responds to the message with a confirmation or validation error. |
| [registration](#registration) | For registering a patient to a schedule. Performs some validation and creates the patient document if the patient does not already exist. |
| resolve_pending | Sets the state of pending messages to sent. It is useful during builds where we don't want any outgoing messages queued for sending. |
| update_clinics | Update clinic data on new data records, use refid for clinic lookup otherwise phone number. |
| update_notifications | Mutes or unmutes scheduled messages based on configuration. |
| update_scheduled_reports | If a report has a month/week/week_number, year and clinic then look for duplicates and update those instead. |
| update_sent_by | Sets the sent_by field of the report based on the sender's phone number. |
| update_sent_forms | Update sent_forms property on facilities so we can setup reminders for specific forms. |
| [generate_patient_id_on_people](#generate-patient-id-on-people) | Automatically generates the `patient_id` on all person documents. |

## Transition Configuration Guide

Guides for how to setup specific transitions.

TODO: Fill this out for every transition, even if there is no configuration possible

### Registration

Configuration is held at `app_settings.registrations`, as a list of objects connecting forms to validations, events and messages. Its structure is described in kanso.json.

#### Events

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

##### `add_patient_id`

**Deprecated in favour of `add_patient`.** Previously this only added a `patient_id` to the root of the registration form. This functionality has been merged into `add_patient`. Now, using this event will result in the same functionality as described in `add_patient` above.

##### `add_expected_date`
##### `add_birth_date`
##### `assign_schedule`
##### `clear_schedule`


### Generate Patient ID On People

No custom configuration for `generate_patient_id_on_people`.
