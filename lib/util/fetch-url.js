var https = require('https');

module.exports = function fetchUrl(host, path, done) {
  var options = {
    host: host,
    path: path
  };
  var callback = function(response) {
    var data = [];
    response.on('data', function(chunk) {
      data.push(chunk);
    });
    response.on('end', function() {
      if(response.statusCode === 200) {
        var buffer = Buffer.concat(data);
        done(buffer);
      } else if (response.statusCode == 404) {
        done('');
      } else {
        console.log('error fetching file', path);
        done('');
      }
    });
  };
  https.request(options, callback).end();
}
