var fs = require('fs');
var semver = require('semver');
var path = require('path');

module.exports = function(version, projectName) {
  if (semver.valid(version)) {
    var bowerPath = path.join(process.cwd(), projectName, 'bower.json');
    var bowerJSON = require(bowerPath);

    bowerJSON.dependencies['foundation-apps'] = version;
    fs.writeFileSync(bowerPath, JSON.stringify(bowerJSON, null, '  '));
  }
  else {
    console.log("\n\n" + version.cyan + " isn't a valid version number.".cyan)
    console.log("It should have the format x.x.x, where x is a number.\n");
  }
}