var chalk = require('chalk');

exports.description = "List and install building block kits"
exports.aliases = ["kit"]

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage(chalk.underline('Usage') + ': \n$0 kits list\n$0 kits install <kit>')
    .commandDir('./kits_cmds',{
      extensions: ['js'],
      recurse: true
    })
    .demandCommand(1, 'You need to specify a sub-command before moving on!')
    .epilogue("List available building block kits, or install them")
}

exports.handler = (argv) => {}
