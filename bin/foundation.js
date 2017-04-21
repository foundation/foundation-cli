#!/usr/bin/env node

var nopt       = require('nopt');
var update     = require('update-notifier');
var pkg        = require('../package.json');
var foundation = require('../lib');


// Options that can be passed to commands
var options = {
    "version": Boolean,
    "framework": [String,'sites','apps','emails'],
    "template": String,
    "directory": String
}


var shorthands = {
    "v": "--version",
    "f": "--framework",
    "t": "--template",
    "d": "--directory"
}

var parsed = nopt(options, shorthands);
// cmd.args contains basic commands like "new" and "help"
// cmd.opts contains options, like --libsass and --version
var cmd = {
    command: parsed.argv.remain,
    opts: parsed
}

// Check for updates once a day
var notifier = update({
    packageName: pkg.name,
    packageVersion: pkg.version
});
notifier.notify();


// No commands issued.
if (cmd.command.length === 0) {
    // If -v or --version was passed, show the version of the CLI
    if (cmd.opts.version) {
        foundation.converse("Foundation CLI version " + require('../package.json').version);
    }
    // Otherwise, just show the help screen
    else {
        foundation.help();
    }
}

// Commands given
else {

    // If the command typed in doesn't exist, show the help screen
    if (!(cmd.command[0] in foundation)) {
        foundation.converse(cmd.command[0].red + " is not a defined command.");
       foundation.help(false);
    }
    // Otherwise, just run it already!
    else {
        // Every command function is passed secondary commands, and options
        // So if the user types "foundation new myApp --edge", "myApp" is a secondary command, and "--edge" is an option
        // use loop in the future to handle multiple commands

        foundation[cmd.command[0]](cmd.command.slice(1), cmd.opts);
    }
}
