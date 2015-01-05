var which = require('which').sync;

module.exports = function() {
  var problems = false;

  // Check for Git
  try {
    which('git');
  }
  catch (e) {
    console.log("\nYou need Git installed to get started. Download it here: " + "http://git-scm.com/downloads".cyan);
    problems = true;
  }

  // Check for Ruby
  try {
    which('ruby');
  }
  catch (e) {
    console.log("\nYou need Ruby installed to get started. Download it here: " + "https://www.ruby-lang.org/en/downloads/".cyan);
    problems = true;
  }

  // Check for Bundler
  try {
    which('bundle');
  }
  catch (e) {
    console.log("You need Bundler installed to get started. With Ruby installed, type " + "gem install bundler".cyan + " into your command line.");
    problems = true;
  }

  // Exit the CLI if any needed programs are missing
  if (problems) {
    console.log(""); // Extra whitespace after output
    process.exit(0);
  }
}