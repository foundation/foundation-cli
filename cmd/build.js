var fs = require('fs');
var npm = require('npm');
var path = require('path');

module.exports = function(args, options) {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log("\nYou don't appear to be in a Foundation project folder.\n\nUse " + "pwd".cyan + " (or " + "chdir".cyan + " on Windows) to see what folder you're in.\n");
    process.exit(0);
  }

  var args = ['build'];

  npm.load({ prefix: process.cwd(), loaded: false }, function(err) {
    npm.commands['run-script'].apply(this, [args]);
  });
}
