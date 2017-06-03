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


const FILETYPES = [
  {
    name: '.html',
    directory: 'src/partials/building-blocks/',
    prefix: ''
  },
  {
    name: '.scss',
    directory: 'src/assets/scss/components/building-blocks/',
    prefix: '_'
  },
  {
    name: '.js',
    directory: 'src/assets/js/building-blocks/',
    prefix: ''
  }
];


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

function updateConfigYml(name, callback) {
  var doc         = fs.readFileSync('config.yml', 'utf8'),
    jsString    = "src/assets/js/building-blocks/" + name + ".js",
    appJsString = "src/assets/js/app.js",
    lineNum = -1;

  if(!fs.existsSync(jsString)) {
    if(callback) {callback();}
    return;
  }
  var lines = doc.split('\n');
  for(var line = 0; line < lines.length; line++){
    if (lines[line].indexOf(jsString) !== -1) {
      if(callback) {return callback();} else { return; }
    }
    if (lines[line].indexOf(appJsString) !== -1) {
      lineNum = line;
      break;
    }
  }
  if (lineNum !== -1) {
    lines.splice(lineNum, 0, '    - "' + jsString + '"');
    fs.writeFileSync('config.yml', lines.join("\n"));
  } else {
    console.log("failed to automatically update config.yml; make sure you include the appropriate js")
  }
  if(callback) {callback();}
}


function updateAppSCSS(name, callback) {
  var scssString    = "src/assets/scss/components/building-blocks/_" + name + ".scss";

  if(!fs.existsSync(scssString)) {
    if(callback) {callback();}
    return;
  }
  fs.readFile('src/assets/scss/app.scss', {}, function(err, content) {
    line = "@import 'components/building-blocks/" + name + "';"
    if(content.indexOf(line) === -1) {
      content = content + "\n" + line;
    }
    fs.writeFile('src/assets/scss/app.scss', content, callback);
  });
};
