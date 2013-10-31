var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    watchify = require('watchify'),
    ws = require('ws');

module.exports = function(args) {
    this.on('--help', function() {
        console.log('  serve'.blue+' command help:\n');
        console.log('    Usage: mnode serve <filename.js> <options>\n');
        console.log('    Examples:');
        console.log('      mnode serve app.js  # bundle and serve app.js on port 8080');
        console.log('      mnode serve app.js -p 4567  # bundle and serve app.js on port 4567');
    });

    // Require a file name
    if (!args[0]) {
        this.help();
    }

    // Find the root node.js program file
    var filePath = path.join(process.cwd(), args[0]);
    if (!fs.existsSync(filePath)) {
        console.error('\n  [ERROR]: No file "%s" found. I was looking here: %s\n'.red, args[0], filePath);
    } else {
        // Create websocket server
        var server = new ws.Server({
            port:this.port
        });

        // Set up connection with a client
        server.on('connection', function(socket) {
            // Dump any messages received to stdout
            socket.on('message', function(data, flags) {
                var msg;
                if (data.indexOf('[ERROR]') > -1) {
                    msg = data.red;
                } else if (data.indexOf('[WARN]') > -1) {
                    msg = data.yellow;
                } else {
                    msg = data.cyan;
                }
                console.log(msg);
            });

            // Ship code on any change
            browserified.bundle(function(err, src) {
                if (err) {
                    console.error('\n  [ERROR]: Error occurred while bundling JavaScript application:\n %s\n'.red, util.inspect(err));
                } else {
                    socket.send(src);
                    console.log('Sent update to client.');
                }
            });
        });

        // Create a browserify bundle that will emit an update event when the
        // bundle changes
        var browserified = watchify({
            entries:[filePath]
        });

        // Bundle up the latest and push it over a socket
        function bundleAndSend() {
            browserified.bundle(function(err, src) {
                if (err) {
                    console.error('\n  [ERROR]: Error occurred while bundling JavaScript application:\n %s\n'.red, util.inspect(err));
                } else {
                    // Do a broadcast to all connected clients with the src
                    server.clients.forEach(function(client) {
                        client.send(src);
                        console.log('Sent update to client.');
                    });
                }
            });
        }

        // Watch bundle contents
        browserified.on('update', bundleAndSend);
        console.log('mobilenode server running on port %s - ctrl-C to exit...', this.port);
    }
};