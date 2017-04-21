module.exports = {
    responses: require('./conversation'),
  help: require('./commands/help'),
  new: require('./commands/new'),
  update: require('./commands/update'),
  watch: require('./commands/watch'),
  build: require('./commands/build'),
  blocks: require('./commands/blocks'),
  kits: require('./commands/kits')
}
