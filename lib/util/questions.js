var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  var questions = [];

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
    },
    when: function(answers) {
      return options.argv.directory === undefined;
    }
  });

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
    }],
    when: function (answers) {
      var f = options.argv.framework;
      if (!f) {
        return true;
      }
      if (!(f in options.repo.framework)) {
        return true;
      }
    }
  });

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

      if (answers.framework !== 'sites' && options.argv.framework !== 'sites')
        return true;
    }
  });
  return questions;
}
