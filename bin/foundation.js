#!/usr/bin/env node

var term = require( 'terminal-kit' ).terminal;
var update     = require('update-notifier');
var pkg        = require('../package.json');
//var foundation = require('../lib');

var argv = require('yargs')
    .strict(true)
    .usage("$0 <command> [options]")
// // sources
    .commandDir('../lib/commands',{
        include: '/^[\w\-]+\.js$/'
    })
    .help('help')
    .option('help',{
        alias: 'h',
        global: false,
    })
    .version()
    .option('version',{
        alias: 'v',
        global: false
    })
    .epilogue('Need more help? Ask a question on the Foundation Forum: ' + 'https://foundation.zurb.com/forum')
    .fail(function (msg, err, yargs) {
        term.red.error(msg+"\n\n")
        term(yargs.help())
        process.exit(1)
    })


// /// / update
// //     .command('update', 'Update an existing Foundation project')

// // // watch
// //     .command('watch', 'Watch a project\'s files for changes')

// // // build
// //     .command('build', 'Build a project\'s files for production')

// // // blocks
// //     .command('blocks', 'List and install building blocks')

// // // kits
// //     .command('kits', 'List and install building block kits')

// // epilogue
//
// ;
argv.argv;


//notifier.notify();
