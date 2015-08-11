var assert   = require('assert');
var execFile = require('child_process').execFile;
var fs       = require('fs');
var path     = require('path');
var rimraf   = require('rimraf').sync;
var foundationCLI = require('../lib');

/**
 * Runs a CLI command as a child process, running a callback when the process is finished.
 * @param {string} args - Arguments to run the command with.
 * @param {function} callback - Callback to run when the process exits. It has two parameters: the contents of stdout, and the exit code.
 */
function runCLI(args, cb) {
  var cli = path.join(process.cwd(), 'bin/cli.js');
  var output = '';

  var proc = execFile(cli, args.split(' '));

  proc.stdout.on('data', function(data) {
    output += data;
  });

  proc.on('exit', function(code) {
    cb(output, code);
  });
}

describe('FoundationCLI', function() {
  it('should display the version of the CLI', function(done) {
    var version = require('../package.json').version;

    runCLI('--version', function(output) {
      assert.ok(output.indexOf(version) > -1);
      done();
    });
  });

  it('should display help if no commands are given', function(done) {
    runCLI('', function(output) {
      assert.ok(output.indexOf('Commands:') > -1);
      done();
    });
  });

  it('should display help if a command does not exist', function(done) {
    runCLI('notathing', function(output) {
      assert.ok(output.indexOf('Commands:') > -1);
      done()
    });
  });

  describe('#new()', function() {
    before(function(done) {
      this.timeout(0);

      runCLI('new testGeneral', function() {
        done();
      });
    });

    it('should display help if no project name is given', function(done) {
      runCLI('new', function(output) {
        assert.ok(output.indexOf('Usage:') > -1);
        done();
      });
    });

    it.skip('should exit with code 1 if run as root', function(done) {
      var oldUid = process.getuid();
      process.setuid(0);

      runCLI('new', function(output, code) {
        assert.equal(code, 1);
        process.setuid(oldUid);
        done();
      });
    });

    it.skip('should exit with code 69 if Git is not installed');

    it('should exit with code 73 if a project folder already exists', function(done) {
      fs.mkdirSync('testExists');

      runCLI('new testExists', function(output, code) {
        assert.equal(code, 73);
        done();
      });
    });

    it('should change the version number of a project with --version', function(done) {
      this.timeout(0);

      runCLI('new testVersion --version 1.0.0', function(output) {
        var version = require('../testVersion/bower.json').dependencies['foundation-apps'];
        assert.equal(version, '1.0.0');
        done();
      });
    });

    it('should use the master branch of the framework with --version', function(done) {
      this.timeout(0);

      runCLI('new testEdge --edge', function(output) {
        var version = require('../testEdge/bower.json').dependencies['foundation-apps'];
        assert.equal(version, 'master');
        done();
      });
    });

    it('should delete the Git folder', function(done) {
      fs.exists('./testGeneral/.git', function(exists) {
        assert.ok(!exists);
        done();
      });
    });

    it('should install npm dependencies', function(done) {
      fs.exists('./testGeneral/node_modules', function(exists) {
        assert.ok(exists);
        done();
      });
    });

    it('should install Bower dependencies', function(done) {
      fs.exists('./testGeneral/bower_components', function(exists) {
        assert.ok(exists);
        done();
      });
    });

    it('should copy the settings file from bower_components', function(done) {
      fs.exists('./testGeneral/client/assets/scss/_settings.scss', function(exists) {
        assert.ok(exists);
        done();
      });
    });

    after(function(done) {
      this.timeout(0);

      rimraf('testGeneral');
      rimraf('testExists');
      rimraf('testVersion');
      rimraf('testEdge');

      done();
    });
  });
});