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

## Creating additional docs from an xform

In version 2.13.0 and higher, you can configure your app forms to generate additional docs upon submission. You can create one or more docs using variations on the configuration described below. One case where this can be used is to register a newborn from a delivery report, as shown below. First, here is an overview of what you can do and how the configuration should look in XML:

### Extra docs

- Extra docs can be added by defining structures in the model with the attribute db-doc="true", e.g.:

#### Example Form Model

```
<data>
  <root_prop_1>val A</root_prop_1>
  <other_doc db-doc="true">
    <type>whatever</type>
    <other_prop>val B</other_prop>
  </other_doc>
</data>
```

#### Resulting docs

Report (as before):

```
{
  _id: '...',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    root_prop_1: 'val A',
  }
}
```

Other doc:
```
{
  _id: '...',
  _rev: '...',
  type: 'whatever',
  other_prop: 'val B',
}
```

### Linked docs

- Linked docs can be referred to using the doc-ref attribute, with an xpath. This can be done at any point in the model, e.g.:

#### Example Form Model
```
<sickness>
  <sufferer db-doc-ref="/sickness/new">
  <new db-doc="true">
    <type>person</type>
    <name>Gómez</name>
    <original_report db-doc-ref="/sickness"/>
  </new>
</sickness>
```

#### Resulting docs

Report:
```
{
  _id: 'abc-123',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    sufferer: 'def-456',
  }
}
```

Other doc:
```
{
  _id: 'def-456',
  _rev: '...',
  type: 'person',
  name: 'Gómez',
  original_report: 'abc-123',
}
```

### Repeated docs

- Can have references to other docs, including the parent
- These currently cannot be linked from other docs, as no provision is made for indexing these docs

#### Example Form
```
<thing>
  <name>Ab</name>
  <related db-doc="true">
    <type>relative</type>
    <name>Bo</name>
    <parent db-doc-ref="/thing"/>
  </related>
  <related db-doc="true">
    <type>relative</type>
    <name>Ca</name>
    <parent db-doc-ref="/thing"/>
  </related>
</artist>
```

#### Resulting docs

Report:
```
{
  _id: 'abc-123',
  _rev: '...',
  type: 'report',
  _attachments: { xml: ... ],
  fields: {
    name: 'Ab',
  }
}
```

Other docs:
```
{
  _id: '...',
  _rev: '...',
  type: 'relative',
  name: 'Bo',
  parent: 'abc-123',
}
{
  _id: '...',
  _rev: '...',
  type: 'relative',
  name: 'Ch',
  parent: 'abc-123',
}
```

### Linked docs example
This example shows how you would register a single newborn from a delivery report.

First, the relevant section of the delivery report XLSForm file:
![Delivery report](img/linked_docs_xlsform.png)

Here is the corresponding portion of XML generated after converting the form:
```
<repeat>
  <child_repeat db-doc="true" jr:template="">
    <child_name/>
    <child_gender/>
    <child_doc db-doc-ref=" /delivery/repeat/child_repeat "/>
    <created_by_doc db-doc-ref="/delivery"/>
    <name/>
    <sex/>
    <date_of_birth/>
    <parent>
      <_id/>
      <parent>
        <_id/>
        <parent>
          <_id/>
        </parent>
      </parent>
    </parent>
    <type>person</type>
  </child_repeat>
</repeat>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is the `child_doc` field with an `_id` that corresponds to the linked doc. In this case, you could look for that `_id` on the People tab or in the DB itself to confirm that the resulting doc looks correct.

### Repeated docs example
This example extends the above example to show how you would register one or multiple newborns from a delivery report. This allows you to handle multiple births.

First, the relevant section of the delivery report XLSForm file:
![Delivery report](img/repeated_docs_xlsform.png)

Here is the corresponding portion of XML generated after converting the form:
```
<child_doc db-doc-ref=" /postnatal_care/child "/>
<child db-doc="true">
  <created_by_doc db-doc-ref="/postnatal_care"/>
  <name/>
  <sex/>
  <date_of_birth/>
  <parent>
    <_id/>
    <parent>
      <_id/>
      <parent>
        <_id/>
      </parent>
    </parent>
  </parent>
  <type>person</type>
</child>
```

If you've done your configuration correctly, all you should see when you click on the submitted report from the Reports tab is the `child_doc` field with an `_id` that corresponds to the first doc that was created. The other docs will have a link to the report that created them but the report will not link directly to them. Again, you could look for that `_id` on the People tab or in the DB itself to confirm that the resulting docs look correct.