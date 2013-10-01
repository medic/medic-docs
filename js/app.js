define('js/app',[
    'jquery',
    'underscore',
    'handlebars',
    'couchr',
    'director',
    'events',
    'garden-app-support',
    'js/docs',
    'jam/bootstrap/js/bootstrap-dropdown.js'
],
function($, _, handlebars, couchr, director, events, garden, docs) {

    var exports = {},
        emitter = new events.EventEmitter(),
        routes = _.extend({}, docs.routes());

    var config = {
        notfound: function() {
            alert('Document not found.');
        }
    };

    /**
     * This is where you will put things you can do before the dom is loaded.
     */
    exports.init = function() {
        var opts = {selector: '.main', emitter: emitter};
        _.invoke([docs], 'init', opts);
    };


    /**
     * This that occur after the dom has loaded.
     */
    exports.on_dom_ready = function(){
        garden.get_garden_ctx(function(err, garden_ctx){
            //$('.main').append(index_t(garden_ctx));
            router = director.Router(routes).configure(config);
            router.init('/');
        });

        var opts = {};
        _.invoke([docs], 'onDOMReady', opts);

        /*
        couchr.get('_db/_all_docs', function (err, resp) {
            $('.main').append(list_t(resp));
        });
        */

    }


    return exports;
});
