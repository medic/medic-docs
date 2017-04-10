# Variables in outgoing SMS

Outgoing messages can use Mustache templating to insert certain variables and use certain data formats.

For examples, you can check out the [standard config](https://github.com/medic/medic-projects/blob/master/default-sms-workflow/standard/app_settings.json).
Note that it uses [translation keys](https://github.com/medic/medic-webapp/blob/master/translations/messages-en.properties) for the message contents.

## Format filters
For the latest list, checkout the `formatters` in [medic-sentinel](https://github.com/medic/medic-sentinel/blob/master/lib/template.js#L18)

 - `date` : [example](https://github.com/medic/medic-webapp/blob/master/translations/messages-en.properties#L822)

Displays dates according to the [`date_format` specified in app_settings](https://github.com/medic/medic-projects/blob/master/default-sms-workflow/standard/app_settings.json#L31). See [doc for Moment.js format](https://momentjs.com/docs/#/parsing/string-format/) for details.

 - `datetime` : [example](https://github.com/medic/medic-webapp/blob/master/translations/messages-en.properties#L372)

Displays dates according to the [`reported_date_format` specified in app_settings](https://github.com/medic/medic-projects/blob/master/default-sms-workflow/standard/app_settings.json#L32). See [doc for Moment.js format](https://momentjs.com/docs/#/parsing/string-format/) for details.

 - `bikram_sambat_date` 
 
 Displays dates in Bikram Sambat calendar (most commonly used calendar in Nepal). Currently display format is hardocded to e.g. "१५ चैत २०७३", see [code](https://github.com/medic/medic-sentinel/blob/master/lib/template.js#L21).


## Variables you can use (TODO)
You can insert special variables relating to the patient and/or the CHW in the messages.

Sentinel [exposes values from the `report` doc](https://github.com/medic/medic-sentinel/blob/master/lib/messages.js#L74).

 - `clinic` is the nearest `clinic` parent. Typically  `clinic` type docs are CHW areas. 
To figure that out, check out for instance the [`places_by_type_parent_id_name` view on `medic-client` design doc in couch](http://localhost:5984/_utils/#/database/medic/_design/medic/_view/places_by_type_parent_id_name). 

 - `contact` is the Primary Contact attached to the `clinic`. 
To see examples, check out the [`contacts_by_type` view on `medic-client` design doc in couch](http://localhost:5984/_utils/#/database/medic/_design/medic-client/_view/contacts_by_type). 

 - form fields : sentinel also exposes the [`fields` property of the reports doc](https://github.com/medic/medic-sentinel/blob/master/lib/messages.js#L84), e.g. `patient_name` and `patient_id`. That depends on what fields are in the corresponding form. To see reports in your DB and check out what's in `fields`, look at the [`reports_by_date` view on `medic-client` ddoc](http://localhost:5984/_couch/_utils/database.html?medic/_design/medic-client/_view/reports_by_date) for instance. 
 
 - fields added by [registration transition triggers](https://github.com/medic/medic-sentinel/blob/master/transitions/registration.js#L285), like `patient_id` field added by `add_patient_id` trigger, `expected_date` field added by `add_expected_date` trigger, `birth_date` field added by `add_birth_date` trigger.

TODO : What's `chw_sms`? 
