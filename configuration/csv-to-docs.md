# Seeding Data With Medic-Conf

Ensure [medic-conf](https://github.com/medic/medic-conf) is installed and updated. 

### Using CSV Files on Google Drive
Create a new json file named `csvs-on-google-drive.json`. 

The key should be the name of the file stored locally, and for the value use the google id for the document. The name of the file must match what the file is generating a doc for. See the documentation [here](https://github.com/medic/medic-conf#csv-file-name) for naming files. 

```
{
    "person.clinic.csv":"google_drive_ID",
}
```

### Commands to Fetch and Upload Docs

Run command `medic-conf fetch fetch-csvs-from-google-drive`. This will download the CSV files in the json document created above and place them into a folder named `csv`.

Running `medic-conf csv-to-docs` will convert the CSV into json docs for the webapp. They are placed in a `json_docs` folder

Lastly run `medic-conf --local upload-docs` to upload the converted docs into your local instance. `--local` can be replaced with an instance or URL. See [medic-conf](https://github.com/medic/medic-conf) for detailed instructions.

### Google Drive Authentication

Medic-conf leverages google authentication to access google drive. You will need to create a client_secrets file named `.gdrive.secrets.json` and place it in the same directory where you want the CSVs to be fetched. [Token Creation](https://developers.google.com/identity/protocols/OAuth2InstalledApp)