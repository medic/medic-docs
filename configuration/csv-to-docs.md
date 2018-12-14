# Seeding Data With Medic-Conf

Ensure [medic-conf](https://github.com/medic/medic-conf) is installed and updated. 

## Using csv files on google drive
Create a new json file named `csvs-on-google-drive.json`. 

For the key add the name of the file locally and for the value use the google id for the document. The name of the file must match what the file is generating a doc for. 
```
{
    "person.clinic.csv":"google_drive_ID",
}
```

Run command `medic-conf fetch fetch-csvs-from-google-drive`. This will download the csv files in the json document created above and place them into a folder named `csv`.

Running `medic-conf csv-to-docs` will convert the csv into json docs for the webapp. They are placed in a `json_docs` folder

Lastly run `medic-conf --local upload-docs` to upload the converted docs into your local instance. `--local` can be replaced with an instance or URL. See [medic-conf](https://github.com/medic/medic-conf) for detailed instructions.