var fs = require('fs');
var semver = require('semver');
var path = require('path');
var colors = require('colors');

module.exports = function(version) {
  console.log(process.cwd());
  var bowerJSON = require(path.join(process.cwd(), 'bower.json'));
  
  if (version === 'edge') {
    bowerJSON.dependencies['foundation-apps'] = 'master';
    fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));
  }
  else if (semver.valid(version)) {
    bowerJSON.dependencies['foundation-apps'] = version;
    fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));
  }
  else {
    console.log("\n\n" + version.cyan + " isn't a valid version number.".cyan)
    console.log("It should have the format x.x.x, where x is a number.\n");
  }
}
