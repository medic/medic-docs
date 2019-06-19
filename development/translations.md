# How To Manage Translations

The Medic Mobile webapp is localized so that users can use it in the language of their choice. It is currently available in English, French, Hindi, Nepali, Spanish, and Swahili. The goal of this doc is to help our team manage these and future translations.

## Overview
Like the rest of our code, the translation files live in our GitHub repo. These translation files are [properties](https://en.wikipedia.org/wiki/.properties) files, which are a series of keys and their corresponding values. We use the English file as our default, and as such contains the entire set of keys. If any key is missing from another language file the English value is used.

In order to collaboratively edit the translations we use POEditor.com. Translators can be given access to specific languages so that we can more effectively edit language text to be included in Medic Mobile. Once the text is ready it can be exported from POEditor to GitHub and included in the next release of our app.

Note that "keys" in .properties files are referred to as `terms` in POEditor.

## Adding new languages
New languages must be added and configured in several places:
- *In GitHub*
  - Create a new [medic/translations/messages-XX.properties](https://github.com/medic/medic/blob/master/translations/) file, replacing XX with the 2 or 3 letter language code.
  - Add the language to the [LOCAL_NAME_MAP in api](https://github.com/medic/medic-api/blob/master/translations.js#L10). Use the language code for the key, and the local name followed by the English name for the language in brackets, eg: "fr: 'Français (French)'".
  - Import the moment language pack in the [root app.js file](https://github.com/medic/medic/blob/master/static/js/app.js#L25). If moment doesn't provide the required language pack you may need to contribute it upstream to the moment library.
- *In POEditor*
  - In the [Medic Mobile project](https://poeditor.com/projects/view?id=33025), add the language
  - Add translations for a new language in the POEditor app
  - Export file from POEditor to GitHub, as described below


## Adding new keys
In order to trace the addition of new terms and also updates to existing translations,
the default translation file (messages-en.properties) must be updated directly.
Our GitHub repo provides with a [command line tool (CLI)](https://github.com/medic/medic/tree/master/scripts/poe) to
import updates into the POEditor app.
If you don't have an API token, please contact a Medic Mobile developer, product manager, or CTO. Please do not disclose this API token to anyone else.

### Translating static text

All text in the app is internationalised.

- Pick a key.
  - First check if an appropriate key already exists in messages-en.properties (medic/config/standard/translations).
  - Otherwise create a new key and default English value. Keys must be all lower case, dot separated, and descriptive but not verbose. The values should include as much text as possible (eg: trailing punctuation), and must not contain any markup. Don't add any values for other languages as this will be done later in the POEditor app.
- Use the translation. In angular this is done using angular-translate, and ideally using the [translate directive](http://angular-translate.github.io/docs/#/guide/05_using-translate-directive) to reduce the number of watchers, eg: `<h3 translate>date.incorrect.title</h3>`.

### Translating help pages

Because help pages are too large to manage easily through the standard translation mechanism, and we want to include lots of markup, help pages are translated by providing md documents for each language. This isn't yet up and running so ask for help.

### Translating configurations

Much of the app is configurable (eg: forms and schedules). Because the specifics of the configuration aren't known during development time these can't be provided via messages. Instead we allow configurers to provide a map of locale to value for each translated property. Then use the `translateFrom` filter to translate from the configured map using the user's language.

## Modifying any existing translation values
To be done *only* by updating messages-en.properties, importing to POEditor through the CLI tool and updating the other language translations through the POEditor app.

## Modifying or removing translation keys:
To be done *only* by updating messages-en.properties and importing to POEditor through the CLI tool.

## Exporting changes from POEditor to GitHub
To be done *only* by exporting all translations through the CLI tool.
If you don't have an API token, please contact a Medic Mobile developer, product manager, or CTO. Please do not disclose this API token to anyone else.
