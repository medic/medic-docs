### Installing a Standard Project
#### Dependencies 
1. latest npm version  
2. medic-conf version corresponding to `package.json`

#### Installation  
1. Create a folder for the project in `medic-projects`
The folder for the project should follow the format: {partner-name}-{country-code}

2. Create a child settings file referencing standard config. [Example](https://github.com/medic/medic-projects/blob/master/padhar-in/settings.inherit.json)
``` 
{
 "inherit": "./node_modules/medic/config/standard",
 "replace": {
   "locale_outgoing": "hi",
   "default_country_code": "91",
   "gateway_number": "+91*****",
   "district_admins_access_unallocated_messages": true
 },
 "merge": {
 },
 "delete": [
   "_id"
 ],
 "filter": {
   "forms": [
     "N",
     "P",
     "V",
     "D",
     "F",
     "OFF",
     "ON"
   ]
 }
}
``` 

In "filter" include only the JSON forms used for your use cases. Most of the changes you’ll make should be in the "replace" section where you get to override the standard default settings. Here are common ones to override:

| Field   |    Meaning      | 
|----------|:-------------:| 
| locale_outgoing |  language code for outgoing SMS messages |
| default_country_code |  country phone code, as per [this](https://en.wikipedia.org/wiki/List_of_country_calling_codes) |
| gateway_number | can be set later, but better to include early on |
| district_admins_access_unallocated_messages | set to true if you want users to see all messages from unknown numbers, like those from the gateway | 

3. Copy [package.json](https://github.com/medic/medic/blob/master/config/standard/package.json) and [package-lock.json](https://github.com/medic/medic/blob/master/config/standard/package-lock.json) to the {partner-name}-{country-code} directory

4. Compile `app_settings` for that project: 
`medic-conf compile-app-settings`

	_Make sure that the app-settings is compiled without any error_

5. Commit your changes to GitHub

6. Upload config to the new instance
`medic-conf --instance={project-url-prefix}` 
It will run the following:
     - compile-app-settings
     - backup-app-settings
     - upload-app-settings
     - convert-app-forms
     - convert-collect-forms
     - convert-contact-forms
     - backup-all-forms
     - delete-all-forms
     - upload-app-forms
     - upload-collect-forms
     - upload-contact-forms
     - upload-resources
     - upload-custom-translations
     - csv-to-docs
     - upload-docs

    A quicker upload would be:
`medic-conf --instance={project-url-prefix} compile-app-settings backup-app-settings upload-app-settings backup-all-forms delete-all-forms upload-app-forms upload-collect-forms upload-contact-forms upload-resources upload-custom-translations`

7. Delete unused app forms from instance: 
    You can delete forms that are not needed for that deployment. This is helpful to a) make it easier for those using Collect to avoid downloading forms they won’t use, and b) avoid showing app forms in the forms filter in the Reports tab.

    Remove app forms for PNC:
`medic-conf --instance={project-url-prefix} delete-forms -- postnatal_visit`

    Remove app forms for Immunization:
`medic-conf --instance={project-url-prefix} delete-forms -- immunization_visit`

    Remove Collect PNC forms:
`medic-conf --instance={project-url-prefix} delete-forms -- m`

    Remove Collect IMM forms:
`medic-conf --instance={project-url-prefix} delete-forms -- child imm`

8. Sanity checks: click through all tabs, and submit forms, etc.  

#### Troubleshooting 
1. If you get following error:
 `ENOENT: no such file or directory, open '<path-to-project-directory>\node_modules\medic\config\standard\app_settings.json'` 
Solution: Try exectuing `npm install`.

2. If you get following error:
`'xls2xform-medic' is not recognized as an internal or external command..`
Solution: Install  [pyxform](https://github.com/medic/pyxform) 

3. If you get following error: 
`npm ERR! /usr/bin/git ls-remote -h -t ssh://git@github.com/medic/medic.git`
`npm ERR! git@github.com: Permission denied (publickey).`
Solution: Add your [SSH key to github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)
