# Forms

Forms define information flows. Users fill in forms by SMS, or through SIMapps, or medic-collect, or the android app, or the web app. You can have forms for registering new patients, for sending in the status of a patient, for creating a new health center, ...

There are two types of forms: JSON forms used for SMS interfaces, and xforms used for the android app, the web app, Medic Collect, and the SimApps.

You can view the list of JSON forms and load new ones through the webapp's interface (in Configuration). You can also upload them from command line with the [load_forms.js](https://github.com/medic/medic-webapp/blob/master/scripts/load_forms.js) script.

You can view the XML forms from Futon (check out the `forms` view). You can upload new forms from command line with the [upload_xform.sh](https://github.com/medic/medic-webapp/blob/master/scripts/upload_xform.sh) script. XML forms with ids starting with `forms:contact:` will customize the edit/create page for the given contact (person or place) type.

![XML forms](img/xml_forms.png)
