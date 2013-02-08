/**
 * Updates the data for each cache manifest attachment with a modified time.
 */

module.exports = {
    after: 'attachments/add',
    run: function (root, path, settings, doc, callback) {
        var paths = settings.cache_manifests || [];
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        var now = new Date().toString();
        paths.forEach(function (p) {
            var data = doc._attachments[p].data;
            var raw = new Buffer(data, 'base64').toString('utf8');
            var newdata = new Buffer(raw + '\n\n# ' + now).toString('base64');
            doc._attachments[p].data = newdata;
        });
        callback(null, doc);
    }
};
