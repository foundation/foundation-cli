var term = require( 'terminal-kit' ).terminal;
var async = require('async');
var _    = require('lodash');
var fs   = require('fs');
var pjoin = require('path').join;

var fetchUrl = require('../util/fetch-url')
var help = require('./help')
var blockCommand = require('./blocks');
var assertInstallableRepo = require('../util/assert-installable-repo');


var pkg = require('../../package.json');
var kitsJSON = pkg.foundationRepos.kits.JSON;
var kitsBase = pkg.foundationRepos.kits.base;



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

function fetchBuildingBlocks(host, path, callback) {
  fetchUrl(host, path, callback);
}

function listKits(args, options, callback) {
  fetchBuildingBlocks('foundation.zurb.com', kitsJSON, function (data)
    {
      var i = 0;
      var index = "";
      var kits = JSON.parse(data);
      _.each(kits, function(value, key) {
        // TODO: handle version info, etc
        i++;
        index = (" "+i).substr(-3);
        term.dim(index + ") ").cyan(key)(": " + value.total + ' blocks\n');
      });
      if(callback) {callback()};
    });
}


function installKit(args, options, callback) {
  fetchBuildingBlocks('foundation.zurb.com', kitsJSON, function(data) {
    var name = args[0];
    if (Number.isInteger(1*name)) {
      var selection = 1*name;
      var i = 0;
      var kits = JSON.parse(data);
      _.each(kits, function(value, key) {
        i++;
        if (selection === i) {
          name = key;
        }
      });
    }

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
  });
}

function downloadZipFile(name, callback) {
  if (Number.isInteger(name)) {

  }
  var filename = name + '.zip';
  var path = pjoin(kitsBase, filename);
  fetchUrl('foundation.zurb.com', path, function(file) {
    if(file.length > 0) {
      fs.writeFile(filename, file,  callback);
    } else {
      console.log("could not find kit: " + name);
      process.exit(1);
    }
  });
}
