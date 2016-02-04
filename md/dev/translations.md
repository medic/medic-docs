# How To Manage Translations

The Medic Mobile webapp is localized so that users can use it in the language of their choice. It is currently available in English, French, Hindi, Nepali, Spanish, and Swahili. The goal of this doc is to help our team manage these and future translations.

## Overview
Like the rest of our code, the translation files live in our GitHub repo. These translation files are [properties](https://en.wikipedia.org/wiki/.properties) files, which are a series of keys and their corresponding values. We use the English file as our default, and as such contains the entire set of keys. If any key is missing from another language file the English value is used.

In order to collaboratively edit the translations we use POEditor.com. Translators can be given access to specific languages so that we can more effectively edit language text to be included in Medic Mobile. Once the text is ready it can be exported from POEditor to GitHub and included in the next release of our app.

Note that "keys" in .properties files are referred to as `terms` in POEditor.

## Adding new languages
New languages must be added and configured in several places:
- *In GitHub*
  - Create a new [medic-api/translations/messages-XX.properties](https://github.com/medic/medic-api/blob/develop/translations/) file, replacing XX with the 2 or 3 letter language code.
  - Add language to the default languages in [medic-webapp/kanso.json](https://github.com/medic/medic-webapp/blob/develop/kanso.json) (eg Hindi [added here](https://github.com/medic/medic-webapp/commit/2addeef48db0e949988bddbfdb006c319d5771e2))
  - Add language to the default app settings (eg for ANC, add it to locales [here](https://github.com/medic/medic-data/blob/master/data/generic-anc/diy/app-settings.json))
- *In POEditor*
  - In the [Medic Mobile project](https://poeditor.com/projects/view?id=33025), add the language
  - In the [GitHub integration page](https://poeditor.com/github/projects), link that language to the GitHub file
  - Add translations in POEditor
  - Export file from POEditor to GitHub, as described below

## Adding new keys

### Translating static text

All text in the app is internationalised.

- Pick a key.
  - First check if an appropriate key already exists in [messages-en.properties](https://github.com/medic/medic-api/blob/develop/translations/messages-en.properties).
  - Otherwise create a new key and default English value. Keys must be all lower case, dot separated, and descriptive but not verbose. The values should include as much text as possible (eg: trailing punctuation), and must not contain any markup. Don't add any values for other languages as this will be done later in the POEditor app.
- Use the translation. In angular this is done using angular-translate, and ideally using the [translate directive](http://angular-translate.github.io/docs/#/guide/05_using-translate-directive) to reduce the number of watchers.

Changes will trigger a [webhook](https://github.com/medic/medic-api/settings/hooks) to import the terms and translations to POEditor, but NOT overwrite existing translations. The webhook url is: `https://poeditor.com/api/webhooks/github?api_token=$api_token&id_project=33025&language=en&operation=import_terms_and_translations`. Replace `$api_token` with the API token you've been given. If you don't have an API token, please contact a Medic Mobile developer, product manager, or CTO. Please do not disclose this API token to anyone else.

New terms can also be manually imported using "Get terms" or "Import translations from Github" [here](https://poeditor.com/github/projects). Using the manual approach some POEditor translations may be overwritten, so it is better to use the webhook that only imports new terms and translations.

### Translating help pages

This is done by providing md documents for each language, which isn't yet up and running. Ask for help.

### Translating configurations

Much of the app is configurable (eg: forms and schedules). Because the specifics of the configuration aren't known during development time these can't be provided via messages. Instead we allow configurers to provide a map of locale to value for each translated property. Then use the `translateFrom` filter to translate from the configured map using the user's language.

## Modifying any existing translation values
To be done *only* in [POEditor](https://poeditor.com/projects/po_edit?id_language=43&id=33025), followed by an export when ready. This applies to all languages, even English.

## Modifying or removing translation keys:
To be done *only* in [POEditor's terms page](https://poeditor.com/projects/view_terms?id=33025), followed by an export when ready.

## Exporting changes from POEditor to GitHub
Export "Translated" from POEditor to GitHub [here](https://poeditor.com/github/projects).
Do this for all languages that have been modified, then verify the [commits in GitHub](https://github.com/medic/medic-api/commits/develop?author=medic-translators
) to make sure only expected changes were made.
