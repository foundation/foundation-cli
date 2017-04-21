var say = function (statement, dialogueTree = undefined) {
    if (dialogueTree === undefined) {
        return console.log(statement + "\n");
    }
    return process.stdout.write(dialogueTree[statement].join('\n')+'\n');
};

module.exports = say;
