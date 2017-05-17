var term   = require('terminal-kit').terminal;
var cwd    = process.cwd();
var path   = require('path');
var pkg;
//

module.exports = function(args = {}) {
  try {
    pkg    = req('package.json');
  } catch(e) {
    term.red.error("There is no initialized project in this directory!\n");
    process.exit(e.code);
  }

  term.cyan("^_Project directory:\n");
  term(path.join(path.basename(cwd),"/") + "\n");
  // project name and version
  if (/^(version|name)$/.test(args[0]) || args[0] === undefined) {
    term.cyan("^_Project name:\n");
    term(pkg.name + " v" + pkg.version + "\n");
    if (args[0] !== undefined) process.exit(0);
  }
  // template version
  if (pkg.description && args[0] === "description" || args[0] === undefined) {
    term.cyan("^_Project description:\n");
    term(pkg.description + "\n");
  }

}


function req(module) {
  return require(path.join(cwd,module));
}
