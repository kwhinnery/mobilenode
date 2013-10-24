var program = require('commander'),
    colors = require('colors'),
    packageInfo = require('../package');

// Use commander to parse input
program.version(packageInfo.version)
    .description('Run a node.js-like JavaScript program on mobile devices')
    .usage('[command] [arguments] [options]')
    .option('-p, --port <port>', 'An optional port for the local web socket server', 8080);

// Define commands for the purposes of documentation on the --help call
// We handle commands ourselves so we can have intelligent output if no command
// is specified
program.command('serve'.blue)
    .description('Start a local mobilenode server in dev mode'.grey);

program.command('bundle'.blue)
    .description('Create a JavaScript file to bundle in a mobilenode native project'.grey);

program.command('help'.blue)
    .description('Print this help message'.grey);

// Parse arguments
program.parse(process.argv);

// Invoke the proper command
if (program.args.length == 0 || program.args[0] === 'help') {
    program.on('--help', function() {
        console.log('  Type "[command] help" for command-specific help.\n');
    });
    program.help();
} else {
    var command;
    try {
        // try to load command - we'll throw if it doesn't exist
        command = require('./commands/'+program.args[0]);
    } catch (e) {
        console.log('\n  error: command unrecognized. Run "mnode" with no arguments for usage.\n');
    }

    // Call command with arguments supplied, with program set as "this"
    command.call(program, program.args.slice(1));
}
