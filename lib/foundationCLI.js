var bower    = require('bower')
  , colors   = require('colors')
  , exec     = require('exec')
  , execSync = require('exec-sync')
  , fs       = require('fs')
  , isRoot   = require('is-root')
  , lineLog  = require('single-line-log').stdout
  , open     = require('open')
  , npm      = require('npm')
  , path     = require('path')
  , pkg      = require('../package.json')
  , rimraf   = require('rimraf')
  , setup    = require('./setup')
  , status   = require('./installStatus')
  , spawn    = require('child_process').spawn
  , yeti     = require('./yeti');

// HELP
// List all available commands, or info for a specific command
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

// HELP
// Lists all available commands, or explains a specific command
module.exports.help = function(args, options) {
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

// NEW
// Clones the Foundation for Apps template and installs dependencies
module.exports.new = function(args, options) {
  // Show help screen if the user didn't enter a project name
  if (typeof args[0] === 'undefined') {
    this.help('new');
    process.exit(0);
  }

  // Check for required dependencies
  setup();

  // Stop if the process is being run as root
  if (isRoot()) {
    yeti([
      'Slow down there, friend!',
      '------------------------',
      'Running this installer as an administrator can cause problems.',
      'Try running this command again without "sudo" or administrator rights.'
    ]);
    process.exit(0);
  }

  var projectName = args[0]
    , projectFolder = path.join(process.cwd(), projectName)
    , gitClone = "git clone https://github.com/zurb/foundation-apps-template.git " + projectName
    , bundleInstall = [process.platform === 'win32' ? 'bundle.bat' : 'bundle']
  ;

  // Check if the folder already exists
  if (fs.existsSync(projectFolder)) {
    console.log("There's already a folder named " + projectName.cyan + " here. Please use a different name or delete that folder.\n");
    process.exit(0);
  }

  yeti([
    'Thanks for using Foundation for Apps!',
    '-------------------------------------',
    'Let\'s set up a new project.',
    'It shouldn\'t take more than a minute.'
  ]);

  process.stdout.write("\nDownloading the Foundation for Apps template...".cyan);
  
  // Clone the template repo
  execSync(gitClone, function(err, out, code) {
    if (err) console.log(err);
  });

  console.log("\nDone downloading!".green + "\n\nInstalling dependencies...".cyan + "\n");

  // Remove the Git folder
  rimraf(path.join(projectFolder, '.git'), function() {});

  // For debugging: force an npm error
  // rimraf(path.join(projectFolder, 'package.json'), function() {});

  // npm install
  npm.load({ prefix: projectFolder, loaded: false }, function(err) {
    npm.commands.install([], function(err, data) {
      if (err) status.update('npm', false);
      else status.update('npm', true);
    });
  });

  // Bower install
  bower.commands.install(undefined, undefined, {
    cwd: projectFolder, silent: true, quiet: true, production: true })
  .on('err', function(err) {
    status.update('bower', false);
  })
  .on('end', function(data) {
    status.update('bower', true);
  });

  // Bundle install
  exec(bundleInstall, {cwd: projectFolder}, function(err, out, code) {
    if (err) status.update('bundle', false);
    else status.update('bundle', true);
  });
}

// UPDATE
// Updates an existing project.
module.exports.update = function(args, options) {
  bower.commands.update(undefined, undefined, {
    cwd: projectFolder, loglevel: 'warn', production: true })
  .on('err', function(err) {
    console.log(err);
  })
  .on('end', function(data) {
    console.log(data);
  });
}

// WATCH
// Runs "npm start" to build the project and watch for changes
module.exports.watch = function(args, options, justBuild) {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log("\nYou don't appear to be in a Foundation project folder.\n\nUse " + "pwd".cyan + " (or " + "chdir".cyan + " on Windows) to see what folder you're in.\n");
    process.exit(0);
  }

  var cmd = justBuild ? 'build' : '';

  npm.load({ prefix: process.cwd(), loaded: false }, function(err) {
    npm.commands.start(cmd);
  });
}

// BUILD
// Runs "npm start build" to run the watch process once.
module.exports.build = function(args, options) {
  this.watch(args, options, true)
}

// DOCS
// Open the documentation in the user's browser
module.exports.docs = function(args, options) {
  open('http://foundation.zurb.com/apps/docs');
}
