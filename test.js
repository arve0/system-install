var assert = require('assert');
var i = require('./index.babel.js')();

assert.equal(i, 'sudo apt-get install');
