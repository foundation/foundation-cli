var say       = require('../util/converse.js');

var helpText = {
  // Each command is an array of strings
  // To print the command, the array is joined into one string, and a line break is added
  // between each item. Basically, each comma you see becomes a line break.
  'default': [
    'Commands:',
    '  new' + '       Create a new Foundation project',
    '  update' + '    Update an existing Foundation project',
    '  watch' + '     Watch a project\'s files for changes',
    '  build' + '     Build a project\'s files for production',
    '  blocks' + '    List and install building blocks',
    '  kits' + '      List and install building block kits',
    '  help' + '      Show this screen',
    '  -v' + '        Display the CLI\'s version',
    '',
    'To learn more about a specific command, type ' + 'foundation help <command>',
    '',
    'Need more help? Ask a question on the Foundation Forum: ' + 'foundation.zurb.com/forum'
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
    'You can also manually supply the framework and folder name using the ' + '--framework' + ' and ' + '--directory' + ' flags.',
    '  If creating a ' + 'sites' + ' project, add the ' + '--template' + ' flag as well. The value can be ' + 'basic' + ' or ' + 'zurb' + '.'
  ],
  'update': [
    'Usage:',
    '  foundation update',
    '',
    'Updates an existing Foundation project by running "bower update".'
  ],
  'unknown': [
    'Not a defined command.'
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
    'Type ' + 'foundation help' + ' to see a list of every command,',
    'or ' + 'foundation help <command>' + ' to learn how a specific command works.'
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
  ]
};



module.exports = function(args = {}) {
  if (args === false) {
    return say('default', helpText);
  }
  if (args.length === 0) {
    say('default', helpText);
  } else {
    if (helpText[args[0]] === undefined) {
      say('unknown',helpText);
    } else {
      say(args[0],helpText);
    }
  }
}
