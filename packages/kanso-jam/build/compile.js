var path = require('path');
var exec = require('child_process').exec;
var fs = fs = require('fs');

var jam_cmd = "jam compile ";


function generate_full_command(includes, temp_file) {
    var pre = '';
    if (includes.length > 0) {
        pre = ' -i ' + includes.join(' -i ');
    }
    return jam_cmd + pre + ' ' + temp_file;
}


module.exports = {
    run : function(root, path_loc, settings, doc, callback) {

        if(!settings.minify) return callback(null, doc);


        var includes = [];

        if (settings.jam) {
            if (settings.jam.include){
                if (Array.isArray(settings.jam.include)) {
                    includes = settings.jam.include;
                } else {
                    includes.push(settings.jam.include);
                }
            }
        }
        // hack need to figure out better place to do this
        var temp_file = path.join(root, 'jam/require.js.temp');
        var cmd = generate_full_command(includes, temp_file);
        console.log('running: ' + cmd);

        exec(cmd, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);

            fs.readFile(temp_file, function (err, content) {
                if (err) {
                    return callback(err);
                }
                var data = content.toString();

                if (!doc._attachments) {
                    doc._attachments = {};
                }
                doc._attachments['jam/require.js'] = {
                    'content_type': 'application/javascript; charset=utf-8',
                    'data': new Buffer(data).toString('base64')
                };

                callback(null, doc);
            });
        });
    }
}