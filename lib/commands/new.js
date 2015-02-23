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
  var messages = require('../messages')(projectName);

  // 0. Show help screen if the user didn't enter a project name
  if (typeof projectName === 'undefined') {
    this.help(['new']);
    process.exit(0);
  }

  // 1. Stop if the process is being run as root
  if (isRoot()) {
    yeti(messages.noRoot);
    process.exit(1);
  }

  // 2. Check that the user has git installed
  try {
    which('git');
  } catch (e) {
    console.log(messages.gitNotInstalled);
    process.exit(1);
  }

  // 3. Check if the folder already exists
  if (fs.existsSync(projectFolder)) {
    console.log(messages.folderExists);
    process.exit(1);
  }

  // 4. Greet the user!
  yeti(messages.helloYeti);
  process.stdout.write(messages.downloadingTemplate);

  // 5. Clone the template repo
  exec(gitClone, function(err, out, code) {
    if (err instanceof Error) {
      console.log(messages.gitCloneError);
      process.exit(1);
    }

    process.chdir(projectName);

    // 6. Remove the Git folder
    rimraf('.git', function() {});

    // 7. Change version number
    if (options.edge) {
      require('../changeVersion')('edge');
    } else if (options.version) {
      require('../changeVersion')(options.version);
    }

    // For debugging: force an npm error
    // rimraf('package.json', function() {});

    // 8. Install dependencies
    console.log(messages.installingDependencies);

    var installers = [];

    installers.push(function(callback) {
      npm.load({ prefix: process.cwd(), loaded: false }, function(err) {
        npm.commands.install([], function(err, data) {
          var success = err === null;
          callback(null, success);
        });
      });
    });

    installers.push(function(callback) {
      bower.commands.install(undefined, undefined, {
        cwd: process.cwd(), silent: true, quiet: true, production: true })
      .on('err', function(err) {
        callback(null, false);
      })
      .on('end', function(data) {
        require('../copySettings')(function() {
          callback(null, true);
        });
      });
    });

    async.parallel(installers, function(err, results) {
      var allGood = results.indexOf(false) === -1;

      if (allGood)
        console.log(messages.installSuccess);
      else
        console.log(messages.installFail);

      console.log(messages.gitCloneSuccess);

      if (results[0])
        console.log(messages.npmSuccess);
      else
        console.log(messages.npmFail);

      if (results[1])
        console.log(messages.bowerSuccess);
      else
        console.log(messages.bowerFail);

      if (allGood)
        console.log(messages.installSuccessFinal);
      else
        console.log(messages.installFailFinal);
    });
  });
}