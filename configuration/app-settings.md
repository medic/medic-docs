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
