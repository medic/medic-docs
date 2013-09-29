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
        settings = null,
        cache = {};

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
        //html.replace(/\s*href\s*=\s*["']([^"']+)/g, ' href="#/$1"')
        while ((match = re.exec(html)) !== null) {
            //debugger;
            if (match[1].match(/^\s*http/)) continue;
            if (match[1].match(/^\s*#/)) continue;
            html = html.replace(match[1], '#/'+match[1]);
        }
        return html;
    };

    function slugify(str) {
        return str
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
    }

    //setup title
    //var title = $('#docs-body h1:first-child').text();

    // setup controls
    //$('.page-header .controls').hide();

    function renderTOC(path) {
        // render TOC unless no sub headers
        if ($('#docs-body h2').get(0)) {
          var ul = $('<ul/>');
          $('#docs-body h2, #docs-body h3').each(function(idx, el) {
            var header = $(el),
                title = header.text(),
                id = header.attr('id'),
                slug = slugify(title);
            header.attr('name', id || slug);
            var a = $('<a/>').attr(
                'href', path.replace('md', '#') + '?' + (id || slug)
            ).text(title).on('click', function(ev) {
                ev.preventDefault();
                var name = $(this).attr('href').split('?')[1];
                scrollTo('[name=' + name + ']');
            });
            if (el.tagName === 'H2') {
              ul.append($('<li/>').append(a));
            } else {
              ul.append($('<li class="subhead"/>').append(a));
            }
          });
          $('#sections').html(ul);
          $('#sections').show();
        } else {
          $('#sections').hide();
        }
    };

    // TODO refactor this with other image calibration
    function makeImagesZoomable() {
        var content_width = 620;
        // make large images zoomable
        if (query) {
            console.log("$('[name='" + args.query.replace('?','') +").offset().top + 80");
            console.log($('[name=' + args.query.replace('?','')).offset().top + 80);
            scrollTo('[name=' + args.query.replace('?', '') + ']');
        }
        $('#docs-body img').each(function(idx, el) {
            var t =  $("<img/>"),
                width = 0,
                height = 0;
            t.attr("src", $(el).attr("src"));
            t.load(function() {
                width = this.width;
                height = this.height;
                $(el).parent().addClass('images');
                if (width > content_width) {
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


    exports.renderDoc = function() {
        var args = Array.prototype.slice.call(arguments, 0),
            query = /^\?/.test(_.last(args)) ? _.last(args) : null,
            path = 'md/index.md';
        if (query) {
            args = _.without(args, query);
        }
        if (args.length > 0) {
            path = prefix+'/'+args.join('/');
        }
        if (query && cache.lastRendered && cache.lastRendered.path === path) {
            // just scroll if we already loaded this path
            return scrollTo('[name=' + query.replace('?', '') + ']');
        }
        couchr.get(path, function (err, resp) {
            if (err) return $('#content').html('<p>Not Found: '+err+'</p>');
            var html = updateImages(path, marked(resp));
            html = updateLinks(path, html);
            // set image height so scrollTo computation is correct
            var imgs = $('#content').html(html).find('img');
            var count = imgs.length;
            imgs.each(function(idx, el) {
                var i = new Image();
                i.onload = function() {
                    //$(el).attr('height', this.height);
                    //$(el).attr('width', this.width);
                    //console.log('this.height '+ this.height);
                    //console.log('this.width' + this.width);
                    //console.log('$(el).attr(height) ' + $(el).attr('height'));
                    //console.log('$(el).attr(width) '+ $(el).attr('width'));
                    --count;
                    if (count == 0) {
                        $(document).trigger('docRendered', {path: path, query: query});
                    }
                };
                i.src = $(el).attr('src');
            });
        });
    }

    exports.routes = function() {
       return  {
           '/' : exports.renderDoc,
           '/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)(\\?[\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)/([\\w\\-\\._]+)': exports.renderDoc,
           '/([\\w\\-\\._]+)/([\\w\\-\\._]+)/([\\w\\-\\._]+)(\\?[\\w\\-\\._]+)': exports.renderDoc
        }
    }

    var scrollTo = function(sel) {
        $('html, body').animate({
            scrollTop: $(sel).offset().top - 60
        }, 2000);
    }

    var onDocRendered = function(ev, args) {
        renderTOC(args.path);
        makeImagesZoomable();
        if ($('#supportedforms').get(0)) {
            renderFormExamples(function() {
                if ($('#smsresponses').get(0)) {
                    renderSMSResponses(function() {
                        $(document).trigger('docsPageLoaded');
                    });
                }
            });
        }
        cache.lastRendered = args;
    };

    var setupListeners = function() {
        $(document).on('docRendered', onDocRendered);
        $(document).on('submit', '#createuser', userDocOnSubmit);
        $(window).load(function() { console.log('window loaded') });
    };

    exports.onDOMReady = function(options)  {
        getSettings(function(err, data) {
            if (err) return alert('Failed to retrieve settings.\n'+err);
            // include version number in heading
            $('#page-title').append('<small>v'+data.config.version+'</small>');
        });
    };

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
        setupListeners();
    }

    return exports;

});
