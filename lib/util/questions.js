var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  var questions = [];

  if (!options.framework || !options.framework.match(/(site|app|email)s*/)) {
    questions.push({
      type: 'list',
      name: 'framework',
      message: 'What are you building today?',
      default: 'sites',
      choices: [{
        name: 'A website (Foundation for Sites)',
        value: 'sites'
      }, {
        name: 'A web app (Foundation for Apps)',
        value: 'apps'
      }, {
        name: 'An email (Foundation for Emails)',
        value: 'emails'
      }]
    });
  }

  if (!options.directory) {
    questions.push({
      type: 'input',
      name: 'directory',
      message: 'What\'s the project called? (no spaces)',
      validate: function(input) {
        var folder = path.join(process.cwd(), input);
        if (fs.existsSync(folder)) {
          return 'There\'s already a folder with that name in this directory.';
        }
        if (input.indexOf(" ") != -1) {
          return "The project name should not contain any spaces.";
        }
        return true;
      }
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      default: 'basic',
      choices: [{
        name: 'Basic Template: includes a Sass compiler',
        value: 'basic'
      }, {
        name: 'ZURB Template: includes Handlebars templates and Sass/JS compilers',
        value: 'zurb'
      }],
      when: function(answers) {
        return answers.framework === 'sites' || options.framework === 'sites';
      }
    });
  }

  return questions;
}
