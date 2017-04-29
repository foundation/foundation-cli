var term       = require('terminal-kit').terminal;
var fs         = require('fs');
var npm        = require('npm');
var path       = require('path');


module.exports = function(args, options) {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      term("\nYou don't appear to be in a Foundation project folder.\n\nUse ").red("`pwd`")(" (or ").red(" `chdir`")(" on Windows) to see what folder you're in.\n");
    process.exit(0);
  }

  npm.load({ prefix: process.cwd(), loaded: false }, function(err) {
    npm.commands.start.apply(this, []);
  });
}
