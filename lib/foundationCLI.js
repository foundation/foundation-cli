var fs     = require('fs');
var exec   = require('exec');
var colors = require('colors');
var pkg    = require('../package.json');

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
      '  help'.cyan + '      Show this screen',
      '  -v'.cyan + '        Display the CLI\'s version',
      '',
      'To learn more about a specific command, type ' + 'foundation help <command>'.cyan
    ].join('\n') + '\n\n';
  }

  process.stdout.write(say);
}

module.exports.new = function(args, options) {
  // Commands
  var gitClone = ['git', 'clone', 'https://github.com/zurb/foundation-apps-template.git', args[0]];
  var npmInstall = ['npm', 'install', '--production'];

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
