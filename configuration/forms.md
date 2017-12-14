# Forms

Forms define information flows. Users can fill in forms by SMS, SIM applications, Medic Collect, or via the webapp in a browser or the Android app. Forms can be used for a vairety of purposes, including creating new patients, registering them for SMS reminders, reporting a patient visit or status. 

There are two types of forms: 
- **JSON forms**: used for SMS interfaces such as formatted SMS, SIM applications, and Medic Collect*
- **XForms**: used for forms used within the web app, whether it is accessed in browser or via the Android app.

## JSON forms
Used for SMS interfaces such as formatted SMS, SIM applications, and Medic Collect. You can view the list of JSON forms and load new ones through the webapp's Configuration pages, or via the `forms` field of `app_settings.json`. Each form has fields defined in our specific JSON format, eg:

```
    "F": {
      "meta": {
        "code": "F",
        "icon": "risk",
        "label": {
          "en": "Danger sign flag (SMS)",
          "hi": "खतरे की सूचना (SMS)",
          "id": "Laporan tanda bahaya (SMS)"
        }
      },
      "fields": {
        "patient_id": {
          "labels": {
            "description": {
              "en": "Patient ID"
            },
            "short": {
              "en": "ID"
            },
            "tiny": {
              "en": "ID"
            }
          },
          "position": 0,
          "type": "string",
          "flags": {
            "input_digits_only": true
          },
          "length": [
            5,
            13
          ],
          "required": true
        },
        "notes": {
          "labels": {
            "description": {
              "en": "Notes"
            },
            "short": {
              "en": "Notes"
            },
            "tiny": {
              "en": "N"
            }
          },
          "position": 1,
          "type": "string",
          "length": [
            1,
            100
          ],
          "required": false
        }
      },
      "public_form": true
    }
```

# XForms
The XForms are used for all Actions, Tasks, and Contact Creation/Edit forms within the web app, whether it is accessed in browser or via the Android app. We generally create these in Excel using the [XLSForm standard](http://xlsform.org/), and then convert them using the configurer tool ([medic-conf](https://github.com/medic/medic-conf)). You can view the list of XForms and upload new ones through the webapp's Configuration pages as well. Each form has meta information which defines in which context the form is accessible. Using `medic-config` this info is in a `{name}.properties.json` file. XML forms with IDs starting with `forms:contact:` will customize the edit/create page for the given contact (person or place) type.

![XML forms](img/xml_forms.png)

_*Note that although Medic Collect uses XForms in the Android app, for now it still needs a corresponding JSON form in the webapp to interpret the incoming report._

## General Structure
A typical Action or Task form starts with an `inputs` group which contains prepopulated fields that may be needed during the completion of the form (eg patient's name, prior information), and ends with a summary group (eg `group_summary`, or `group_review`) where important information is shown to the user before they submit the form. In between these two is the form flow, usually a collection of questions grouped into pages. All data fields submitted with a form are stored, but often important information that will need to be accessed from the form is brought to the top level.

| **type** | **name** | **label** | ... |
|---|---|---|---|
| begin group | inputs | Inputs |
| string | source | Source |
| string | source_id | Source ID |
| end group| | |
| calculate | patient_id | Patient ID |
| calculate | patient_name | Patient Name |
| calculate | edd | EDD |
...
| begin group | group_review | Review |
| note | r_patient_info | \*\*${patient_name}\*\* ID: ${r_patient_id} |
| note | r_followup | Follow Up <i class="fa fa-flag"></i> |
| note | r_followup_note | ${r_followup_instructions} |
| end group| | |



## Accessing data from the contact-summary

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

As long as you have this new instance, you can then use XPath to access all values returned in `result.context`. This works without declaring in the instance which fields are needed, so it is a very flexible solution and easier to manage when building forms.

For example, a form field with `instance('contact-summary')/context/lineage[2]/name` as a calculation will get `lineage[2].name` from a contact-summary with the following code included in `contact-summary.js`:

```
...
context.lineage = lineage;
var result = {
  fields: fields,
  cards: cards,
  context: context
};
return result;
```

Note that you can pass a large object to the form, which can then read any value, but doing so does noticeably slow the loading of the form. Because of this it is preferable to remove from the context any fields that are not being used. It is a good idea to future proof by maintaining the same structure so that fields can be added without needing to modify existing form calculations.

## Creating additional docs from an xform

In version 2.13.0 and higher, you can configure your app forms to generate additional docs upon submission. You can create one or more docs using variations on the configuration described below. One case where this can be used is to register a newborn from a delivery report, as shown below. First, here is an overview of what you can do and how the configuration should look in XML:

### Extra docs

- Extra docs can be added by defining structures in the model with the attribute db-doc="true". **Note that you must have lower-case `true` in your XLSform, even though Excel will default to `TRUE`.**

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
