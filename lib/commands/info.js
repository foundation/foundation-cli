var term   = require('terminal-kit').terminal;
var cwd    = process.cwd();
var path   = require('path');
var chalk  = require('chalk');
var pkg;
//

var usage = chalk.underline('Usage') +
  chalk.cyan(':\n$0 info [name|version]');

exports.describe  = "Get information about the project in the working directory."


exports.builder = ( yargs ) => {
  return yargs
    .strict(true)
    .usage(usage)
    .epilogue(
      "Run the command without a subcommand to get the full project description."
    )
};

exports.handler = ( argv ) => {
  var args = argv._;
  try {
    pkg  = req('package.json');
  } catch(e) {
    term.red.error("There is no initialized project in this directory!\n");
    process.exit(e.code);
  }

  term.cyan("^_Project directory:\n");
  term(path.join(path.basename(cwd),"/") + "\n");
  //  project name and version
  if (/^(version|name)$/.test(args[1]) || args[1] === undefined) {
    term.cyan("^_Project name:\n");
    term(pkg.name + " v" + pkg.version + "\n");
    if (args[1] !== undefined) process.exit(0);
  }
  //  template version
  if (pkg.description && (args[1] === "description" || args[1] === undefined)) {
    term.cyan("^_Project description:\n");
    term(pkg.description + "\n");
  }

}

function req(module) {
  return require(path.join(cwd,module));
}
