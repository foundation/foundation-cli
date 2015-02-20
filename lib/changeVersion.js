var fs = require('fs');
var semver = require('semver');
var path = require('path');
var colors = require('colors');

module.exports = function(version, projectName) {
  var bowerPath = path.join(process.cwd(), projectName, 'bower.json');
  var bowerJSON = require(bowerPath);
  
  if (version === 'edge') {
    bowerJSON.dependencies['foundation-apps'] = 'master';
    fs.writeFileSync(bowerPath, JSON.stringify(bowerJSON, null, '  '));
  }
  else if (semver.valid(version)) {
    bowerJSON.dependencies['foundation-apps'] = version;
    fs.writeFileSync(bowerPath, JSON.stringify(bowerJSON, null, '  '));
  }
  else {
    console.log("\n\n" + version.cyan + " isn't a valid version number.".cyan)
    console.log("It should have the format x.x.x, where x is a number.\n");
  }
}