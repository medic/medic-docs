# How to revalidate an invalid report
You may encounter a dreaded case when reports coming in to a Medic Webapp instance have a red indicator instead of the green indicator.

![Invalid Reports](img/invalid_reports2.png)

This may be caused by:
- Missing forms in the `app_settings` config.
-Missing or incorrect fields in the input form. e.g Missing patient ID, or Patient ID with letters 
- Extra fields in the input form. This happens when you don't configure for some fields in the app_settings.json of the webapp
- Configuring some forms in the wrong section of the app_settings i.e `registrations` and `patient_reports`. Forms that don't have a patient_id field because it is generated afterwards, e.g ANCR, IMMR, go to the `registrations` section, while form that have a patient_id field e.g ANCP, ANCV, IMMV; go to the `patient_reports` section

# How to solve
To revalidate an invalid report, we need to clear the errors field on the doc (set it to []). Updating this field from Futon will not work and will result in an endless update process. The recommended way to do it is to download the doc, update it and then upload it. This will also for propagation and replication in couchdb.

To download a doc, use:
```
curl 'https://<username>:<password>@<instance>.app.medicmobile.org/medic/<doc id>' > filename.json
```
`filename.json` is the local file in your computer you have stored the doc json

Update filename.json: Set "errors" to [] and remove "accept_patient_reports" transition so that sentinel can revalidate the report.

Upload filename.json with:
```
curl -X PUT hhttps://<username>:<password>@<instance>.app.medicmobile.org/medic/<doc id> -d @filename.json --header "Content-Type: application/json"
```
