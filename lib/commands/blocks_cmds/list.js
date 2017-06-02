var fetchUrl = require('../../util/fetch-url')
var _    = require('lodash');
var pkg  = require("../../../package.json")
var manifest = pkg.foundationRepos.manifests.blocks;


exports.describe = "List available building block kits"

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage('Usage: \n$0 blocks list')
    .epilogue("Your list.")
}



exports.handler = (argv) => {
  fetchUrl('foundation.zurb.com', manifest, function(blocksJson) {
    var blocks = JSON.parse(blocksJson);
    _.each(blocks, function(value, key) {
//      TODO: handle version info, etc
      console.log(key + ': ' + value.name);
    });
  });
}
