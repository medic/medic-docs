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

### Available transitions

| Key | Description |
|---|---|
| accept_patient_reports | Validates reports about a patient and silences relevant reminders. |
| conditional_alerts | Executes the configured condition and sends an alert if the condition is met. |
| default_responses | Responds to the message with a confirmation or validation error. |
| registration | For registering a patient to a schedule. Performs some validation and creates the patient document. |
| resolve_pending | Sets the state of pending messages to sent. It is useful during builds where we don't want any outgoing messages queued for sending. |
| twilio_message | Sends messages via twilio instead of waiting for gateway to pick them up. |
| update_clinics | Update clinic data on new data records, use refid for clinic lookup otherwise phone number. |
| update_notifications | Mutes or unmutes scheduled messages based on configuration. |
| update_scheduled_reports | If a report has a month/week/week_number, year and clinic then look for duplicates and update those instead. |
| update_sent_by | Sets the sent_by field of the report based on the sender's phone number. |
| update_sent_forms | Update sent_forms property on facilities so we can setup reminders for specific forms. |
