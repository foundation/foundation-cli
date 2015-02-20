var colors = require('colors');

var helpText = {
  // Each command is an array of strings
  // To print the command, the array is joined into one string, and a line break is added
  // between each item. Basically, each comma you see becomes a line break.
  'default': [
    'Commands:',
    '  new'.cyan + '       Create a new project using our prototyping template',
    '  update'.cyan + '    Update an existing Foundation for Apps project',
    '  watch'.cyan + '     Watch a project\'s files for changes',
    '  build'.cyan + '     Compile a project\'s files once',
    '  docs'.cyan + '      Open the documentation in your browser',
    '  help'.cyan + '      Show this screen',
    '  -v'.cyan + '        Display the CLI\'s version',
    '',
    'To learn more about a specific command, type ' + 'foundation-apps help <command>'.cyan,
    '',
    'Need more help? Ask a question on the Foundation Forum: ' + 'foundation.zurb.com/forum'.cyan
  ],
  'new': [
    'Usage:',
    '  foundation-apps new ' + '<name>',
    // '  foundation-apps new <name> ' + '-v <version number>',
    // '  foundation-apps new <name> ' + '--libsass',
    '',
    'Creates a new project using our Foundation for Apps template.'
    // 'You can specify a version of Foundation for Apps using ' + '-v x.x.x'.cyan + ',',
    // 'and switch to the libsass compiler using ' + '--libsass'.cyan + '.'
  ],
  'update': [
    'Usage:',
    '  foundation-apps update',
    '',
    'Updates an existing Foundation for Apps project by running "bower update".'
  ],
  'watch': [
    'Usage:',
    '  foundation-apps watch',
    '',
    'Assembles your app\'s files and watches for any new changes to the files.',
    'Keep this command running while you work on your project.'
  ],
  'build': [
    'Usage:',
    '  foundation-apps build',
    '',
    'Assembles your app\'s files once, and doesn\'t watch for new changes.'
  ],
  'help': [
    'Okay, don\'t get clever. But seriously:',
    '',
    'Usage:',
    '  foundation-apps help',
    '  foundation-apps help <command>',
    '',
    'Type ' + 'foundation-apps help'.cyan + ' to see a list of every command,',
    'or ' + 'foundation-apps help <command>'.cyan + ' to learn how a specific command works.'
  ]
}

module.exports = function(args, options) {
  var say;
  if (typeof args === 'undefined' || args.length === 0) {
    say = 'default'
  }
  else {
    say = args[0]
  }
  // A line break is added before and after the help text for good measure
  say = '\n' + helpText[say].join('\n') + '\n\n'

  process.stdout.write(say);
}