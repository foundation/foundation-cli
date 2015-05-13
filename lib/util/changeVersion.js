var fs = require('fs');
var semver = require('semver');
var path = require('path');
var colors = require('colors');

/**
 * Changes the version number of a dependency in bower.json.
 * @param {String} cwd - Directory the bower.json file is inside.
 * @param {String} dep - Dependency to change.
 * @param {String} version - Semver-valid version to change to. `master` is also an acceptable version.
 * @param {Function} cb - Callback to run when the file is done being written to.
 */
module.exports = function(cwd, dep, version, cb) {
  if (semver.valid(version) || version === 'master') {
    var bowerPath = path.join(cwd, 'bower.json');
    var bowerJSON = require(bowerPath);

    bowerJSON.dependencies[dep] = version;
    fs.writeFile(bowerPath, JSON.stringify(bowerJSON, null, '  '), cb);
  }
}
