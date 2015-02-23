var fs = require('fs');

module.exports = function(cb) {
  fs.unlinkSync('client/assets/scss/_settings.scss');
  fs.createReadStream('bower_components/foundation-apps/scss/_settings.scss')
    .pipe(fs.createWriteStream('client/assets/scss/_settings.scss'))
    .on('finish', function() {
      cb();
    });
}