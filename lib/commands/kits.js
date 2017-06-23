var term = require( 'terminal-kit' ).terminal;
var async = require('async');
var _    = require('lodash');
var fs   = require('fs');

var fetchUrl = require('../util/fetch-url')
var help = require('./help')
var blockCommand = require('./blocks');
var assertInstallableRepo = require('../util/assert-installable-repo');

var subcommands = {
  list: listKits,
  install: installKit
};

module.exports = function(args, options, callback) {
  var fn = subcommands[args[0]]
  if(fn) {
    fn(args.slice(1), options, callback);
  } else {
    help(['kits']);
  }
}

function listKits(args, options, callback) {
  getKitList(function(kits) {
    var i = 0;
    var index = "";
    _.each(kits, function(value, key) {
      // TODO: handle version info, etc
      i++;
      index = (" "+i).substr(-3);
      term.dim(index + ") ").cyan(key)(": " + value.total + ' blocks\n');
    });
  });
}

function getKitList(callback) {
  // For now until kits are implemented, use categories to test out build
  fetchUrl('foundation.zurb.com', '/building-blocks/data/kits.json', function(kitJson) {
    var kits = JSON.parse(kitJson);
    callback(kits);
  });
}

function installKit(args, options, callback) {
  var name = args[0];
  assertInstallableRepo(function(type) {
    if(type === 'zip') {
      downloadZipFile(name, function() {
        console.log('downloaded ' + name + '.zip');
      });
    } else {
      getKitList(function(kits) {
        if (!kits[name]) {
          console.log('Could not find kit: ', name);
          if(callback) {callback();}
          return;
        }
        var blocks = kits[name].blocks;
        async.eachSeries(blocks, function(block, cb) {
          blockCommand(['install', block.datakey], {}, cb);
        }, function() {
          console.log("done installing kit: ", name);
          if(callback) {callback();}
        })
      });
    }
  });
}

function downloadZipFile(name, callback) {
  var filename = name + '.zip';
  var path = '/building-blocks/files/kits/' + filename;
  fetchUrl('foundation.zurb.com', path, function(file) {
    if(file.length > 0) {
      fs.writeFile(filename, file,  callback);
    } else {
      console.log("could not find kit: " + name);
      process.exit(1);
    }
  });

}
