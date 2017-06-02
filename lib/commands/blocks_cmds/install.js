var _    = require('lodash');
var fs   = require('fs');
var async = require('async');
var yaml = require('js-yaml');
var fetchUrl = require('../../util/fetch-url')

var assertInstallableRepo = require('../../util/assert-installable-repo');

exports.description = "Install a building block. Choose from listing."

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage('Usage: \n$0 blocks install <block>')
}



exports.handler = (argv) => {
  var name = argv._[2];

  assertInstallableRepo(function(type) {
    console.log("\n\n\n\n\n\n")

    downloadZipFile(name, function(err) {
      if(err) {
	console.log(err);
      } else {
	console.log('downloaded ' + name + '.zip');
      }
    });


    if(type === 'zip') {

      downloadZipFile(name, function(err) {
	if(err) {
	  console.log(err);
	} else {
	  console.log('downloaded ' + name + '.zip');
	}
      });
    }
    else {
      installFiles(name, function(err, results) {
	if(results && _.every(results)) {
	  console.log('Not found: ' + name)
	} else {
	  async.parallel([updateAppSCSS.bind(null, name), updateConfigYml.bind(null, name)]
	    , function() {
	      console.log("installed ", name);
	      if(callback) {callback();}
	    });
	}
      });
    }
  });

}



function downloadZipFile(name, callback) {
  var filename = name + '.zip';
  var path = '/building-blocks/files/building-blocks/' + filename;
  fetchUrl('foundation.zurb.com', path, function(file) {
    if(file.length > 0) {
      fs.writeFile(filename, file,  callback);
    } else {
      console.log("could not find building block: " + name);
      process.exit(1);
    }
  });
}


function installFiles(name, callback) {
  async.map(FILETYPES, function(filetype, cb) {
    var filename = name + filetype.name;
    var path = '/building-blocks/files/building-blocks/' + name + '/' + filename;
    fs.mkdir(filetype.directory, function() {
      fetchUrl('foundation.zurb.com', path, function(file) {
	if(file.length > 0) {
	  fs.writeFile(filetype.directory + filetype.prefix + filename, file,  cb);
	} else {
	  cb(null, true);
	}
      });
    });
  }, callback)
}
