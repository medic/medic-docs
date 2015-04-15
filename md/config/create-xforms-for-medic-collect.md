Creating XForms for Medic Collect
======================================

This guide explains how to create forms for Medic Collect.

Forms used in Medic Collect are defined as XML files using the XForms format. XForms files can be created [manually](https://opendatakit.org/help/form-design/), or from specially formatted Excel files called [XLSForm](http://xlsform.org/). Below are the instructions for creating compatible Medic Collect forms using both methods.

Manual
----
We need to manually add the prefix and delimiter to the xml. This is done where the form id is declared. For example, the following:
```
<instance>
   <data id="myform" >
   ...
```

becomes:
```
<instance>
   <data id="myform" prefix="J1!FORM_CODE!" delimiter="#">
   ...
```

Note that `FORM_CODE` should be replaced with the form code as defined in the json-forms version of the form. If the form code is `ABCD` the prefix value would be `J1!ABCD!`, resulting in `prefix="J1!ABCD!"`. In case you are curious, the `J1` lets the Medic Mobile server know that the JavaRosa parser should be used on the incoming SMS.

XForms
----
If using a [XLSForm](http://xlsform.org/) you can use Medic's [pyxforms](https://github.com/medic/pyxform) converter to make these changes automatically. The resulting XML file is ready to use in Medic Collect. You can override the default prefix and separator by declaring `sms_keyword` and `sms_seperator` respectively in the Settings tab.
