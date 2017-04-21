require('colors');

var helpText = {
    // Each command is an array of strings
    // To print the command, the array is joined into one string, and a line break is added
    // between each item. Basically, each comma you see becomes a line break.
    'default': [
        'Commands:',
        '  new'.cyan + '       Create a new Foundation project',
        '  update'.cyan + '    Update an existing Foundation project',
        '  watch'.cyan + '     Watch a project\'s files for changes',
        '  build'.cyan + '     Build a project\'s files for production',
        '  blocks'.cyan + '    List and install building blocks',
        '  kits'.cyan + '      List and install building block kits',
        '  help'.cyan + '      Show this screen',
        '  -v'.cyan + '        Display the CLI\'s version',
        '',
        'To learn more about a specific command, type ' + 'foundation help <command>'.cyan,
        '',
        'Need more help? Ask a question on the Foundation Forum: ' + 'foundation.zurb.com/forum'.cyan
    ],
    'new': [
        'Usage:',
        '  foundation new ',
        '  foundation new ' + '--framework sites',
        '  foundation new ' + '--template (basic|zurb)',
        '  foundation new ' + '--directory appname',
        '',
        'Creates a new Foundation project.',
        'Run the command without any flags to get an interactive setup prompt.',
        'You can also manually supply the framework and folder name using the ' + '--framework'.cyan + ' and ' + '--directory'.cyan + ' flags.',
        '  If creating a ' + 'sites'.cyan + ' project, add the ' + '--template'.cyan + ' flag as well. The value can be ' + 'basic'.cyan + ' or ' + 'zurb'.cyan + '.'
    ],
    'update': [
        'Usage:',
        '  foundation update',
        '',
        'Updates an existing Foundation project by running "bower update".'
    ],
    'unknown': [
        'Not a not a defined command.'
    ],
    'watch': [
        'Usage:',
        '  foundation watch',
        '',
        'Assembles your app\'s files and watches for any new changes to the files.',
        'Keep this command running while you work on your project.'
    ],
    'build': [
        'Usage:',
        '  foundation build',
        '',
        'Assembles your app\'s files into a production-ready build.'
    ],
    'help': [
        'Okay, don\'t get clever. But seriously:',
        '',
        'Usage:',
        '  foundation help',
        '  foundation help <command>',
        '',
        'Type ' + 'foundation help'.cyan + ' to see a list of every command,',
        'or ' + 'foundation help <command>'.cyan + ' to learn how a specific command works.'
    ],
    'blocks': [
        'Usage:',
        '  foundation blocks list ',
        '  foundation blocks install <block>',
        '',
        'List available building blocks, or install them',
    ],
    'kits': [
        'Usage:',
        '  foundation kits list ',
        '  foundation kits install <kits>',
        '',
        'List available building block kits, or install them',
    ],
};

var say = function (statement) {
    return process.stdout.write(helpText[statement].join('\n')+'\n\n');
};

module.exports = function(args = {}) {
    if (Object.is(args.length,undefined)) {
        say('default');
    } else {
        if (helpText[args[0]] === undefined) {
            say('unknown');
        } else {
            say(args[0]);
        }
    }
}
