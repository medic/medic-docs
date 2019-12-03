# Seeding data with medic-conf

Users, contacts, and report data can be specified in comma-separated value (CSV) files, then converted to JSON and uploaded into your instance using [medic-conf](https://github.com/medic/medic-conf). This documentation will cover how to the CSV notation needed, fetching CSV files from Google Sheets, converting the CSV files into JSON docs, and then uploading the data from the JSON files to your instance.

## Converting CSVs

Running medic-conf with the `csv-to-docs` action converts CSV files from the `csv` folder into JSON docs for the webapp. The JSON files are stored in the `json_docs` folder. Instructions for creating the CSV files are in sections below.

## Uploading CSVs

Running medic-conf with the `upload-docs` action will upload to the webapp the JSON docs that were generated from the CSV files. For example, running `medic-conf --local upload-docs` will upload the converted docs into your local instance. The target location `--local` can be replaced with an instance or URL. See [medic-conf](https://github.com/medic/medic-conf) for detailed instructions.


## Creating CSV files for Contacts, Reports

A separate CSV file is needed for each type of place, person, or report in your project's local `csv` folder. The name of the file determines the type of doc created for rows contained in the file. The possible types are: `report`, `person`, and `place`. Each of these has a further specifier provided in the filename:
- `place.{place_type}.csv`:  where `{place_type}` is the type of place specified in the file. By default, the place types are one of `clinic`, `health_center`, or `district_hospital`. As of 3.7 of the [Core Framework](https://github.com/medic/cht-core), the number of place types and their names can be configured — the `{place_type}` should match with the hierarchy names used.
- `person.{parent_place_type}.csv`:  where `{parent_place_type}` is the type of place to which the people in the file will belong.
- `report.{form_id}.csv`:  where `{form_id}` is the form ID for all the reports in the file. You will need one file per form ID

Here are some examples:
- File named `place.district_hospital.csv` adds the property `"type":"district_hospital"`
- File named `person.clinic.csv` add the property `"type":"person"`
- File named `report.immunization_visit.csv` add the property `"type":"report", "form":"immunization_visit"`

In each of these files a header row is used to specify the JSON field names, and each subsequent row specifies the corresponding values for a doc. A `_id` field is automatically generated with a universally unique identifier.

Here is an example of a `csv/person.clinic.csv` file for people belonging to clinics:

| name | sex | date_of_birth |
| --------------------- | --------------------- | --------------------- |
| Adriana Akiyama | female | 1985-12-31
| Becky Backlund | female | 1987-10-17
| Carson Crane | male | 2015-01-23

Converting that CSV file to JSON docs with the `csv-to-docs` action would generate three files, one for each person. Here is one of the corresponding JSON files, `json_docs/dbfbc0f0-117a-59ec-9542-3313fb10ef25.doc.json`, which was created from the CSV data above:

```json
{
  "type": "person",
  "name": "Adriana Akiyama",
  "sex": "female",
  "date_of_birth": "1985-12-31",
  "_id": "dbfbc0f0-117a-59ec-9542-3313fb10ef25"
}
```

### Special notations

#### Specifying property type

By default, values are parsed as strings. To parse a CSV column as a JSON type, append a data type to the column definition, e.g.

	column_one,column_two:bool,column_three:int,column_four:float,column_five:date,column_six:timestamp

This would create a structure such as:

```json
{
	"_id": "09efb53f-9cd8-524c-9dfd-f62c242f1817",
	"column_one": "some string",
	"column_two": true,
	"column_three": 1,
	"column_four": 2.3,
	"column_five": "2017-12-31T00:00:00.000Z",
	"column_six": 1513255007072
}
```

#### Excluding column

A special JSON type, `excluded`, is used for excluding a column from the final JSON data:

	my_column_that_will_not_be_a_property:excluded

This can be useful if using a column for doc references.

#### Including another doc

Often times database documents need to include or refer to other documents in the database. This can be achieved with queries across CSV files, which is done by specifying a query in the column header. The query specifies the doc type (`person` or `place`) and matching condition.

For instance, to include the parent district's doc in a health center's doc, the `parent:place WHERE reference_id=COL_VAL` column header is used. The `COL_VAL` is a special notation for that column's value for the row, and it will be used to match against the `reference_id` field in all other places. Given these example CSVs, you can see the corresponding JSON structure:

**`place.district.csv`:**

| reference_id:excluded | is_name_generated | name | reported_date:timestamp |
| --------------------- | ----------------- | ---- | ----------------------- |
| district_1            | false             | D1   | 1544031155715           |
| district_2            | false             | D2   | 1544031155715           |
| district_3            | false             | D3   | 1544031155715           |

**`place.health_center.csv`:**

| reference_id:excluded | parent:place WHERE reference_id=COL_VAL | is_name_generated | name | reported_date:timestamp |
| --------------------- | --------------------------------------- | ----------------- | ---- | ----------------------- |
| health_center_1       | district_1                              | false             | HC1  |  1544031155715           |
| health_center_2       | district_2                              | false             | HC2  |  1544031155715           |
| health_center_3       | district_3                              | false             | HC3  |  1544031155715           |

**`480d0cd0-c021-5d55-8c63-d86576d592fc.doc.json`**:

```json
{
  "type": "health_center",
  "parent": {
    "type": "district_hospital",
    "parent": "",
    "is_name_generated": "false",
    "name": "D2",
    "external_id": "",
    "notes": "",
    "geolocation": "",
    "reported_date": 1544031155715,
    "_id": "f223f240-5d6a-5a7a-91d4-46d3c59de73e"
  },
  "is_name_generated": "false",
  "name": "HC7",
  "external_id": "",
  "notes": "",
  "geolocation": "",
  "reported_date": 1544031155715,
  "_id": "480d0cd0-c021-5d55-8c63-d86576d592fc"
}
```

#### Including value from another doc

Similar to including another doc, it is also possible to get the value of a specific field in another doc. For instance, if `parent:GET _id OF place WHERE reference_id=COL_VAL` were used in the example above, the `parent` field's value would have been set to the `_id` of the refered to doc instead of including the whole doc. Note that `_id` is a generated value included in all generated docs.

| reference_id:excluded | parent:GET _id OF place WHERE reference_id=COL_VAL | is_name_generated | name | reported_date:timestamp |
| --------------------- | -------------------------------------------------- | ----------------- | ---- | ----------------------- |
| health_center_1       | district_1                                         | false             | HC1  | 1544031155715           |
| health_center_2       | district_2                                         | false             | HC2  | 1544031155715           |
| health_center_3       | district_3                                         | false             | HC3  | 1544031155715           |

The resulting doc would be as follows, with the `_id` from `district_1` as the `parent` value:

```json
{
  "type": "health_center",
  "parent": "0c31056a-3a80-54dd-b136-46145d451a66",
  "is_name_generated": "false",
  "name": "HC3",
  "external_id": "",
  "notes": "",
  "geolocation": "",
  "reported_date": 1544031155715,
  "_id": "45293356-353c-5eb1-9a41-baa3427b4f69"
}
```

## Creating CSV files for users

To create user accounts from CSV files, a `users.csv` file will be needed in the `csv` folder. The `users.csv` file requires columns for `username` and `password`. Additional columns can be used for any additional fields needed on the user's doc, for example `roles`, `phone`. Running the `csv-to-docs` `upload-docs` `create-users` actions in that order will generate the necessary JSON docs with a `users.csv` file in your working directory, and then create the people, places, and users.

The following sections describe the different ways to associate the new users to contacts. 

### Creating new users with existing contacts

When creating users that are associated to existing contacts, `contact` and `place` columns should be created. Each row should have the UUID of an existing person for `contact`, and an existing place for `place`.

### Creating new users with new contacts

To create new contacts for each new user provide values for `contact.name`, `place.name`, and `place.parent` (can be existing place), as seen in this example CSV:

```csv
username,password,roles,name,phone,contact.name,place.c_prop,place.type,place.name,place.parent
alice,Secret_1,district-admin,Alice Example,+123456789,Alice,p_val_a,health_center,alice area, district_uuid
bob,Secret_1,district-admin,bob Example,+123456789,bob,p_val_a,health_center,bob area,disctrict_uuid
```

The `username`, `password`, `contact.name`, `place.type`, `place.name` columns are required to have functional users with new places.

### Creating new users linked to contacts in CSV files

To associate the new users to contacts that will also be created with the `csv-to-docs` action, use reference queries to the contacts.
For instance, the column header for the person would be `contact:person WHERE reference_id=COL_VAL`, and for the place would be `place:GET _id OF place WHERE reference_id=COL_VAL`.

Here is a example of how the three CSV files need to be configured to setup a user linked to existing place and contact.

**`csv/place.health_center.csv`:**

```csv
reference_id:excluded,parent:place WHERE reference_id=COL_VAL,is_name_generated,name,reported_date:timestamp
health_center_1,district_1,FALSE,HC1,1544031155715
```
Generated JSON doc for the health center:
```json
{
  "type": "health_center",
  "parent": {
    "type": "district_hospital",
    "parent": "",
    "is_name_generated": "false",
    "name": "District1",
    "external_id": "",
    "notes": "",
    "geolocation": "",
    "reported_date": 1544031155715,
    "_id": "e8f9739a-5d37-5b1e-be3c-a571b2c2409b"
  },
  "is_name_generated": "FALSE",
  "name": "HC1",
  "reported_date": 1544031155715,
  "_id": "8606a91a-f454-56e3-a089-0b686af3c6b7"
}
```

**`csv/person.csv`:**

```csv
reference_id:excluded,parent:place WHERE reference_id=COL_VAL,name,phone,sex,role,reported_date,patient_id
p_hc1,health_center_1,Bob Johnson 1,+16143291527,male,manager,1552494835669,60951
p_hc2,health_center_1,Bob Johnson 2,+16143291528,male,manager,1552494835669,60951

```
Generated JSON doc for the person:
```json
{
  "type": "person",
  "parent": {
    "type": "health_center",
    "parent": {
      "type": "district_hospital",
      "parent": "",
      "is_name_generated": "false",
      "name": "District1",
      "external_id": "",
      "notes": "",
      "geolocation": "",
      "reported_date": 1544031155715,
      "_id": "e8f9739a-5d37-5b1e-be3c-a571b2c2409b"
    },
    "is_name_generated": "FALSE",
    "name": "HC1",
    "reported_date": 1544031155715,
    "_id": "8606a91a-f454-56e3-a089-0b686af3c6b7"
  },
  "name": "Bob Johnson 1",
  "phone": "+16143291527",
  "sex": "male",
  "role": "manager",
  "reported_date": "1552494835669",
  "patient_id": "60951",
  "_id": "65c52076-84c5-53a2-baca-88e6ec6e0875"
}

```

**`csv/users.csv`**:
```csv
username,password,roles,phone,contact:person WHERE reference_id=COL_VAL,place:GET _id OF place WHERE reference_id=COL_VAL
ac1,Secret_1,district_admin:red1,+123456789,p_hc1,health_center_1
ac2,Secret_1,district_admin:supervisor,+123456789,p_hc2,health_center_1
ac3,Secret_1,district_admin,+123456789,p_hc3,health_center_1
ac4,Secret_1,district_admin,+123456789,p_hc4,health_center_1

```

This will generate the `users.csv` file in the working directory which is used by the `create-users` action. The contact and place fields should be resolved to the actual UUIDs.

```csv
p_hc1"username","password","roles","contact","phone","place"
"ac1","Secret_1","district_admin:red1","65c52076-84c5-53a2-baca-88e6ec6e0875","+123456789","8606a91a-f454-56e3-a089-0b686af3c6b7"
"ac2","Secret_1","district_admin:supervisor","b7d0dbd5-beeb-52a8-8e4c-513d0baece8e","+123456789","8606a91a-f454-56e3-a089-0b686af3c6b7"
```


## Using CSV files on Google Drive

In your project home directory create a new json file named `csvs-on-google-drive.json`. 

The keys must be the filename where the CSV will be stored locally — see the CSV [file documentation](https://github.com/medic/medic-conf#csv-file-name) for the notation. The value of each key must be the ID of the corresponding file in Google Drive — the ID can be obtained from the URL eg `https://docs.google.com/spreadsheets/d/{FILE_ID}/edit`. 

```json
{
    "person.clinic.csv":"google_drive_ID",
}
```

To fetch the files from Google Drive run the command `medic-conf fetch-csvs-from-google-drive`. This will download the CSV files in the json document created above and place them into a folder named `csv`.

### Google Drive authentication

Medic-conf leverages Google authentication to access Google Drive. You will need to create a client_secrets file named `.gdrive.secrets.json` and place it in your working directory, and [create a token](https://developers.google.com/identity/protocols/OAuth2InstalledApp).

Create the `.gdrive.secrets.json` file by downloading the `client_secrets.json` from Google. You will need a CLIENT_ID, CLIENT_SECRET and REDIRECT_URL. You can find these pieces of information by going to the Developer Console, clicking your project --> APIs & auth --> credentials --> Download JSON. This will download the credentials but will need modified to be in this structure. 

```json
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

 See Google's docs [here](https://github.com/googleapis/google-api-nodejs-client#oauth2-client) on Oauth2
