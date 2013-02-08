define(function(require) {

    var Handlebars = require('handlebars');

    return {
        load: function(name, require, callback, config) {
            config || (config = {});
            config.hbt || (config.hbt = {});
            config.hbt.extension || (config.hbt.extension = 'handlebars');

            require(['text!' + name + '.' + config.hbt.extension], function(content) {
                var template = Handlebars.compile(content);
                callback(template);
            });
        }
    };

});