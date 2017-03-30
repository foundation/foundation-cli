var http = require('http');
var _    = require('lodash');

var subcommands = {
  list: listBuildingBlocks
}
module.exports = function(args, options, callback, ee) {
  var fn = subcommands[args[0]]
  fn(options, callback);
}

function listBuildingBlocks(options, callback) {
  fetchUrl('foundation.zurb.com', '/beta/building-blocks/data/building-blocks.json', function(blocksJson) {
    var blocks = JSON.parse(blocksJson);
    _.each(blocks, function(value, key) {
      console.log(key + ': ' + value.name);
    });
    if(callback) {callback()};
  });
}

function fetchUrl(host, path, done) {
  var options = {
    host: host,
    path: path,
    headers: {'Authorization': 'Basic enVyYjp5ZXRpaG90'}
  };
  var callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      done(str)
    });
  };
  http.request(options, callback).end();
}
