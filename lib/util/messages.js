module.exports = function(projectName,messageFramework,messageTemplate) {
  return {
    helloYeti: [
      'Thanks for using ZURB Foundation for %s!',
      '-------------------------------------------',
      'Let\'s set up a new project.',
      'It shouldn\'t take more than a minute.'
    ],
    folderExists: "\nThere's already a folder named " + projectName.cyan + " here. Please use a different name or delete that folder.\n",
    downloadingTemplate: "\nDownloading the project template...".cyan,
    gitCloneError: "There was an issue running " + "git clone ".cyan + "to download the framework " + "Foundation for ".cyan + messageFramework.cyan + " and template " + messageTemplate.cyan +".\nMake sure your computer's Git is configured properly and then try again.",
    installingDependencies: "\nDone downloading!".green + "\n\nInstalling dependencies...".cyan + "\n",
    gitCloneSuccess: " \u2713 New project folder created.".green,
    installSuccess: "\nYou're all set!\n".cyan,
    installFail: "\nThere were some problems during the installation.\n".cyan,
    npmSuccess: " \u2713 Node modules installed.".green,
    npmFail: " \u2717 Node modules not installed.".red + " Try running " + "npm install".cyan + " manually.",
    bowerSuccess: " \u2713 Bower components installed.".green,
    bowerFail: " \u2717 Bower components not installed.".red + " Try running " + "bower install".cyan + " manually.",
    installSuccessFinal: "\nNow run " + "foundation watch ".cyan + "while inside the " + projectName.cyan + " folder.\n",
    installFailFinal: "\nOnce you've resolved the above issues, run " + "foundation watch ".cyan + "while inside the " + projectName.cyan + " folder.\n"
  }
}

module.exports.noRoot = [
  'Slow down there, friend!',
  '------------------------',
  'Running this installer as an administrator can cause problems.',
  'Try running this command again without "sudo" or administrator rights.'
];

module.exports.gitNotInstalled = "\nYou need Git installed to get started. Download it here: " + "http://git-scm.com/downloads".cyan + "\n";
