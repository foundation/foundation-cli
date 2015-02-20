var colors = require('colors');

module.exports = function() {
  var bower = require('bower');

  bower.commands.update(undefined, undefined, {
    cwd: process.cwd(), loglevel: 'warn', production: true })
  .on('err', function(err) {
    console.log(err);
  })
  .on('end', function(data) {
    if (!Object.keys(data).length) {
      console.log('\nNothing to update. '.cyan + 'You\'re good!\n');
    }
  });
}