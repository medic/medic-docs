# How To Manage Translations

The Medic Mobile webapp is localized so that users can use it in the language of their choice. It is currently available in English, French, Hindi, Nepali, Spanish, and Swahili. The goal of this doc is to help our team manage these and future translations.

## Overview
Like the rest of our code, the translation files live in our GitHub repo. These translation files are [properties](https://en.wikipedia.org/wiki/.properties) files, which are a series of keys and their corresponding values. We use the English file as our default, and as such contains all of the keys. If any key is missing from another language file the English value is used.

To collaboratively edit the translations we use POEditor.com. Translators can be given access to specific languages so that we can more effectively edit language text to be included in Medic Mobile. Once the text is ready it can be exported from POEditor to GitHub and included in the next release of our app. Note that "keys" in .properties files are referred to as "tags" in POEditor.

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

## Adding new terms
New labels (term and translation) should only be added to the English properties file in GitHub ([messages-en.properties](https://github.com/medic/medic-api/blob/develop/translations/messages-en.properties))

These should trigger the webhook to import the terms and translations to POEditor, but NOT overwrite existing translations. The webhook url is: `https://poeditor.com/api/webhooks/github?api_token=0b15994ba973ebe6dac5477e6f3bdbcf&id_project=33025&language=en&operation=import_terms_and_translations`

New terms can also be manually imported using "Get terms" or "Import translations from Github" [here](https://poeditor.com/github/projects). Using the manual approach some POEditor translations may be overwritten, so it is better to use the webhook that only imports new terms and translations.

## Modifying any existing translation text, including English
To be done *only* in [POEditor](https://poeditor.com/projects/po_edit?id_language=43&id=33025), followed by an export when ready.

## Modifying or Removing terms:
To be done *only* in [POEditor's terms page](https://poeditor.com/projects/view_terms?id=33025), followed by an export when ready.

## Export changes in POEditor to GitHub
Export "Translated" from POEditor to GitHub [here](https://poeditor.com/github/projects).
Do this for all languages that have been modified, then verify the [commits in GitHub](https://github.com/medic/medic-api/commits/develop?author=medic-translators
) to make sure only expected changes were made.