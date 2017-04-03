var async = require('async');
var _    = require('lodash');

var fetchUrl = require('../util/fetch-url')
var blockCommand = require('./blocks');

var subcommands = {
  list: listKits,
  install: installKit
};

module.exports = function(args, options, callback) {
  var fn = subcommands[args[0]]
  fn(args.slice(1), options, callback);
}

function listKits(args, options, callback) {
  getKitList(function(kits) {
    _.each(kits, function(value, key) {
      // TODO: handle version info, etc
      console.log(key + ': ' + value.total + ' blocks');
    });
  });
}

function getKitList(callback) {
  // For now until kits are implemented, use categories to test out build
  fetchUrl('foundation.zurb.com', '/beta/building-blocks/data/categories.json', function(kitJson) {
    var kits = JSON.parse(kitJson);
    callback(kits);
  });
}

function installKit(args, options, callback) {
  var name = args[0];
  getKitList(function(kits) {
    var blocks = kits[name].blocks;
    async.each(blocks, function(block, cb) {
      blockCommand(['install', block.datakey, cb]);
    }, function() {
      console.log("done installing kit: ", name);
      if(callback) {callback();}
    })
  });
}
