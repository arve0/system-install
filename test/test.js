var expect = require('chai').expect;
var system = require('../index.js').packager;
var installer = require('../index.js').installer;

describe('Method: `packager`', function() {    
    it('should return an object', function (done) {
        expect(system()).to.be.an('object');
        done();
    });    	
        
    it('should return an object key value of string and boolean', function (done) {
        var i = system();
        expect(i.needsudo).to.be.a('boolean');
        expect(i.packager).to.be.a('string');
        console.log(i.installercommand);
        expect(i.installercommand).to.be.a('string');
        done();
    });    
});    
	
describe('Method: `packager` for platform set to `other`', function() {
    // save original process.platform    
    before(function() { this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'other' }); });
    // restore original process.platform
    after(function() { Object.defineProperty(process, 'platform', this.originalPlatform); });

    it('should return an error for unknown platform', function (done) {
        expect(system()).to.be.an.instanceof(Error);
        done();
    });    	
});    
	
	
describe('Method: `packager` for platform set to `test`', function() {    
    // save original process.platform    
    before(function() { this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'test' }); });
    // restore original process.platform
    after(function() { Object.defineProperty(process, 'platform', this.originalPlatform); });
        
    it('should return an error for no package manager found', function (done) {
        expect(system()).to.be.an.instanceof(Error);
        done();
    });    	
});    
	
describe('Method: `installer`', function() {
    it('should return an error for no package, application name missing', function (done) {
        installer(null)
        .catch(function(err) {
            expect(err).to.be.an.instanceof(Error);
            done();            
        });
    });    	
});

describe('Method: `installer` for platform set to `other`', function() {
    // save original process.platform    
    before(function() { this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'other' }); });
    // restore original process.platform
    after(function() { Object.defineProperty(process, 'platform', this.originalPlatform); });
   
    it('should return an error for unknown platform', function (done) {
        installer('winrar')
        .catch(function(err) {
            expect(err).to.be.an.instanceof(Error);
            done();           
        });
    });        
});

describe('Method: `installer` for platform set to `test`', function() {
    // save original process.platform    
    before(function() { this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'test' }); });
    // restore original process.platform
    after(function() { Object.defineProperty(process, 'platform', this.originalPlatform); });
        
    it('should return an error for no package manager found', function (done) {
        installer('winrar')
        .catch(function(err) {
            expect(err).to.be.an.instanceof(Error);
            done();            
        });
    });  
});

describe('Method: `installer` install package `???`', function() {
    it('should return an error for any issues installing package', function (done) {
        installer('???')
        .catch(function(err) {
            expect(err).to.be.an.instanceof(Error);
            done();            
        });
    });    	
});

describe('Method: `installer` install package `vim`', function() {
    it('should return on successful install or errors if windows', function (done) {
        installer('vim')
        .then(function(data) {
			expect(data).to.be.a('string');
            done();          
        })
        .catch(function(err) {
            expect(err).to.be.an.instanceof(Error);
            done();            
        }); 
    });    	
});

describe('Method: `installer` install packages `unzip` and `nano`', function() {
    it('should return on successful install of multiple packages or print error log if windows platform', function (done) {
        installer(['unzip','nano'])
        .then(function(data) {
			expect(data).to.be.a('string');
            done();          
        })
        .catch(function(err) {
            console.log(err);
            expect(err).to.be.an.instanceof(Error);
            done();            
        }); 
    });    	
});

