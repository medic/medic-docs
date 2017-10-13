# Forms

Forms define information flows. Users can fill in forms by SMS, SIM applications, Medic Collect, or via the webapp in a browser or the Android app. Forms can be used for a vairety of purposes, including creating new patients, registering them for SMS reminders, reporting a patient visit or status. 

There are two types of forms: 
- **JSON forms**: used for SMS interfaces such as formatted SMS, SIM applications, and Medic Collect*
- **XForms**: used for forms used within the web app, whether it is accessed in browser or via the Android app.

You can view the list of JSON forms and load new ones through the webapp's interface (in Configuration). You can also upload them from command line with the [load_forms.js](https://github.com/medic/medic-webapp/blob/master/scripts/load_forms.js) script.

You can view the XML forms from Futon (check out the `forms` view). You can upload new forms from command line with the [upload_xform.sh](https://github.com/medic/medic-webapp/blob/master/scripts/upload_xform.sh) script. XML forms with ids starting with `forms:contact:` will customize the edit/create page for the given contact (person or place) type.

![XML forms](img/xml_forms.png)

_*Note that although Medic Collect uses XForms in the Android app, for now it still needs a corresponding JSON form in the webapp to interpret the incoming report._

## Accessing the contact-summary

xforms have the ability to access the output of the [configured contact-summary script](https://github.com/medic/medic-docs/blob/master/configuration/contact-summary.md). This means you can have different fields, state, or information based on any known information about the contact.

To configure this, add a new instance with the id "contact-summary" to your xform somewhere below your primary instance, then bind values where you need them. Note that medic-configurer automatically adds this instance to every form so you shouldn't need to do this manually. Example:

```xml
<h:html>
  <h:head>
    <model>
      <instance>
        <visit>
          <age/>
        </visit>
      </instance>
      <instance id="contact-summary"/>
      <bind calculate="instance('contact-summary')/context/age" nodeset="/visit/age" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/visit/age" />
  </h:body>
</h:html>
```
