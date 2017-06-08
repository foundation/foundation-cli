var term = require( 'terminal-kit' ).terminal;
var fetchUrl = require('../../util/fetch-url')
var _    = require('lodash');
var pkg  = require("../../../package.json")
var manifest = pkg.foundationRepos.manifests.kits;

exports.describe = "List available building block kits";

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage('Usage: \n$0 kits list')
    .epilogue("Your list.")
}

exports.handler = () => {
  fetchUrl('foundation.zurb.com', manifest, function(kitsJson) {
    var i = 0;
    var index = "";
    var kits = JSON.parse(kitsJson);
    _.each(kits, function(value, key) {
      i++;
      index = ("  "+i).substr(-3);
      term.dim(index + ") ").cyan(key)(": " + value.name  + '\n' );
    })
  });
}
