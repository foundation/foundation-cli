#!/usr/bin/env node

var term       = require('terminal-kit').terminal;
var update     = require('update-notifier');
var pkg        = require('../package.json');
var chalk      = require('chalk');

var argv = require('yargs')
    .strict(true)
    .usage(chalk.underline("Usage") + ":\n" + chalk.cyan("$0 <command> [options]"))
// // sources
    .commandDir('../lib/commands',{
        include: '/^[\w\-]+\.js$/',
    })
    .recommendCommands(true)
    .help()
    .option('help', {
        alias: 'h',
        global: false,
	default: true
    })
    .version()
    .option('version',{
        alias: 'v',
        global: false
    })
    .epilogue('Need more help? Ask a question on the Foundation Forum: ' + chalk.cyan('https://foundation.zurb.com/forum'))
    .fail(function (msg, err, yargs) {
        term.red.error(msg+"\n\n")
        term(yargs.help())
        process.exit(1)
    })

argv.argv;

//notifier.notify();
