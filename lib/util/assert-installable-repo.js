var fs   = require('fs');
var inquirer = require('inquirer');

module.exports = function assertInstallableRepo(callback) {
  var paths = ['src/assets/scss/components', 'src/partials', 'src/assets/js'];
  var question = {message: 'Do you want to download as a zip file?', default: 'y',
                  name: 'zip', type: 'list',
                  choices: [{name: 'Yes', value: 'y'}, {name: 'No', value: 'n'}]};
  for(var i = 0; i < paths.length; i++) {
    if(!fs.existsSync(paths[i])) {
      console.log("You don't appear to be in a ZURB stack project, so we can't automatically install building blocks");
      inquirer.prompt(question, function(answer) {
        if(answer.zip === 'y') {
          callback('zip');
        } else {
          process.exit(1);
        }
      });
      return;
    }
  }
  callback('install');
}

