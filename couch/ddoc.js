var _ = require('underscore')._;

exports.views = {};
exports.rewrites = [
    { "description": "Access to this database" , "from": "_db" , "to"  : "../.." },
    { "from": "_db/*" , "to"  : "../../*" },
    { "description": "Access to this design document" , "from": "_ddoc" , "to"  : "" },
    { "from": "_ddoc/*" , "to"  : "*"},
    { "description": "Access to the main CouchDB API", "from": "_couchdb" , "to"  : "../../.."},
    { "from": "_couchdb/*" , "to"  : "../../../*"},
    {from: '/', to: 'index.html'},
    //{from: '/docs/:dir/:page/', to: 'index.html'},
    //{from: '/:dir/:page/:subpage/', to: 'index.html'},
    {from: '/*', to: '*'}

];



exports.validate_doc_update = function(newDoc, oldDoc, userCtx, secObj) {
    var ddoc = this;

    secObj.admins = secObj.admins || {};
    secObj.admins.names = secObj.admins.names || [];
    secObj.admins.roles = secObj.admins.roles || [];

    var IS_DB_ADMIN = false;
    if(~ userCtx.roles.indexOf('_admin')) {
        IS_DB_ADMIN = true;
    }
    if(~ secObj.admins.names.indexOf(userCtx.name)) {
        IS_DB_ADMIN = true;
    }
    for(var i = 0; i < userCtx.roles; i++) {
        if(~ secObj.admins.roles.indexOf(userCtx.roles[i])) {
            IS_DB_ADMIN = true;
        }
    }

    var IS_LOGGED_IN_USER = false;
    if (userCtx.name !== null) {
        IS_LOGGED_IN_USER = true;
    }


    if(IS_DB_ADMIN || IS_LOGGED_IN_USER)
        log('User : ' + userCtx.name + ' changing document: ' +  newDoc._id);
    else
        throw {'forbidden':'Only admins and users can alter documents'};
}

