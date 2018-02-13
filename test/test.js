var expect = require('chai').expect;
var system = require('../index.js').packager;

describe('Method: `system-installer()` for platform set to `win32`', function() {
    
    before(function() {
        // save original process.platform
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

        // redefine process.platform
        Object.defineProperty(process, 'platform', {
            value: 'win32'
        });
    });

    after(function() {
        // restore original process.platfork
        Object.defineProperty(process, 'platform', this.originalPlatform);
    });
  
    it('should return an object', function (done) {
        expect(system()).to.be.an('object');
        done();
    });    	
        
    it('should return an object key value of string and boolean', function (done) {
        var i = system();
        expect(i.needsudo).to.be.a('boolean');
        expect(i.packager).to.be.a('string');
        expect(i.installercommand).to.be.a('string');
        done();
    });
    
});    
	
describe('Method: `system-installer()` for platform set to `other`', function() {
    
    before(function() {
        // save original process.platform
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

        // redefine process.platform
        Object.defineProperty(process, 'platform', {
            value: 'other'
        });
    });

    after(function() {
        // restore original process.platfork
        Object.defineProperty(process, 'platform', this.originalPlatform);
    });
  
    it('should return an error for unknown platform', function (done) {
        expect(system()).to.be.an.instanceof(Error);
        done();
    });    	
});    
	
	
describe('Method: `system-installer()` for platform set to `test`', function() {
    
    before(function() {
        // save original process.platform
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

        // redefine process.platform
        Object.defineProperty(process, 'platform', {
            value: 'test'
        });
    });

    after(function() {
        // restore original process.platfork
        Object.defineProperty(process, 'platform', this.originalPlatform);
    });
        
    it('should return an error for no package manager found', function (done) {
        expect(system()).to.be.an.instanceof(Error);
        done();
    });    	
});    
	
describe('Method: `system-installer(application)` for platform set to `win32`', function() {
    
    before(function() {
        // save original process.platform
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

        // redefine process.platform
        Object.defineProperty(process, 'platform', {
            value: 'win32'
        });
    });

    after(function() {
        // restore original process.platfork
        Object.defineProperty(process, 'platform', this.originalPlatform);
    });	
});