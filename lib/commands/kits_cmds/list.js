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



  exports.handler = (argv) => {
    fetchUrl('foundation.zurb.com', manifest, function(kitsJson) {
      var kits = JSON.parse(kitsJson);
      _.each(kits, function(value, key) {
	//      TODO: handle version info, etc
	console.log(key + ': ' + value.name);
})
});
}
