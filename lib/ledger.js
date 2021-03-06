/*global exports, require */
(function () {
  var _ = require('lodash'),
      Cli = require('./cli-runner').Cli,
      Version = require('./commands/version').Version,
      Balance = require('./commands/balance').Balance,
      Register = require('./commands/register').Register;
  
  var Ledger = (function() {
    var config = {
      binary: '/usr/local/bin/ledger',
      debug: false
    };
    
    function Ledger(options) {
      this.options = _.defaults({}, options, config);

      this.cli = new Cli(this.options.binary, { debug: this.options.debug });
    }

    // version reports the current installed Ledger version.
    Ledger.prototype.version = function(callback) {
      new Version(this.cli).run(callback);
    };
    
    // balance reports the current balance of all accounts.
    Ledger.prototype.balance = function() {
      return new Balance(this.withLedgerFile(this.cli)).run();
    };
    
    // register displays all the postings occurring in a single account.
    Ledger.prototype.register = function() {
      return new Register(this.withLedgerFile(this.cli)).run();
    };

    Ledger.prototype.withLedgerFile = function(cli) {
      var file = ['-f', this.options.file];

      return {
        exec: function(args) {
          return cli.exec(file.concat(args || []));
        }
      };
    };
    
    return Ledger;
  })();

  exports.Ledger = Ledger;
})();