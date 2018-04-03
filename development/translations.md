# How To Manage Translations

The Medic Mobile webapp is localized so that users can use it in the language of their choice. It is currently available in English, French, Hindi, Nepali, Spanish, and Swahili. The goal of this doc is to help our team manage these and future translations.

## Overview
Like the rest of our code, the translation files live in our GitHub repo. These translation files are [properties](https://en.wikipedia.org/wiki/.properties) files, which are a series of keys and their corresponding values. We use the English file as our default, and as such contains the entire set of keys. If any key is missing from another language file the English value is used.

In order to collaboratively edit the translations we use POEditor.com. Translators can be given access to specific languages so that we can more effectively edit language text to be included in Medic Mobile. Once the text is ready it can be exported from POEditor to GitHub and included in the next release of our app.

Note that "keys" in .properties files are referred to as `terms` in POEditor.

## Adding new languages
New languages must be added and configured in several places:
- *In GitHub*
  - Create a new [medic-webapp/translations/messages-XX.properties](https://github.com/medic/medic-webapp/blob/master/translations/) file, replacing XX with the 2 or 3 letter language code.
  - Add the language to the [LOCAL_NAME_MAP in api](https://github.com/medic/medic-api/blob/master/translations.js#L10). Use the language code for the key, and the local name followed by the English name for the language in brackets, eg: "fr: 'Français (French)'".
  - Import the moment language pack in the [root app.js file](https://github.com/medic/medic-webapp/blob/master/static/js/app.js#L25). If moment doesn't provide the required language pack you may need to contribute it upstream to the moment library.
- *In POEditor*
  - In the [Medic Mobile project](https://poeditor.com/projects/view?id=33025), add the language
  - In the [GitHub integration page](https://poeditor.com/github/projects), link that language to the GitHub file
  - Add translations in POEditor
  - Export file from POEditor to GitHub, as described below

## Adding new keys

### Translating static text

All text in the app is internationalised.

- Pick a key.
  - First check if an appropriate key already exists in [messages-en.properties](https://github.com/medic/medic-webapp/blob/master/translations/messages-en.properties).
  - Otherwise create a new key and default English value. Keys must be all lower case, dot separated, and descriptive but not verbose. The values should include as much text as possible (eg: trailing punctuation), and must not contain any markup. Don't add any values for other languages as this will be done later in the POEditor app.
- Use the translation. In angular this is done using angular-translate, and ideally using the [translate directive](http://angular-translate.github.io/docs/#/guide/05_using-translate-directive) to reduce the number of watchers, eg: `<h3 translate>date.incorrect.title</h3>`.

Changes will trigger a [webhook](https://github.com/medic/medic-webapp/settings/hooks) to import the terms and translations to POEditor, but NOT overwrite existing translations. The webhook url is: `https://poeditor.com/api/webhooks/github?api_token=$api_token&id_project=33025&language=en&operation=import_terms_and_translations`. Replace `$api_token` with the API token you've been given. If you don't have an API token, please contact a Medic Mobile developer, product manager, or CTO. Please do not disclose this API token to anyone else.

New terms can also be manually imported using "Get terms" or "Import translations from Github" [here](https://poeditor.com/github/projects). Using the manual approach some POEditor translations may be overwritten, so it is better to use the webhook that only imports new terms and translations.

### Translating help pages

Because help pages are too large to manage easily through the standard translation mechanism, and we want to include lots of markup, help pages are translated by providing md documents for each language. This isn't yet up and running so ask for help.

### Translating configurations

Much of the app is configurable (eg: forms and schedules). Because the specifics of the configuration aren't known during development time these can't be provided via messages. Instead we allow configurers to provide a map of locale to value for each translated property. Then use the `translateFrom` filter to translate from the configured map using the user's language.

## Modifying any existing translation values
To be done *only* in [POEditor](https://poeditor.com/projects/po_edit?id_language=43&id=33025), followed by an export when ready. This applies to all languages, even English.

## Modifying or removing translation keys:
To be done *only* in [POEditor's terms page](https://poeditor.com/projects/view_terms?id=33025), followed by an export when ready.

## Exporting changes from POEditor to GitHub
Exporting from POEditor to GitHub can be done via https://poeditor.com/github/projects, but it is simpler to trigger the webhook for the language you wish to export. For example, the webhook for English labels is: `https://poeditor.com/api/webhooks/github?api_token=$api_token&id_project=33025&language=en&operation=export_terms_and_translations`.  Replace `$api_token` with the API token you've been given. If you don't have an API token, please contact a Medic Mobile developer, product manager, or CTO. Please do not disclose this API token to anyone else. Note that [according to POEditor](https://poeditor.com/help/how_to_use_the_github_webhook) the webhook *cannot* be triggered from within GitHub.

To export another language replace the value for `language` to the corresponding 2-letter language code and trigger the webhook. Do this for all languages that have been modified, then verify the [commits in GitHub](https://github.com/medic/medic-webapp/commits/master?author=medic-translators
) to make sure only expected changes were made.  To pull all languages at once use the po-editor-importer script [here](https://github.com/medic/medic-webapp/tree/master/scripts/po-editor-importer)
