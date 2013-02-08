var jam = {
    "packages": [
        {
            "name": "bootstrap",
            "location": "jam/bootstrap"
        },
        {
            "name": "couchr",
            "location": "jam/couchr",
            "main": "couchr-browser.js"
        },
        {
            "name": "director",
            "location": "jam/director",
            "main": "director.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "events",
            "location": "jam/events",
            "main": "events.js"
        },
        {
            "name": "garden-app-support",
            "location": "jam/garden-app-support",
            "main": "garden-app-support.js"
        },
        {
            "name": "handlebars",
            "location": "jam/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "hbt",
            "location": "jam/hbt",
            "main": "hbt.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "marked",
            "location": "jam/marked",
            "main": "./lib/marked.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        }
    ],
    "version": "0.2.13",
    "shim": {
        "director": {
            "exports": "Router"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "bootstrap",
            "location": "jam/bootstrap"
        },
        {
            "name": "couchr",
            "location": "jam/couchr",
            "main": "couchr-browser.js"
        },
        {
            "name": "director",
            "location": "jam/director",
            "main": "director.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "events",
            "location": "jam/events",
            "main": "events.js"
        },
        {
            "name": "garden-app-support",
            "location": "jam/garden-app-support",
            "main": "garden-app-support.js"
        },
        {
            "name": "handlebars",
            "location": "jam/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "hbt",
            "location": "jam/hbt",
            "main": "hbt.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "marked",
            "location": "jam/marked",
            "main": "./lib/marked.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        }
    ],
    "shim": {
        "director": {
            "exports": "Router"
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "bootstrap",
            "location": "jam/bootstrap"
        },
        {
            "name": "couchr",
            "location": "jam/couchr",
            "main": "couchr-browser.js"
        },
        {
            "name": "director",
            "location": "jam/director",
            "main": "director.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "events",
            "location": "jam/events",
            "main": "events.js"
        },
        {
            "name": "garden-app-support",
            "location": "jam/garden-app-support",
            "main": "garden-app-support.js"
        },
        {
            "name": "handlebars",
            "location": "jam/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "hbt",
            "location": "jam/hbt",
            "main": "hbt.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "marked",
            "location": "jam/marked",
            "main": "./lib/marked.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        }
    ],
    "shim": {
        "director": {
            "exports": "Router"
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}