var bower    = require('bower')
  , colors   = require('colors')
  , exec     = require('exec')
  , fs       = require('fs')
  , isRoot   = require('is-root')
  , npm      = require('npm')
  , path     = require('path')
  , rimraf   = require('rimraf')
  , setup    = require('../setup')
  , status   = require('../installStatus')
  , yeti     = require('../yeti');

module.exports = function(args, options) {

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
  , gitClone = ["git", "clone", "https://github.com/zurb/foundation-apps-template.git", projectName]
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
exec(gitClone, function(err, out, code) {
  if (err instanceof Error) {
    console.log(err);
    console.log("There was an issue running " + "git clone ".cyan + "to download the Foundation for Apps template.\nMake sure your machine's Git is configured properly and then try again.")
    process.exit(0);
  }

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
});

}