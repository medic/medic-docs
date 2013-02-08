var fs = fs = require('fs');
var path = require('path');

module.exports = {
    after: 'modules/attachment',
    run: function (root, path_stuff, settings, doc, callback) {
        if(!settings.minify) return callback(null, doc);
        console.log('cleanup!');
        var temp_file = path.join(root, 'jam/require.js.temp');
        fs.unlink(temp_file, function(err){
            return callback(err, doc);
        })
    }
};