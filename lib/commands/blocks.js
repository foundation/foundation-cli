var http = require('http');
var _    = require('lodash');
var fs   = require('fs');
var inquirer = require('inquirer');
var async = require('async');

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
      console.log("would install ", name, "as type", type);
    } else {
      installFiles(name, function() {
        console.log('Installed ' + name);
        if(callback) {callback();}
      });
    }
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

const FILETYPES = [
  {
    name: '.html',
    directory: 'src/partials/building-blocks/'
  },
  {
    name: '.scss',
    directory: 'src/assets/scss/components/building-blocks/'
  },
  {
    name: '.js',
    directory: 'src/assets/js/building-blocks/'
  }
];
function installFiles(name, callback) {
  async.each(FILETYPES, function(filetype, cb) {
    var filename = name + '/' + name + filetype.name;
    var path = '/beta/building-blocks/files/building-blocks/' + filename
    fs.mkdir(filetype.directory, function() {
      fs.mkdir(filetype.directory + name, function() {
        fetchUrl('foundation.zurb.com', path, function(file) {
          fs.writeFile(filetype.directory + filename, {},  cb);
        });
      });
    });
  }, callback)
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
