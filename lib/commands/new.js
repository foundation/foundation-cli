var async  = require('async')
  , bower  = require('bower')
  , colors = require('colors')
  , exec   = require('exec')
  , fs     = require('fs')
  , isRoot = require('is-root')
  , npm    = require('npm')
  , path   = require('path')
  , rimraf = require('rimraf')
  , which  = require('which').sync
  , yeti   = require('../yeti');

module.exports = function(args, options) {
  var projectName = args[0];
  var projectFolder = path.join(process.cwd(), projectName);
  var gitClone = ["git", "clone", "https://github.com/zurb/foundation-apps-template.git", projectName];

  // 0. Show help screen if the user didn't enter a project name
  if (typeof projectName === 'undefined') {
    this.help(['new']);
    process.exit(0);
  }

  // 1. Stop if the process is being run as root
  if (isRoot()) {
    yeti([
      'Slow down there, friend!',
      '------------------------',
      'Running this installer as an administrator can cause problems.',
      'Try running this command again without "sudo" or administrator rights.'
    ]);
    process.exit(1);
  }

  // 2. Check that the user has git installed
  try {
    which('git');
  }
  catch (e) {
    console.log("\nYou need Git installed to get started. Download it here: " + "http://git-scm.com/downloads".cyan + '\n');
    process.exit(1);
  }

  // 3. Check if the folder already exists
  if (fs.existsSync(projectFolder)) {
    console.log("\nThere's already a folder named " + projectName.cyan + " here. Please use a different name or delete that folder.\n");
    process.exit(1);
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

    // 6. Remove the Git folder
    rimraf(path.join(projectFolder, '.git'), function() {});

    // 7. Change version number
    if (options.edge) {
      require('../changeVersion')('edge', projectName);
    }
    else if (options.version) {
      require('../changeVersion')(options.version, projectName);
    }

    // For debugging: force an npm error
    // rimraf(path.join(projectFolder, 'package.json'), function() {});

    // 8. Install dependencies
    console.log("\nDone downloading!".green + "\n\nInstalling dependencies...".cyan + "\n");

    var installers = [];

    installers.push(function(callback) {
      npm.load({ prefix: projectFolder, loaded: false }, function(err) {
        npm.commands.install([], function(err, data) {
          var success = err === null;
          callback(null, success);
        });
      });
    });

    installers.push(function(callback) {
      bower.commands.install(undefined, undefined, {
        cwd: projectFolder, silent: true, quiet: true, production: true })
      .on('err', function(err) {
        callback(null, false);
      })
      .on('end', function(data) {
        callback(null, true);
      });
    });

    async.parallel(installers, function(err, results) {
      var allGood = results.indexOf(false) === -1;

      if (allGood)
        console.log("\nYou're all set!\n".cyan);
      else
        console.log("\nThere were some problems during the installation.\n".cyan);

      if (results[0])
        console.log(" \u2713 Node modules installed.".green);
      else
        console.log(" \u2717 Node modules not installed.".red + " Try running " + "npm install".cyan + " manually.");

      if (results[1])
        console.log(" \u2713 Bower components installed.".green);
      else
        console.log(" \u2717 Bower components not installed.".red + " Try running " + "bower install".cyan + " manually.");

      if (allGood)
        console.log("\nNow run " + "foundation-apps watch ".cyan + "while inside your project's folder.\n");
      else
        console.log("\nOnce you've resolved the above issues, run " + "foundation-apps watch ".cyan + "while inside the" + projectName.cyan + " folder.\n");
    });
  });
}