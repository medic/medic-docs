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

TODO : Where can you see a list of these, somewhere in code? 

`contact.name`, `contact.phone`
TODO : What's in `contact`?

`patient_name`

`patient_id`

What's `chw_sms`? `expected_date`? Syntax is weird
