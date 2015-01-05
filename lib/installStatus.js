var InstallStatus = function() {
  this.npm = null;
  this.bower = null;
  this.bundle = null;
}

InstallStatus.prototype = {
  update: function(step, status) {
    this[step] = status;

    if (this.npm !== null && this.bower !== null && this.bundle !== null) {
      this.finish();
    }
  },
  finish: function() {
    // Check to see if any components didn't install properly
    var allGood = true;
    if (this.npm == false || this.bower == false || this.bundle == null) {
      allGood = false;
    }

    // Opening message
    if (allGood) {
      console.log("\nYou're all set!\n".cyan);
    }
    else {
      console.log("\nThere were some problems during the installation.\n".cyan);
    }

    // 
    if (this.npm == true)
      console.log(" \u2713 Node modules installed.".green);
    else
      console.log(" \u2717 Node modules not installed.".red + " Try running " + "npm install".cyan + " manually.");
    if (this.bower == true)
      console.log(" \u2713 Bower components installed.".green);
    else
      console.log(" \u2717 Bower components not installed.".red + " Try running " + "bower install".cyan + " manually.");
    if (this.bundle == true)
      console.log(" \u2713 Ruby gems installed.".green);
    else
      console.log(" \u2717 Ruby gems not installed.".red + " Try running " + "bundle".cyan + " manually.");

    // Closing message
    if (allGood) {
      console.log("\nNow run " + "foundation-apps watch ".cyan + "while inside your project's folder.\n");
    }
    else {
      console.log("\nOnce you've resolved the above issues, run " + "foundation-apps watch ".cyan + "while inside your project's folder.\n");
    }
  }
}

module.exports = new InstallStatus();