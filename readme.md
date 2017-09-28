# Foundation CLI

This is the command-line interface for [Foundation](https://foundation.zurb.com) family of frameworks.. It downloads and installs blank templates in any of the three Foundation frameworks:

- [Foundation for Sites](https://foundation.zurb.com/sites), a framework for responsive websites.
- [Foundation for Apps](https://foundation.zurb.com/apps), a framework for responsive web apps.
- [Foundation for Emails](https://foundation.zurb.com/emails), a framework for responsive email.

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org) 0.12+: Use the installer provided on the NodeJS website.
    * With Node installed, run `[sudo] npm install -g gulp bower`.
  * [Git](http://git-scm.com/downloads): Use the installer for your OS.
    * Windows users can also try [Git for Windows](http://git-for-windows.github.io/).

## Installing

The Foundation CLI is installed through npm.

```bash
npm install -g foundation-cli
```

This will add the `foundation` command to your system.

### Updating

The CLI periodically gets updates that add features or fix bugs. Use npm to upgrade the CLI to the newest version.

```bash
npm update -g foundation-cli
```

To check what version you currently have, use `-v`.

```bash
foundation -v
```

## Commands

### New

Starts the setup process for a new Foundation project. The CLI will ask you which framework you want to use and a folder name for the project.

```bash
foundation new
```

### Watch

While inside of your app's folder, use the `watch` command to assemble your app and run a test server.

```bash
cd appName
foundation watch
```

While this process is running, you can view the assembled app in your browser, at this URL:

```
http://localhost:8080
```

While the server is running, any changes you make to your HTML, Sass, or JavaScript will automatically be processed and added to your live app.

### Build

To build your app for production, use `foundation build`.

```bash
foundation build
```

### Update

Updates your Bower packages, which includes Foundation. Run this command when you want to update an existing project to the newest version of Foundation.

```bash
foundation update
```

### Help

Lists all available commands in the CLI.

```bash
foundation help
```

Add a command name at the end to learn how a specific command works.

```bash
foundation help new
```
