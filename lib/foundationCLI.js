var fs     = require('fs');
var exec   = require('exec');
var spawn  = require('child_process').spawn;
var colors = require('colors');
var open   = require('open');
var bower  = require('bower');
var pkg    = require('../package.json');

// HELP
// Lists all available commands, or explains a specific command
module.exports.help = function(args, options) {
  var say = '';
  if (args.length === 0) {
    say = [
      '',
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
    ].join('\n') + '\n\n';
  }

  process.stdout.write(say);
}

// NEW
// Clones the Foundation for Apps template and installs dependencies
module.exports.new = function(args, options) {
  // Commands
  var gitClone = ['git', 'clone', 'https://github.com/zurb/foundation-apps-template.git', args[0]];
  var npmInstall = ['npm', 'install'];

  // Clone the template repo
  process.stdout.write("Downloading the Foundation for Apps template...".cyan);
  exec(gitClone, function(err, out, code) {
    if (err instanceof Error) throw err;

    process.stdout.write([
      " Done downloading!\n",
      "\nInstalling dependencies...".cyan
    ].join(''));

    // Install npm and Bower dependencies
    exec(npmInstall, {cwd: './'+args[0]}, function(err, out, code) {
      if (err instanceof Error) throw err;

      else {
        process.stdout.write([
          " Done installing!\n",
          "\nYou're all set! Now run ",
          "npm test ".cyan,
          "while inside the ",
          args[0].cyan,
          " folder.\n\n"
        ].join(''));
      }
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
module.exports.watch = function(args, options) {
  var cmd = spawn('npm', ['start']);
  cmd.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });
  cmd.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
  });
  cmd.on('exit', function(code) {
    console.log("Good Luck Have Batman".cyan);
  });
}

// BUILD
module.exports.build = function(args, options) {
  
}

// DOCS
// Open the documentation in the user's browser
module.exports.docs = function(args, options) {
  open('http://foundation.zurb.com/docs');
}