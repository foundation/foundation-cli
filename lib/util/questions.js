var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

module.exports = function(options) {
  var questions = [];

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
    when: function () {
      if (!options.framework || !options.framework.match(/^(site|app|email)s?$/i))
        return true;
    }
  });

  questions.push({
    type: 'input',
    name: 'directory',
    message: 'What\'s the project called?' + chalk.dim(' (no spaces)'),
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
    <<<<<<< HEAD
    when: function(answers) {
      return options.directory === undefined;
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
      return options.framework === undefined;
      // var f = options.framework;
      // if (!f) {
      //   return true;
      // }
      // if (!(f in options.repo.framework)) {
      //   return true;
      // }
    }
  });
  =======
    when: function () {
      if (!options.directory)
        return true;
    }
});

>>>>>>> upstream/master

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
    if (!options.template && (answers.framework === 'sites' || options.framework === 'sites'))
      return true;
  }
});
return questions;
}
