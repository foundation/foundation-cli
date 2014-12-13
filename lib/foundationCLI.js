var bower   = require('bower');
var colors  = require('colors');
var exec    = require('exec');
var fs      = require('fs');
var isRoot  = require('is-root');
var lineLog = require('single-line-log').stdout;
var open    = require('open');
var npm     = require('npm');
var path    = require('path');
var pkg     = require('../package.json');
var rimraf  = require('rimraf');
var setup   = require('./setup');
var spawn   = require('child_process').spawn;
var yeti    = require('./yeti');

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
    'To learn more about a specific command, type ' + 'foundation-apps help <command>'.cyan
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
  if (isRoot() || true) {
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
    , gitClone = ['git', 'clone', 'https://github.com/zurb/foundation-apps-template.git', projectName]
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

  // Clone the template repo
  process.stdout.write("\nDownloading the Foundation for Apps template...".cyan);
  exec(gitClone, function(err, out, code) {
    if (err instanceof Error) throw err;

    console.log("\nDone downloading!".green + "\n\nInstalling dependencies...".cyan + "\n");

    // Remove the Git folder
    rimraf(path.join(projectFolder, '.git'), function() {});

    // npm install
    npm.load({ prefix: projectFolder, loaded: false }, function(err) {
      npm.commands.install([], function(err, data) {
        console.log("\u2713 Node modules installed.");
      });
    });

    // Bower install
    bower.commands.install(undefined, undefined, {
      cwd: projectFolder, loglevel: 'warn', production: true })
    .on('err', function(err) {
      console.log(err);
    })
    .on('end', function(data) {
      console.log("\u2713 Bower components installed.");
    });

    // Bundle install
    exec(bundleInstall, {cwd: './'+args[0]}, function(err, out, code) {
      if (err instanceof Error) throw err;
      console.log("\u2713 Gems installed.");
    });

    // Finished!
    // process.stdout.write([
    //   "\n\nYou're all set! Now run ",
    //   "foundation-apps watch ".cyan,
    //   "while inside the ",
    //   args[0].cyan,
    //   " folder.\n\n"
    // ].join(''));
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
  var cmd = ['start'];
  if (justBuild) cmd.push('build');

  var proc = spawn(npm, cmd);
  proc.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });
  proc.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
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
