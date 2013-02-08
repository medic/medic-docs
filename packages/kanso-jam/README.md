kanso-jam
=========

A kanso module to compile jam modules into a single resource.

## requirements

You must have jam installed globally and availble. eg:

```
npm install -g jamjs
```


## Setting Up

Add kanso-jam to your project depenencies

```json
"kanso-jam": {
    "kanso-jam": null
}
```

and install it

```
kanso install
```


## Usage

kanso jam only works with you add the --minify flag to your kanso push, for example

```
kanso push app --minify
```

It will take your jam/require.js file and compile and minify it and it will attach it to the design doc at the same location
so you do not have to change your script tags in anyway...easy!

## Extras

You probably will have extra scripts that you load up in your require that are not managed by jam. eg:

```
require(['js/app', 'domReady', 'jquery'], function (app, domReady) {
    app.init();
    domReady(app.on_dom_ready);
});
```

Where js/app.js is outside of jam.


If you want those included in the compile and minify step. Add the following config section to kanso.json

```
    "jam" : {
        "include" : "js/app"
    },
```


