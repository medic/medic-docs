# App settings

Much of the customization lives in the app_settings. Look for the `app_settings` field in the design doc for `medic` db.

![app_settings](img/app_settings.png)

You can update these settings with the [scripts/update_settings.js](https://github.com/medic/medic-webapp/blob/master/scripts/update_app_settings.sh) script, or in Dashboard (`<host>/dashboard/_design/dashboard/_rewrite/`), or by editing the file in Futon directly.

For more details on what you can use in settings, check out the [schema of supported settings](https://github.com/medic/medic-webapp/blob/master/kanso.json#L83).
