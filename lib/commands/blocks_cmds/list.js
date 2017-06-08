var term     = require('terminal-kit').terminal;
var _        = require('lodash');
var fetchUrl = require('../../util/fetch-url')
var chalk    = require('chalk');
var pkg      = require("../../../package.json")
var manifest = pkg.foundationRepos.manifests.blocks;


exports.describe = "List available building block kits"

var usage = chalk.underline('Usage:') + '\n' + chalk.cyan('$0 blocks list');

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage(usage)
    .epilogue("Your list is served.")
}


exports.handler = () => {
  fetchUrl('foundation.zurb.com', manifest, function(blocksJson) {
    var i = 0;
    var index = "";
    var blocks = JSON.parse(blocksJson);
    _.each(blocks, function(value, key) {
      i++;
      index = ("  "+i).substr(-3);
      term.dim(index + ") ").cyan(key)(": " + value.name + "\n");
    });
  });
}
