var http = require('http');

module.exports = function fetchUrl(host, path, done) {
  var options = {
    host: host,
    path: path
  };
  var callback = (response) => {
    var data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      if(response.statusCode === 200) {
        var buffer = Buffer.concat(data);
        done(buffer);
      } else if (response.statusCode === 404) {
        done('');
      } else {
        console.log('error fetching file', path);
        done('');
      }
    });
  };
  http.request(options, callback).end();
}
