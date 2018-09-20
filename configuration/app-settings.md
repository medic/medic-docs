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
| outgoing_deny_list | All outgoing messages will be denied (unsent) if the recipient phone number starts with an entry in this list. A comma delimited list. (eg. `outgoing_deny_list="253,ORANGE"` will deny all messages sent to `253 543 4448` and `ORANGE NET`) | "" | 3.2.0 |
| outgoing_deny_shorter_than | Deny all messages to recipient phone numbers which are shorter than this value. Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with short codes used by gateways (eg. `60396`). An integer. | 6 | 3.2.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with non-numeric senders used by gateways. A boolean. | true | 3.2.0 |
