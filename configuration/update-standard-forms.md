This guide is intended to help anyone updating Collect forms for the Standard config. A similar procedure applies for updating App and Contact forms, so instructions for those are included as well. These steps use [`medic-conf`](https://github.com/medic/medic-conf) so you must first have it installed. Once you have it installed, navigate to your folder with the Medic Mobile configuration.
```
cd {path-to-medic-webapp}/config/standard
```

Standard forms are created as Google Sheets to make collaborative translations easier to manage. These XLSForm files are stored in a Google Drive folder [here](https://drive.google.com/drive/folders/0B49l2yegOFn7czYtZU1ncGEzYkU), and exported as XLS files using `medic-conf`. The files to download are listed in [forms-on-google-drive.json](https://github.com/medic/medic-webapp/blob/master/config/standard/forms-on-google-drive.json).  Use the `fetch-forms-from-google-drive` action in medic-conf to get the forms, then follow the instructions to authenticate accordingly.

```
medic-conf fetch-forms-from-google-drive
```

Once downloaded `medic-conf` is used again to convert the new XLSX files into XML files, which can be uploaded to Medic Mobile instances. You can use all of the convert actions, or just the one needed for the forms that changed.

```
medic-conf convert-collect-forms convert-app-forms convert-contact-forms
```

It is good practice to commit the XML and XLSX files together for any form where more than just the version number changed in the XML.

If a new Collect build is needed, the XML files must be copied to [`medic-projects/tree/master/_medic-collect-flavors/standard/assets/forms`](https://github.com/medic/medic-projects/tree/master/_medic-collect-flavors/standard/assets/forms) before the new build is made.
