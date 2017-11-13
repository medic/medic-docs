## Setting up XForms in V2 (MM App)

```
Author: Samuel Mbuthia
Created on: 5th June, 2017
Last edit by: Bill Wambua
Last edit on: 13th October, 2017
```

When creating a new MedicMobile App Project, this [folder structure](https://github.com/medic/medic-conf#project-layout) on `medic-conf` is recommended;

### Forms

- The forms folder contains all forms for the project. These could be pushed to the `medic-projects` GitHub repository 
as both xls (binary) and xml.

 #### Writing XForms

 - Refer to [xlsform](xlsform.org) for rules on writing xls forms. You could also look at `lg-uganda` project in `medic-projects` for examples of 
 xls forms.

### Scripts

- The scripts folder is an extra folder to the project structure you can add. It should contain all scripts relevant to the project.

- Any other special scripts that are specific to the project may also be included here. 

- In some cases, it may be convenient to have some scripts in the forms folder. In such a situation it is recommended that you 
add a `README` in the scripts folder referencing these scripts and indicating how to use them.

### Tasks

- Refer to [targets](https://github.com/medic/medic-docs/blob/master/configuration/targets.md)
- More on this to follow...



 ### Converting and uploading 

- Install and use [Medic-Configurer] to upload the XForms.


### Notes:

- Sometimes the form may fail to load once you have uploaded it. In one such scenario you may get an error that the user does not have an 
associated contact. In this case, be sure to add an associated contact for the user supposed to use the form.






