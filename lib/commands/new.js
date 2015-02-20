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

// 0. Show help screen if the user didn't enter a project name
if (typeof args[0] === 'undefined') {
  this.help('new');
  process.exit(0);
}

// 1. Check for required dependencies
setup();

// 2. Stop if the process is being run as root
if (isRoot()) {
  yeti([
    'Slow down there, friend!',
    '------------------------',
    'Running this installer as an administrator can cause problems.',
    'Try running this command again without "sudo" or administrator rights.'
  ]);
  process.exit(0);
}

var projectName = args[0];
var projectFolder = path.join(process.cwd(), projectName);
var gitClone = ["git", "clone", "https://github.com/zurb/foundation-apps-template.git", projectName];
var bundleInstall = [process.platform === 'win32' ? 'bundle.bat' : 'bundle'];

// 3. Check if the folder already exists
if (fs.existsSync(projectFolder)) {
  console.log("\nThere's already a folder named " + projectName.cyan + " here. Please use a different name or delete that folder.\n");
  process.exit(0);
}

// 4. Greet the user!
yeti([
  'Thanks for using Foundation for Apps!',
  '-------------------------------------',
  'Let\'s set up a new project.',
  'It shouldn\'t take more than a minute.'
]);

process.stdout.write("\nDownloading the Foundation for Apps template...".cyan);

// 5. Clone the template repo
exec(gitClone, function(err, out, code) {
  if (err instanceof Error) {
    console.log(err);
    console.log("There was an issue running " + "git clone ".cyan + "to download the Foundation for Apps template.\nMake sure your machine's Git is configured properly and then try again.")
    process.exit(0);
  }

  // 6. Change version number
  if (options.version) {
    require('../changeVersion')(options.version, projectName);
  }

  console.log("\nDone downloading!".green + "\n\nInstalling dependencies...".cyan + "\n");

  // 7. Remove the Git folder
  rimraf(path.join(projectFolder, '.git'), function() {});

  // For debugging: force an npm error
  // rimraf(path.join(projectFolder, 'package.json'), function() {});

  // 8a. npm install
  npm.load({ prefix: projectFolder, loaded: false }, function(err) {
    npm.commands.install([], function(err, data) {
      if (err) status.update('npm', false);
      else status.update('npm', true);
    });
  });

  // 8b. Bower install
  bower.commands.install(undefined, undefined, {
    cwd: projectFolder, silent: true, quiet: true, production: true })
  .on('err', function(err) {
    status.update('bower', false);
  })
  .on('end', function(data) {
    status.update('bower', true);
  });

  // 8c. Bundle install
  exec(bundleInstall, {cwd: projectFolder}, function(err, out, code) {
    if (err) status.update('bundle', false);
    else status.update('bundle', true);
  });
});

}