var term = require( 'terminal-kit' ).terminal;

var say = function (statement, dialogueTree = undefined) {
  if (dialogueTree === undefined) {
    term(statement + "\n");
    return;
  }
  term(dialogueTree[statement].join('\n')+'\n');
};

module.exports = say;
