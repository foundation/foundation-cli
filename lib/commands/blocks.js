var chalk = require('chalk');

var usage = chalk.underline('Usage:') + '\n' + chalk.cyan('$0 blocks install <block>') + '\n' +  chalk.cyan('$0 blocks list')

exports.description = "List and install building blocks"
exports.aliases = ["block"]

exports.builder = (yargs) => {
  return yargs
    .strict(true)
    .usage(usage)
    .commandDir('./blocks_cmds',{
      extensions: ['js']
    })
    .demandCommand(1, 'You need to specify a sub-command before moving on!')
    .epilogue("List available building block kits, or install them")
}

exports.handler = () => {}
