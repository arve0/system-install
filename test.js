var assert = require('assert');
var i = require('./index.js')();

assert.equal(i, 'sudo apt-get install');
