define('js/docs',[
    'jquery',
    'underscore',
    'handlebars',
    'couchr',
    'garden-app-support',
    'marked'
],
function($, _, handlebars, couchr, garden, marked){

    var exports = {},
        prefix = 'md';

    exports.init = function() {
        marked.setOptions({
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          langPrefix: 'language-',
          highlight: function(code, lang) {
            if (lang === 'js') {
              return highlighter.javascript(code);
            }
            return code;
          }
        });
    }

    exports.renderDoc = function() {
    };

    // avoid using DOM so browser does not fetch resources and display 404
    // errors
    function updateImages(path, html) {
        var p = path.replace(/\/[\w\.\-_]+$/, '/'), //chop last part of path
            re = /\s*src\s*=\s*["']([^"']+)/g, //find src attrs
            match;
        while ((match = re.exec(html)) !== null) {
            html = html.replace(match[1], p+match[1]);
        }
        return html;
    };

    function updateLinks(path, html) {
        // update relative links to include hash mark
        var re = /\s*href\s*=\s*["']([^"']+)/g;
        while ((match = re.exec(html)) !== null) {
            if (match[1].match(/^\s*http/)) continue;
            html = html.replace(match[1], '#/'+match[1]);
        }
        return html;
    };

    exports.renderDoc = function() {
        console.log('renderDoc',arguments);
        var args = Array.prototype.slice.call(arguments, 0);
        var path = args.length > 0 ? prefix+'/'+args.join('/') : 'md/index.md';
        couchr.get(path, function (err, resp) {
            var html = updateImages(path, marked(resp));
            html = updateLinks(path, html);
            $('#content').html(html);
        });
    }

    exports.routes = function() {
       return  {
           '/' : exports.renderDoc,
           '/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc
        }
    }

    return exports;

});
