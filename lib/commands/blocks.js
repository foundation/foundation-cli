var http = require('http');
var _    = require('lodash');
var fs   = require('fs');
var inquirer = require('inquirer');
var async = require('async');
var yaml = require('js-yaml');

var subcommands = {
  list: listBuildingBlocks,
  install: installBuildingBlock
};

module.exports = function(args, options, callback, ee) {
  var fn = subcommands[args[0]]
  fn(args.slice(1), options, callback);
}

function listBuildingBlocks(args, options, callback) {
  fetchUrl('foundation.zurb.com', '/beta/building-blocks/data/building-blocks.json', function(blocksJson) {
    var blocks = JSON.parse(blocksJson);
    _.each(blocks, function(value, key) {
      // TODO: handle version info, etc
      console.log(key + ': ' + value.name);
    });
    if(callback) {callback()};
  });
}

function installBuildingBlock(args, options, callback) {
  var name = args[0];
  assertInstallableRepo(function(type) {
    if(type === 'zip') {
      downloadZipFile(name, function() {
        console.log('downloaded ' + name + '.zip');
      });
    } else {
      installFiles(name, function() {
        async.parallel([updateAppSCSS.bind(null, name), updateConfigYml.bind(null, name)]
        , function() {
          console.log("installed ", name);
          if(callback) {callback();}
        });
      });
    }
  });
}

function updateConfigYml(name, callback) {
  var doc         = fs.readFileSync('config.yml', 'utf8'),
      jsString    = "src/assets/js/building-blocks/" + name + ".js",
      appJsString = "src/assets/js/app.js",
      lineNum = -1;

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
  fs.readFile('src/assets/scss/app.scss', {}, function(err, content) {
    line = "@import 'components/building-blocks/" + name + "';"
    if(content.indexOf(line) === -1) {
      content = content + "\n" + line;
    }
    fs.writeFile('src/assets/scss/app.scss', content, callback);
  });
};

function fetchUrl(host, path, done) {
  var options = {
    host: host,
    path: path,
    headers: {'Authorization': 'Basic enVyYjp5ZXRpaG90'}
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
  http.request(options, callback).end();
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
function installFiles(name, callback) {
  async.each(FILETYPES, function(filetype, cb) {
    var filename = name + filetype.name;
    var path = '/beta/building-blocks/files/building-blocks/' + name + '/' + filename;
    fs.mkdir(filetype.directory, function() {
      fetchUrl('foundation.zurb.com', path, function(file) {
        if(file.length > 0) {
          fs.writeFile(filetype.directory + filetype.prefix + filename, file,  cb);
        } else {
          cb();
        }
      });
    });
  }, callback)
}

function downloadZipFile(name, callback) {
  var filename = name + '.zip';
  var path = '/beta/building-blocks/files/building-blocks/' + filename;
  fetchUrl('foundation.zurb.com', path, function(file) {
    if(file.length > 0) {
      fs.writeFile(filename, file,  callback);
    } else {
      console.log("could not find building block!");
      process.exit(1);
    }
  });

}
function assertInstallableRepo(callback) {
  var paths = ['src/assets/scss/components', 'src/partials', 'src/assets/js'];
  var question = {message: 'Do you want to download as a zip file?', default: 'y',
                  name: 'zip', type: 'list',
                  choices: [{name: 'Yes', value: 'y'}, {name: 'No', value: 'n'}]};
  for(var i = 0; i < paths.length; i++) {
    if(!fs.existsSync(paths[i])) {
      console.log("You don't appear to be in a ZURB stack project, so we can't automatically install building blocks");
      inquirer.prompt(question, function(answer) {
        if(answer.zip === 'y') {
          callback('zip');
        } else {
          process.exit(1);
        }
      });
      return;
    }
  }
  callback('install');
}
