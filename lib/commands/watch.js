var fs = require('fs');
var npm = require('npm');
var path = require('path');
var os = require('os');
//
var platform = os.platform();
var platformResponse = function() {
  var r = "";
  if (["darwin","freebsd","linux","openbsd","sunos"].indexOf(platform) > -1)
    r = "pwd";
  if (["win32"].indexOf(platform) > -1)
    r = "chdir";
  if (r === "")
    r = "the appropriate command";
  return "\nYou don't appear to be in a Foundation project folder.\n\nUse " + r.cyan + " to see what folder you're in.\n";
}

module.exports = function(args, options) {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json')))
    console.log(platformResponse());

  process.exit(0);

  npm.load({ prefix: process.cwd(), loaded: false }, function(err) {
    npm.commands.start.apply(this, []);
  });
}
