# Seeding Data With Medic-Conf

Ensure [medic-conf](https://github.com/medic/medic-conf) is installed and updated. 

### Using CSV Files on Google Drive

Create a new directory and add a new json file named `csvs-on-google-drive.json`. 

The keys should be the name of the CSV file stored locally, and for the value use the google id for the document. The name of the file must match what the file is generating a doc for. See the documentation [here](https://github.com/medic/medic-conf#csv-file-name) for naming files. 

```
{
    "person.clinic.csv":"google_drive_ID",
}
```

### Commands to Fetch and Upload Docs

Run command `medic-conf fetch-csvs-from-google-drive`. This will download the CSV files in the json document created above and place them into a folder named `csv`.

Running `medic-conf csv-to-docs` will convert the CSV into json docs for the webapp. They are placed in a `json_docs` folder

Lastly run `medic-conf --local upload-docs` to upload the converted docs into your local instance. `--local` can be replaced with an instance or URL. See [medic-conf](https://github.com/medic/medic-conf) for detailed instructions.

### Google Drive Authentication

Medic-conf leverages google authentication to access google drive. You will need to create a client_secrets file named `.gdrive.secrets.json` and place it in the same directory where you want the CSVs to be fetched. [Token Creation](https://developers.google.com/identity/protocols/OAuth2InstalledApp)

Create the `.gdrive.secrets.json` file by downloading the `client_secrets.json` from google. You will need a CLIENT_ID, CLIENT_SECRET and REDIRECT_URL. You can find these pieces of information by going to the Developer Console, clicking your project --> APIs & auth --> credentials --> Download JSON. This will download the credentials but will need modified to be in this structure. 

```

{
		"client_id": "<client_id>.apps.googleusercontent.com",
		"project_id": "proj_id",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://accounts.google.com/o/oauth2/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_secret": "client_secret",
		"redirect_uris": ["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
}

```

 See google's docs [here](https://github.com/googleapis/google-api-nodejs-client#oauth2-client) on Oauth2