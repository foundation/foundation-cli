var async    = require('async');
var bower    = require('bower');
var colors   = require('colors');
var exec     = require('child_process').exec;
var fs       = require('fs');
var inquirer = require('inquirer');
var isRoot   = require('is-root');
var npm      = require('npm');
var path     = require('path');
var rimraf   = require('rimraf');
var which    = require('which');
var util     = require('../util');
var EventEmitter = require("events").EventEmitter;
var format   = require('util').format;

var repositories = {
  sites: {
    basic: 'https://github.com/zurb/foundation-sites-template.git',
    zurb: 'https://github.com/zurb/foundation-zurb-template.git'
  },
  apps: 'https://github.com/zurb/foundation-apps-template.git',
  emails: 'https://github.com/zurb/foundation-emails-template.git'
}

module.exports = function(args, options, callback, ee) {
  var projectName, projectFolder, framework, template, messages, directory;
  var tasks = [
    preflight, prompt, gitClone, folderSetup, npmInstall, bowerInstall
  ];

  // Each function below is executed in order
  async.series(tasks, finish);

  // 1. Check that the process isn't root, and that Git is installed
  function preflight(cb) {
    if (isRoot()) {
      console.log(util.mascot('sites', util.messages.noRoot));
      process.exit(1);
    }

    which('git', function(er) {
      if (er) {
        console.log(util.messages.gitNotInstalled);
        process.exit(69);
      }
      cb();
    });
  }

  // 2. Find out what the user wants to do
  function prompt(cb) {
    inquirer.prompt(util.questions(options), function(answers) {
      // The variables we need either came from the prompts, or the console arguments
      projectName = answers.directory || options.directory;
      framework = answers.framework || options.framework;
      template = answers.template || options.template || null;
      projectFolder = path.join(process.cwd(), projectName);
      messages = util.messages(projectName);

      cb();
    });
  }

  // 3. Clone the framework's template project
  function gitClone(cb) {
    var repo = framework === 'sites'
      ? repositories.sites[template]
      : repositories[framework];

    var cmd = format('git clone %s %s', repo, projectName);
    var hello = formatHello(messages.helloYeti, framework);

    console.log(util.mascot(framework, hello));
    process.stdout.write(messages.downloadingTemplate);

    // [TODO] Change to spawn and check for errors on stderr
    exec(cmd, function(err) {
      if (err instanceof Error) {
        console.log(messages.gitCloneError);
        process.exit(1);
      }

      process.chdir(projectFolder);

      cb();
    });

    if (typeof(ee) !== 'undefined') {
      ee.emit("cloneSuccess", projectName);
    }
  }

  // 4. Remove the Git folder and change the version number if applicable
  function folderSetup(cb) {
    rimraf('.git', function() {});
    console.log(messages.installingDependencies);
    cb();

    // if (options.edge) {
    //   util.changeVersion(directory, 'foundation-'+framework, 'master', cb);
    // }
    // else if (options.version) {
    //   util.changeVersion(directory, 'foundation-'+framework, options.version, cb);
    // }
    // else {
    //   cb();
    // }
  }

  // 5. Install Node dependencies
  function npmInstall(cb) {
    npm.load({ prefix: projectFolder, loglevel: 'error', loaded: false }, function(err) {
      npm.commands.install([], function(err, data) {
        if (options.debug && err) console.log(err);
        var success = err === null;
        if(success && typeof(ee) !== 'undefined') ee.emit("npmInstallSuccess", projectName);
        else if(typeof(ee) !== 'undefined') ee.emit("npmInstallFailure", projectName);
        cb(null, success);
      });
    });
  }

  // 6. Install Bower dependencies
  function bowerInstall(cb) {
    // Only run "bower install" if a bower.json is present
    if (!fs.existsSync('bower.json')) {
      cb(null, true)
    }
    else {
      bower.commands.install(undefined, undefined, {
        cwd: process.cwd(), silent: true, quiet: true, production: true })
      .on('err', function(err) {
        if (typeof ee !== 'undefined')
          ee.emit("bowerInstallFailure", projectName);
        cb(null, false);
      })
      .on('end', function(data) {
        if (typeof ee !== 'undefined')
          ee.emit("bowerInstallSuccess", projectName);
        cb(null, true);
      });
    }
  }

  // 7. Finish the process with a status report
  function finish(err, results) {
    // Indexes 4 and 5 of results are the npm/Bower statuses
    // All the rest should be undefined
    var allGood = results.indexOf(false) === -1;

    if (allGood)
      console.log(messages.installSuccess);
    else
      console.log(messages.installFail);

    console.log(messages.gitCloneSuccess);

    if (results[4])
      console.log(messages.npmSuccess);
    else
      console.log(messages.npmFail);

    if (results[5])
      console.log(messages.bowerSuccess);
    else if (fs.existsSync('bower.json'))
      console.log(messages.bowerFail);

    if (allGood)
      console.log(messages.installSuccessFinal);
    else
      console.log(messages.installFailFinal);

    if (typeof(callback)!=='undefined') callback();
  }
}

function formatHello(str, framework) {
  framework = framework.charAt(0).toUpperCase() + framework.slice(1)
  str = str.join('\n');
  str = str.replace('%s', framework);
  return str.split('\n');
}
