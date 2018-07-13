#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function replace_string_in_file(filename, toReplace, replaceWith) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(toReplace, "g"), replaceWith);
    fs.writeFileSync(filename, result, 'utf8');
}

if (rootdir) {

    var filestoreplace = ["www/index.html"];

    filestoreplace.forEach(function(val, index, array) {
        var fullfilename = path.join(rootdir, val);
        if (fs.existsSync(fullfilename)) {
            replace_string_in_file(fullfilename, /<!-- web-version-config-on -->/, '<!-- web-version-config-off');
            replace_string_in_file(fullfilename, /<!-- end-web-version-config-on -->/, 'end-web-version-config-off -->');
            replace_string_in_file(fullfilename, /<!-- cordova-version-config-off/, '<!-- cordova-version-config-on -->');
            replace_string_in_file(fullfilename, /end-cordova-version-config-off -->/, '<!-- end-cordova-version-config-on -->');

            replace_string_in_file(fullfilename, /href="\/manifest/, 'href="manifest');
            replace_string_in_file(fullfilename, /href="\/favicon/, 'href="favicon');
            replace_string_in_file(fullfilename, /href="\/static\//g, 'href="static/');
            replace_string_in_file(fullfilename, /src="\/static\//g, 'src="static/');
        } else {
            //console.log("missing: " + fullfilename);
        }
    });

}
