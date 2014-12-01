#!/usr/bin/env node

var nopt       = require('nopt');
var foundation = require('./lib/foundationCLI');

var options = {
  "libsass": Boolean,
  "version": String
}
var shorthands = {
  "v": "version"
}
var parsed = nopt(options);
var cmd = {
  args: parsed.argv.remain,
  opts: parsed
}

// No other arguments given
if (typeof cmd.args[0] === 'undefined') {
  if (typeof cmd.opts.version !== 'undefined') {
    process.stdout.write("Foundation CLI version " + require('./package.json').version + '\n');
  }
  else {
    foundation.help();
  }
}
else {
  if (typeof foundation[cmd.args[0]] == 'undefined') {
    foundation.help();
  }
  else {
    foundation[cmd.args[0]](cmd.args.slice(1), cmd.opts);
  }
}
