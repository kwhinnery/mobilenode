var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    browserify = require('browserify');

// Run "bundle" command logic - "this" is defined to be the Commander program
module.exports = function(args) {
    this.on('--help', function() {
        console.log('  bundle'.blue+' command help:\n');
        console.log('    Usage: mnode bundle <filename.js> <options>\n');
        console.log('    Examples:');
        console.log('      mnode bundle app.js > mnbundle.js  # bundle program and pipe contents to file\n');
    });

    // Need file name at the least
    if (args.length === 0) {
        this.help();
    }

    var filePath = path.join(process.cwd(), args[0]);
    if (!fs.existsSync(filePath)) {
        console.error('\n  [ERROR]: No file "%s" found. I was looking here: %s\n'.red, args[0], filePath);
    } else {
        // If the file exists, for now just browserify it and dump it to stdout
        var appBundle = browserify();
        appBundle.add(filePath);
        appBundle.bundle(function(err, src) {
            if (err) {
                console.error('\n  [ERROR]: Error occurred while bundling JavaScript application:\n %s\n'.red, util.inspect(err));
            } else {
                console.log(src);
            }
        });
    }
};