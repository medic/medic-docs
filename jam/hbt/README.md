require-hbt
===========

An AMD loader plugin for Handlebars templates.

Usage
-----

Suppose we have the following template at `templates/hello.handlebars`:

    Hello {{ name }}!

Then we can compile it like so:

    require(['hbt!templates/hello', function(template) {

        template({ name: 'World' }); // => 'Hello World!'

    });

Config
------

    require.config({
        hbt: {
            extension: 'handlebars'
        }
    });

Tests
-----

    cd test
    npm install
    node server.js

Visit `localhost:3000` to view test output.