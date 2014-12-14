# Foundation CLI

This is the command-line interface for Foundation for Apps. It downloads our [template stack](https://github.com/zurb/foundation-apps-template) and installs the dependencies.

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
    * With Node installed, run `[sudo] npm install -g gulp bower`.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  * [Ruby](https://www.ruby-lang.org/en/): Use the installer for your OS. For Windows users, [JRuby](http://jruby.org/) is a popular alternative.
    * With Ruby installed, run `gem install bundler`.

## Installing

The Foundation CLI is installed through npm.

```bash
npm install -g foundation-cli
```

This will add the `foundation-apps` command to your system.

### Updating

The CLI periodically gets updates that add features or fix bugs. Use npm to upgrade the CLI to the newest version.

```bash
npm update -g foundation-cli
```

## Commands

### New

Downloads and installs a Foundation for Apps project, with the folder name you specify.

```bash
foundation-apps new appName
```

### Watch

While inside of your app's folder, use the `watch` command to assemble your app and run a test server.

```bash
cd appName
foundation-apps watch
```

While this process is running, you can view the assembled app in your browser, at this URL:

```
http://localhost:8080
```

While the server is running, any changes you make to your HTML, Sass, or JavaScript will automatically be processed and added to your live app.

### Build

To build an app once, without running a server or watching for new changes, use the `build` command.

```bash
foundation-apps build
```

### Update

Updates your Bower packages, which includes Foundation for Apps. Run this command when you want to update an existing project to the newest version of Foundation.

```bash
foundation-apps update
```

### Help

Lists all available commands in the CLI.

```bash
foundation-apps help
```

Add a command name at the end to learn how a specific command works.

```bash
foundation-apps help new
```