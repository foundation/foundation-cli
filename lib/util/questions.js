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

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What\'s the project called?',
      validate: function(input) {
        var folder = path.join(process.cwd(), input);
        if (fs.existsSync(folder)) {
          return 'There\'s already a folder with that name in this directory.';
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
        name: 'Basic: includes a Sass compiler',
        value: 'basic'
      }, {
        name: 'Advanced: includes a static site generator, and Sass/JS compilers',
        value: 'advacned'
      }],
      when: function(answers) {
        return answers.framework === 'sites' || options.framework === 'sites';
      }
    });
  }

  return questions;
}
