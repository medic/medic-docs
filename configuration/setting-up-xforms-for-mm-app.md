## Setting up XForms in V2 (MM App)

```
Author: Samuel Mbuthia
Created on: 5th June, 2017
Last edit by: Samuel Mbuthia
Last edit on: 5th June, 2017
```

When creating a new MedicMobile App Project, the folder structure shown below is recommended;
```
+-- example-project/
|   +-- forms/
|   |   +-- person_create.xlsx
|   |   +-- person_create.xml
|   |   +-- person_create.json
|   |   +-- person_edit.xlsx
|   |   +-- person_edit.xml
|   |   +-- person_edit.json
|   |   +-- example_form.xlsx
|   |   +-- example_form.xml
|   |   +-- example_form.json
|   +-- icons/
|   +-- tasks/
|   |   +-- targets.json
|   |   +-- task-rules.js
|   |   +-- task-schedules.json
|   +-- scripts/
|   +-- postgres/
|   |   +-- impact/
|   |   +-- example_queries.sql
|   +-- app_settings.json
```
### Forms

- The forms folder contains all forms for the project. These could be pushed to the `medic-projects` GitHub repository 
as both xls (binary) and xml.

 #### Writing XForms

 - Refer to [xlsform](xlsform.org) for rules on writing xls forms. You could also look at `lg-uganda` project in `medic-projects` for examples of 
 xls forms.

### Scripts

- The scripts folder should contain all scripts relevant to the project.

- Any other special scripts that are specific to the project may also be included here. 

- In some cases, it may be convenient to have some scripts in the forms folder. In such a situation it is recommended that you 
add a `README` in the scripts folder referencing these scripts and indicating how to use them.

### Tasks

- Refer to [targets](https://github.com/medic/medic-docs/blob/master/configuration/targets.md)
- More on this to follow...



 ### Converting and uploading 

- `convert-setup.sh` is the script used to set up the environment variables for running a number of scripts.
The script takes the format shown below;

```
export XLSFORMS='example-form.xlsx'
export PYTHON=/usr/bin/python
export PYXFORM=$(realpath ~/medic/pyxform/pyxform/xls2xform.py)
export UPLOAD_SCRIPT=$(realpath ~/medic/medic-webapp/scripts/upload_xform.sh)
export UPLOADER=$UPLOAD_SCRIPT
export COUCH_URL='https://admin:<password>@example-project.app.medicmobile.org/medic'
``` 

- Be sure NOT to save this script with the instance password and only add the password while using the script.

- Use `source /path/to/convert-setup.sh` to load your environment variables for the project.

- Once you have written your xls forms and saved them in the forms folder, use the `convert.sh` script in `medic-projects/scripts/`
to convert and upload you form. i.e. `./convert.sh -uf 'example-form'`

- Note that for contact forms (people, clinic, and so on) you may need to use different scripts. You can look at lg-uganda project scripts 
`upload_add_person.sh`, `upload_add_clinic.sh` etc  for an idea of how to do this.


### Notes:

- Sometimes the form may fail to load once you have uploaded it. In one such scenario you may get an error that the user does not have an 
associated contact. In this case, be sure to add an associated contact for the user supposed to use the form.






