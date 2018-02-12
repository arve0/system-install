var assert = require('assert');
var i = require('./index.js')();

assert.equal(i.installer, 'sudo apt-get install');
