#!/usr/bin/env node

var fs     = require('fs');
var exec   = require('exec');
var colors = require('colors');
var git    = require('nodegit');

var args = process.argv.slice(2);

// No other arguments given
if (typeof args[0] === 'undefined') {
  console.error("You didn't type nothing in.")
}
else {
  // git.Repo.clone('https://github.com/zurb/foundation-apps.git', "./"+args[0], null, function(err, repo) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log("It worked!");
  //   }
  // });

  var gitClone = ['git', 'clone', 'https://github.com/zurb/foundation-apps.git', args[0]];
  var npmInstall = ['npm', 'install'];

  process.stdout.write("Downloading the Foundation for Apps stack...".cyan);
  exec(gitClone, function(err, out, code) {
    if (err instanceof Error) throw err;
    else {
      process.stdout.write(" Done downloading!\n");
      process.stdout.write("\nInstalling dependencies...".cyan);
      exec(npmInstall, {cwd: './'+args[0]}, function(err, out, code) {
        if (err instanceof Error) throw err;
        else {
          process.stdout.write(" Done installing!\n");
          process.stdout.write("\nYou're all set! Now run ");
          process.stdout.write("npm test ".cyan);
          process.stdout.write("while inside the ");
          process.stdout.write(args[0].cyan)
          process.stdout.write(" folder.\n\n");
        }
      })
    }
  });
}
