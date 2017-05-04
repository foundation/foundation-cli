#!/usr/bin/env node

//var term = require( 'terminal-kit' ).terminal;
var update     = require('update-notifier');
var pkg        = require('../package.json');
//var foundation = require('../lib');

var argv = require('yargs')
    .commandDir('../lib/commands')
//
    .version()
    .option('v',{
        alias: 'version',
    //    desc: 
        global:false
    })
//
// help text
    .help()
    .option('h',{
        alias: 'help',
        global: false,
        default: true
    })


// new
//    .command('new','Create a new Foundation project')

// update
    .command('update', 'Update an existing Foundation project')

// watch
    .command('watch', 'Watch a project\'s files for changes')

// build
    .command('build', 'Build a project\'s files for production')

// blocks
    .command('blocks', 'List and install building blocks')

// kits
    .command('kits', 'List and install building block kits')

// epilogue
    .epilogue('Need more help? Ask a question on the Foundation Forum: ' + 'foundation.zurb.com/forum')
//    .reset()
    .strict()
;



argv.argv;


// // Options that can be passed to commands
// var options = {
//     "framework": String,
//     "template": String,
//     "directory": String
// }

// // Shorthands for the above commands
// var shorthands = {
//     "v": "--version",
//     "f": "--framework",
//     "t": "--template",
//     "d": "--directory"
// }

// var parsed = nopt(options, shorthands);

// // cmd.args contains basic commands like "new" and "help"
// // cmd.opts contains options, like --libsass and --version
// var cmd = {
//     args: parsed.argv.remain,
//     opts: parsed
// }

// // Check for updates once a day
// var notifier = update({
//     packageName: pkg.name,
//     packageVersion: pkg.version
// });
// notifier.notify();

// // No other arguments given
// if (typeof cmd.args[0] === 'undefined') {
//     // If -v or --version was passed, show the version of the CLI
//     if (typeof cmd.opts.version !== 'undefined') {
//         process.stdout.write("Foundation CLI version " + require('../package.json').version + '\n');
//     }
//     // Otherwise, just show the help screen
//     else {
//         foundation.help();
//     }
// }

// // Arguments given
// else {
//     // If the command typed in doesn't exist, show the help screen
//     if (typeof foundation[cmd.args[0]] == 'undefined') {
//         foundation.help();
//     }
//     // Otherwise, just run it already!
//     else {
//         // Every command function is passed secondary commands, and options
//         // So if the user types "foundation new myApp --edge", "myApp" is a secondary command, and "--edge" is an option
//         foundation[cmd.args[0]](cmd.args.slice(1), cmd.opts);
//     }
// }
