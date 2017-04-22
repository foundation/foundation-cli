module.exports = function(d) {
    // d == dialogue
    return {
        helloYeti: [
            'Thanks for using ZURB Foundation for %s!',
            '-------------------------------------------',
            'Let\'s set up a new project.',
            'It shouldn\'t take more than a minute.'
        ],
        folderExists: "\nThere's already a folder named " + d.projectName + " here. Please use a different name or delete that folder.\n",

        downloadingTemplate: "\nDownloading the "+ d.messageTemplate + " template for your " + d.projectName + " project...\n\n",

        gitCloneError: "There was an issue running " + "git clone " + "to download the framework " + "Foundation for " + d.frameworkName + " and template " + d.messageTemplate +".\nMake sure your computer's Git is configured properly and then try again.",

        installingDependencies: "\nDone downloading!" + "\n\nInstalling dependencies..." + "\n",

        gitCloneSuccess: " \u2713 New project folder created.",
        installSuccess: "\nYou're all set!\n",

        installFail: "\nThere were some problems during the installation.\n",

        npmSuccess: " \u2713 Node modules installed.",

        npmFail: " \u2717 Node modules not installed." + " Try running " + "npm install" + " manually.",

        bowerSuccess: " \u2713 Bower components installed.",

        bowerFail: " \u2717 Bower components not installed." + " Try running " + "bower install" + " manually.",

        installSuccessFinal: "\nNow run " + "foundation watch " + "while inside the " + d.projectName + " folder.\n",

        installFailFinal: "\nOnce you've resolved the above issues, run " + "foundation watch " + "while inside the " + d.projectName + " folder.\n"
    }
}

module.exports.noRoot = [
    'Slow down there, friend!',
    '------------------------',
    'Running this installer as an administrator can cause problems.',
    'Try running this command again without "sudo" or administrator rights.'
];

module.exports.gitNotInstalled = "\nYou need Git installed to get started. Download it here: " + "http://git-scm.com/downloads" + "\n";
