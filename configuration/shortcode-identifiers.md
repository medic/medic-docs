# Shortcode identifier configuration

Shortcodes used for SMS messaging are generated on `doc.patient_id` against any document of `type` `person`. By default, these shortcodes start at 5 numberic digits long, and will increase in length as deemed necessary by the generation algorithm.

If the length is increased, this increase is stored in a CouchDB documented called `shortcode-id-length`:

```json
{
    "_id": "shortcode-id-length",
    "current_length": 6
}
```

## Configuring a minimum length

If you wish to change the minimum length to of ids to generate, create or edit the `shortcode-id-length` document in CouchDB. For example, if you wish for the minimum length to be 7:

```json
{
    "_id": "shortcode-id-length",
    "current_length": 7
}
```

NB: If this file already exists be sure to include the existing `_rev` property.

## Configuring a maximum length, locking down an exact length etc

It is not possible to either alter the maximum length of ids, to stop it automatically increasing or to tweak when it decides to automatically increase. IDs automatically increasing in length when required is important to the continual correct functioning of Sentinel.

## Valid sizes

Shortcodes can be between 5 and 13 digits long. Due to the last digit being a checksum digit, there are at most 10,000 5 digit ids, and at most ~61,000,000,000 13 digit ids.
