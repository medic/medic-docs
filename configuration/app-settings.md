# App settings

Much of the configuration of the app is stored in the database in a document with id "settings". To update settings use the [medic-conf](https://github.com/medic/medic-conf) command line tool.

For more details on what you can use in settings, check out the [superset of supported settings](https://github.com/medic/medic-webapp/blob/master/config/standard/app_settings.json).

### Optional Settings

The following settings do not need to be specified. They should only be defined when the default implementation needs to be changed.

| Setting              | Description | Default | Version |
|----------------------|---------|---------|---------|
| phone_validation     | <ul><li>"full": full validation of a phone number for a region using length and prefix information.</li><li>"partial": quickly guesses whether a number is a possible phone number by using only the length information, much faster than a full validation.</li><li>"none": allows almost any values but still fails for any phone that contains a-z chars.</li></ul> | "full" | 3.1.0   |
| uhc.contacts_default_sort | <ul><li>"alpha": Sort contacts alphanumerically</li><li>"last_visited_date": sort contacts by the date they were most recently visited.</li></ul> | "alpha" | 2.18.0 |
| uhc.visit_count.month_start_date | The date of each month when the visit count is reset to 0. | 1 |2.18.0 |
| uhc.visit_count.visit_count_goal | The monthly visit count goal. | 0 | 2.18.0 |
| outgoing_deny_list | All outgoing messages will be denied (unsent) if the recipient phone number starts with an entry in this list. A comma delimited list. (eg. `outgoing_deny_list="253,ORANGE"` will deny all messages sent to `253 543 4448` and `ORANGE NET`) | "" | |
| outgoing_deny_shorter_than | Deny all messages to recipient phone numbers which are shorter than this value. Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with short codes used by gateways (eg. `60396`). An integer. | 6 | 3.2.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with non-numeric senders used by gateways. A boolean. | true | 3.2.0 |

### Configuring SMS schedules

The Medic platform can have a set of predetermined messages set to be sent at a specificied times in future. These messages are usually
triggered by form submissions. To configure scheduled messages, the following declarations must be made in app_settings.json:

#### 1. Set up the scheduled messages

Scheduled messages are defined under the `schedules` key as an array of schedule objects. The definition takes the typical form below:

```
  "schedules": [
    {
      "name": "ANC Visit Reminders",
      "summary": "",
      "description": "",
      "start_from": "lmp_date",
      "messages": [
        {
          "message": [
            {
              "content": "Please remind Jane to visit the health facility for ANC visit this week. Thanks!",
              "locale": "en"
            },
            {
              "content": "Tafadhali mkumbushe Jane ahudhurie kliniki kwa ANC wiki hii. Akishafanya hivyo tujulishe kwa kutuma ripoti ya kuhakiki kliniki ya ANC. Asante!",
              "locale": "sw"
            }
          ],
          "group": 1,
          "offset": "4 weeks",
          "send_day": "monday",
          "send_time": "09:00",
          "recipient": "reporting_unit"
        },
		.
		.
		.
		.
		more message definitions
      ]
    }
	.
	.
	.
	.
	more schedule definitions
]
```

|Setting|Mandatory|Description|
|-------|---------|----------|
|name|yes|A unique string label that is used to identify the schedule. Spaces are allowed.|
|summary|no|Short description of the of the schedule.|
|description|no|A narrative for the schedule.|
|start_from|no|A date field from which exact scheduled message dates will be calculated. If not specified, the reported date will be used instead. A field from the report is usually used to determine when scheduled messages will go out.|
|messages|yes|This is an array of settings for each message going out.<ul><li>"message": These are the actual messages set to go out in future. To achieve multiple language support, they can be set as an array of content locale pairs as in the example above, or if using version 2.15+, translation strings can be used as the message text.</li><li>"group": An integer used to categorize messages when displayed on the webapp.</li><li>"offset": A time interval from the "start_from" date that defines when the message should be sent. It can be in days or weeks.</li><li>"send_day": Day of the week the message should be sent.</li><li>"send_time": Time of day that the message should be sent in 24 hour format.</li><li>"recipient": Recipient of the message. It can be set to:<br/>'reporting_unit' - sender of the form<br/>'clinic' - clinic that the sender of the form is attached to<br/>'parent' - parent of the sender of the form.</li></ul>|


#### 2. Set up schedule triggers

Under the registrations key in app_settings, we can setup triggers for scheduled messages. A trigger for the schedule above can be defined as shown below:

```

"registrations": [
{
      "form": "PR",
      "events": [
        {
          "name": "on_create",
          "trigger": "assign_schedule",
          "params": "ANC Visit Reminders",
          "bool_expr": "doc.fields.weeks_lmp"
        }
      ],
      "validations": {},
      "messages": []
    }
]

```

|Setting|Mandatory|Description|
|-------|---------|----------|
|form|yes|Form ID that should trigger the schedule.|
|events|yes|An array of event object definitions of what should happen when this form is received.<ul><li>'name': Name of the event that has happened. In our case, on_create happens when the form is received.</li><li>'trigger': What should happen after the named event. assign_schedule will assign the schedule named in params to this report.</li><li>'params': Any useful information for the event. In our case, it holds the name of the schedule to be triggered.</li><li>'bool_expr': A logical expression that qualifies execution of the event. In our example above, we're making sure the form has an LMP date.</li></ul>|
