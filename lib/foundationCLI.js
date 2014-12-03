var fs      = require('fs');
var rimraf  = require('rimraf');
var exec    = require('exec');
var spawn   = require('child_process').spawn;
var colors  = require('colors');
var open    = require('open');
var lineLog = require('single-line-log').stdout;
var yeti    = require('./yeti');
var bower   = require('bower');
var pkg     = require('../package.json');

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
    'To learn more about a specific command, type ' + 'foundation help <command>'.cyan
  ],
  'new': [
    'Usage:',
    '  foundation new ' + '<name>',
    '  foundation new <name> ' + '-v <version number>',
    '  foundation new <name> ' + '--libsass',
    '',
    'Creates a new project using our Foundation for Apps template.',
    'You can specify a version of Foundation for Apps using ' + '-v x.x.x'.cyan + ',',
    'and switch to the libsass compiler using ' + '--libsass'.cyan + '.'
  ],
  'update': [
    'Usage:',
    '  foundation update',
    '',
    'Updates an existing Foundation for Apps project by running "bower update".'
  ],
  'watch': [],
  'build': [],
  'help': [
    'Okay, don\'t get clever. But seriously:',
    '',
    'Usage:',
    '  foundation help',
    '  foundation help <command>',
    '',
    'Type ' + 'foundation help'.cyan + ' to see a list of every command,',
    'or ' + 'foundation help <command>'.cyan + ' to learn how a specific command works.'
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
  var projectName = args[0];
  var gitClone = ['git', 'clone', 'https://github.com/zurb/foundation-apps-template.git', args[0]];
  var npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  var npmInstall = ['npm', 'install'];
  var bowerInstall = ['bower', 'install'];
  var bundleInstall = ['bundle'];

  // Show help screen if the user didn't enter a project name
  if (typeof projectName === 'undefined') {
    this.help('new');
    process.exit();
  }

  yeti([
    'Thanks for using Foundation for Apps!',
    'Let\'s set up a new project.'
  ]);

  // Clone the template repo
  process.stdout.write("\nDownloading the Foundation for Apps template...".cyan);
  exec(gitClone, function(err, out, code) {
    if (err instanceof Error) throw err;

    process.stdout.write([
      " Done downloading!",
      "\n\nInstalling dependencies...".cyan,
      "\n"
    ].join(''));

    // Remove the Git folder
    rimraf('./'+projectName+'/.git/', function() {});

    lineLog("npm" + "  =>  bower  =>  bundler".gray);

    // Yes, this is callback hell, we'll get around to fixing it!
    exec(npmInstall, {cwd: './'+args[0]}, function(err, out, code) {
      if (err instanceof Error) throw err;

      lineLog("npm  =>  ".green + "bower".white + "  =>  bundler".gray);
      exec(bowerInstall, {cwd: './'+args[0]}, function(err, out, code) {
        if (err instanceof Error) throw err;

        lineLog("npm  =>  bower".green + "  =>  bundler");
        exec(bundleInstall, {cwd: './'+args[0]}, function(err, out, code) {
          if (err instanceof Error) throw err;

          else {
            lineLog("npm  =>  bower  =>  bundler".green);
            process.stdout.write([
              "\n\nYou're all set! Now run ",
              "foundation-apps watch ".cyan,
              "while inside the ",
              args[0].cyan,
              " folder.\n\n"
            ].join(''));
          }
        });
      });
    });
  });
}

// UPDATE
// Updates an existing project.
module.exports.update = function(args, options) {
  exec(['bower', 'update', '--production', '--ansi'], function(err, out, code) {
    if (err instanceof Error) throw err;

    if (out.length === 0) {
      console.log("Nothing to install.".cyan + " You're good!");
    }
    else {
      console.log(out);
      console.log("Successfully updated.".cyan + " You're good!")
    }
  });
}

// WATCH
// Runs "npm start" to build the project and watch for changes
module.exports.watch = function(args, options, justBuild) {
  var cmd = ['start'];
  if (justBuild) cmd.push('build');

  var proc = spawn('npm', cmd);
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
  open('http://foundation.zurb.com/docs');
}
