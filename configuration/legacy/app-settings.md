# App settings

Much of the customization lives in the app_settings. Look for the `app_settings` field in the design doc for `medic` db.

![app_settings](../img/app_settings.png)

You can update these settings with the [scripts/update_settings.js](https://github.com/medic/medic/blob/master/scripts/update_app_settings.sh) script, or in Dashboard (`<host>/dashboard/_design/dashboard/_rewrite/`), or by editing the file in Futon directly.

For more details on what you can use in settings, check out the [superset of supported settings](https://github.com/medic/medic/blob/master/config/standard/app_settings.json).

### Optional Settings

The following settings do not need to be specified. They should only be defined when the default implementation needs to be changed.

| Setting              | Default | Allowed Values      | Description |
|----------------------|---------|---------------------|-------------|
|phone_validation      | full    | full<br/>partial<br/>none | <b>full</b> - full validation of a phone number for a region using length and prefix information.<br/><b>partial</b> - quickly guesses whether a number is a possible phone number by using only the length information, much faster than a full validation.<br/><b>none</b> - allows almost any values but still fails for any phone that contains a-z chars. |
