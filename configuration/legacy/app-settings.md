# App settings

Much of the customization lives in the app_settings. Look for the `app_settings` field in the design doc for `medic` db.

![app_settings](img/app_settings.png)

You can update these settings with the [scripts/update_settings.js](https://github.com/medic/medic-webapp/blob/master/scripts/update_app_settings.sh) script, or in Dashboard (`<host>/dashboard/_design/dashboard/_rewrite/`), or by editing the file in Futon directly.

For more details on what you can use in settings, check out the [superset of supported settings](https://github.com/medic/medic-webapp/blob/master/config/standard/app_settings.json).

## Optional Settings

| Setting              | Default | Allowed Values      | Description |
|----------------------|---------|---------------------|-------------|
|phone_validation      | full    | full, partial, none | full - full validation of a phone number for a region using length and prefix information.<br>
partial - quickly guesses whether a number is a possible phone number by using only the length information, much faster than a full validation.<br>
none - allows any phone and only fails for anything that contains a-z chars. |
