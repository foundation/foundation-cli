# Foundation CLI

This is the future CLI for the Foundation family of frameworks.

The main goal for this tool should be to *reduce the number of dependencies required when starting a Foundation project*. Right now Foundation 5 has five requirements, or six if using the libsass stack. It's something people complain about here and there. For these tools, the only dependency should be Node, or Node and Ruby with Foundation for Sites.

Here's how we condense dependencies:
 - Use libgit2 (via `nodegit`) to clone library files. This prevents the user from needing a copy of git installed beforehand.
 - Run Bower, Gulp, and Grunt using a local package instead of a global one. This skips the `npm install -g bower grunt-cli` step in the setup process.
 - Ruby will still be required for Sites, if the user is on the Compass stack. There's probably no easy way to make Ruby portable. There are some solutions, like [Ruby Ship](https://github.com/stephan-nordnes-eriksen/ruby_ship), but it adds 80MB to the download, and also most people in web development have Ruby on their machine already. This would mostly benefit Windows users anyway.
 - Ink's inliner would need to be rewritten in JavaScript, so it can be run on the user's machine. There's a Node tool called [Juice](https://github.com/Automattic/juice) that could get us most of the way there.

## How to mess with this

Right now this is just a proof-of-concept, so all it does is set up Foundation for Apps for you.

```bash
git clone https://github.com/zurb/foundation-cli.git
cd foundation-cli
npm test [name]
```

The CLI will create a new folder called whatever you put for `[name]`, and download and set up Foundation for Apps. It *does* require git to be installed globally, for now.

## Foundation for Apps process

1. Clone the Angular stack from GitHub using libit2
2. Install dependencies with a local copy of Bower
3. Run stack using local copy of Gulp

## Foundation for Sites process

1. Clone the Compass or libsass stack from GitHub using libgit2
2. Install dependencies with a local copy of Bower
3. Run stack using global Ruby, or local Grunt

## Foundation for Email process

1. Clone a stock Ink project from GitHub using libgit2
  - Maybe also allow for the user to download templates with it?
2. Run inliner to generate a production-ready email

> Any application that *can* be written in JavaScript, *will* eventually be written in JavaScript.
[Jeff Atwood](any application that can be written in JavaScript, will eventually be written in JavaScript.), founder of StackOverflow
