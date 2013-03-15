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
        prefix = 'md',
        settings = null;

    var getSettings = function(cb) {
        if (settings) return cb(null, settings);
        couchr.get('_db/_design/kujua-docs', function (err, resp) {
            if (err) return cb(err);
            settings = resp.kanso;
            cb(null, settings);
        });
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

    //setup title
    //var title = $('#docs-body h1:first-child').text();

    // setup controls
    //$('.page-header .controls').hide();

    function renderTOC(html) {
        // render TOC unless no sub headers
        if ($('#docs-body h2').get(0)) {
          var ul = $('<ul/>');
          $('#docs-body h2, #docs-body h3').each(function(idx, el) {
            var header = $(el),
                title = header.text(),
                id = header.attr('id');
            if (el.tagName === 'H2') {
              ul.append(
                $('<li/>').append(
                  $('<a/>').attr('href', '#'+id).text(title)));
            } else {
              ul.append(
                $('<li class="subhead"/>').append(
                  $('<a/>').attr('href', '#'+id).text(title)));
            }
          });
          $('.sections').append(ul);
          $('.sections').show();
        } else {
          $('.sections').hide();
        }
    };

    function makeImagesZoomable() {
        // make large images zoomable
        $('#docs-body img').each(function(idx, el) {
            var t =  $("<img/>"),
                width = 0,
                height = 0;
            t.attr("src", $(el).attr("src"));
            t.load(function() {
                width = this.width;
                height = this.height;
                $(el).parent().addClass('images');
                if (width > 960) {
                  $(el).parent().addClass('zoom');
                  $(el).parent().bind('click', function() {
                    var p = $(this);
                    if (p.attr('style')) {
                      p.attr('style',null);
                    } else {
                      p.css({'width': width});
                    }
                  });
                }
            });
        });
    }

    function createUserDoc(username, password, properties, callback) {
        var doc = {};
        doc._id = 'org.couchdb.user:' + username;
        doc.name = username;
        doc.type = 'user';

        _.extend(doc, properties);

        db.newUUID(100, function (err, uuid) {
            if (err) {
                return callback(err);
            }
            doc.salt = uuid;
            doc.password_sha = sha1.hex(password + doc.salt);
            callback(undefined, doc);
        });
    };


    function userDocOnSubmit(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var form = $(this),
            error = false,
            username = form.find('[name=username]'),
            password = form.find('[name=password]'),
            props = {roles: [], locale: 'en', kujua_facility: ''};
        if (_.isEmpty(username.val())) {
            username.parents('.control-group').addClass('error');
            error = true;
        };
        if (_.isEmpty(password.val())) {
            password.parents('.control-group').addClass('error');
            error = true;
        };
        if (!error) {
            form.find('.control-group').removeClass('error');
            createUserDoc(username.val(), password.val(), props, function(err, doc) {
                if (err) {
                    logger.error(err);
                    alert(err);
                } else {
                    $('#createuser-output').html(JSON.stringify(doc, null, 4)).show();
                }
            });
        }
    }

    $(document).on('submit', '#createuser', userDocOnSubmit);

    var renderFormExamples = function(err, callback) {

        callback = callback || err;

        var req = {},
            // annoying https://github.com/akdubya/dustjs/issues/9
            context = {
              iter: function(chk, ctx, bodies) {
                  var obj = ctx.current();
                  for (var k in obj) {
                    chk = chk.render(bodies.block, ctx.push({key: k, value: obj[k]}));
                  }
                  return chk;
              },
              forms: {}
            };

        // massage context a bit
        _.each(jsonforms , function(form, key) {
            var reporting_rates = [];
            for (var k in form.fields) {
                if (k === 'week' || k === 'week_number')
                    reporting_rates.push('weekly');
                if (k === 'month' || k === 'month_number')
                    reporting_rates.push('monthly');
            };
            context.forms[key] = {
                title: utils.localizedString(form.meta.label),
                examples: form.examples,
                use_sentinel: form.use_sentinel,
                messages_task: form.messages_task,
                facility_reference: form.facility_reference,
                validations: form.validations && Object.keys(form.validations).join(', '),
                reporting_rates: reporting_rates,
                autoreply: form.autoreply
            };
        });
        $('#supportedforms + p').after(
            templates.render('docs/example_messages.html', req, context)
        );
        callback();
    }

    if ($('#supportedforms').get(0)) {
        renderFormExamples(function() {
            if ($('#smsresponses').get(0)) {
                renderSMSResponses(function() {
                    $(document).trigger('docsPageLoaded');
                });
            }
        });
    } else {
        $(document).trigger('docsPageLoaded');
    }

    exports.renderDoc = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var path = args.length > 0 ? prefix+'/'+args.join('/') : 'md/index.md';
        couchr.get(path, function (err, resp) {
            if (err) return $('#content').html('<p>Not Found: '+err+'</p>');
            var html = updateImages(path, marked(resp));
            html = updateLinks(path, html);
            $('#content').html(html);
        });
        // emit doc-changed event
    }

    exports.routes = function() {
       return  {
           '/' : exports.renderDoc,
           '/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc
        }
    }

    exports.init = function(options) {
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

        getSettings(function(err, data) {
            if (err) return alert('Failed to retrieve settings.\n'+err);
            $('#page-title').append('<small>v'+data.config.version+'</small>');
        });
    }

    return exports;

});
