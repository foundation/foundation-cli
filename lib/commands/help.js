var say       = require('../util/converse.js');

var helpText = {
  // Each command is an array of strings
  // To print the command, the array is joined into one string, and a line break is added
  // between each item. Basically, each comma you see becomes a line break.
  'default': [
    '^_Commands^:',
    '  ^cnew^' + '       Create a new Foundation project',
    '  ^cupdate^' + '    Update an existing Foundation project',
    '  ^cwatch^' + '     Watch a project\'s files for changes',
    '  ^cbuild^' + '     Build a project\'s files for production',
    '  ^cblocks^' + '    List and install building blocks',
    '  ^ckits^' + '      List and install building block kits',
    '  ^chelp^' + '      Show this screen',
    '  ^c-v^' + '        Display the CLI\'s version',
    '',
    'To learn more about a specific command, type ' + 'foundation help <command>',
    '',
    'Need more help? Ask a question on the Foundation Forum: ' + '^bhttps://foundation.zurb.com/forum^'
  ],
  'new': [
    '^_Usage^:',
    '  foundation new ',
    '  foundation new ' + '--framework sites',
    '  foundation new ' + '--template (basic|zurb)',
    '  foundation new ' + '--directory appname',
    '',
    '^_Action^:',
    'Run the command without any flags to build a new Foundation project with the help of an interactive setup prompt.',
    'You can also manually supply the framework and folder name using the ' + '^c--framework^' + ' and ' + '^c--directory^' + ' flags.',
    '  If creating a ' + 'sites' + ' project, add the ' + '^c--template^' + ' flag as well. The value can be ' + '^cbasic^' + ' or ' + '^czurb^'
  ],
  'update': [
    '^_Usage^:',
    '  foundation update',
    '',
    'Updates an existing Foundation project by running "bower update".'
  ],
  'unknown': [
    'Not a defined command.'
  ],
  'watch': [
    '^_Usage^:',
    '  foundation watch',
    '',
    'Assembles your app\'s files and watches for any new changes to the files.',
    'Keep this command running while you work on your project.'
  ],
  'build': [
    '^_Usage^:',
    '  foundation build',
    '',
    'Assembles your app\'s files into a production-ready build.'
  ],
  'help': [
    'Okay, don\'t get clever. But seriously:',
    '',
    '^_Usage^:',
    '  foundation help',
    '  foundation help <command>',
    '',
    'Type ' + 'foundation help' + ' to see a list of every command,',
    'or ' + 'foundation help <command>' + ' to learn how a specific command works.'
  ],
  'blocks': [
    '^_Usage^:',
    '  foundation blocks list ',
    '  foundation blocks install <block>',
    '',
    'List available building blocks, or install them',
  ],
  'kits': [
    '^_Usage^:',
    '  foundation kits list ',
    '  foundation kits install <kits>',
    '',
    'List available building block kits, or install them',
  ]
};



module.exports = function(args = {}) {
  if ([0,undefined].indexOf(args.length) > -1 ||
    helpText[args[0]] === undefined
  ) {
    return say('default', helpText);
  }
  if (helpText[args[0]] !== undefined) {
    return say(args[0], helpText);
  }
}
