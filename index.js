(function () {
    'use strict';

var which = require('which');

var INSTALL_CMD = {
	brew: 'brew install',
	port: 'sudo port install',
	pkgin: 'sudo pkgin install',
	choco: 'choco install',
	powershell: "powershell ./installChocolatey.ps1",
	'apt-get': 'sudo apt-get install',
	yum: 'sudo yum install',
	dnf: 'sudo dnf install',
	nix: 'nix-env --install',
	zypper: 'sudo zypper in',
	emerge: 'sudo emerge -a',
	pacman: 'sudo pacman -S',
	pkg: 'pkg install',
	pkg_add: 'pkg_add',
	crew: 'crew install'
};

var PKG_MANAGERS = {
	darwin: ['brew', 'port', 'pkgin'],
	win32: ['choco', 'powershell'],
	linux: ['apt-get', 'yum', 'dnf', 'nix', 'zypper', 'emerge', 'pacman', 'crew'],
	freebsd: ['pkg', 'pkg_add'],
	sunos: ['pkg'],
	test: ['dummy']
	//netbsd?
};

function package_manager(reject) {
    if (!reject) var reject = function (data) { return new Error(data); }
    var managers = PKG_MANAGERS[process.platform];
        if (!managers || !managers.length) {
            return reject(Error('unknown platform \'' + process.platform + '\''));
        }
    
        managers = managers.filter(function (mng) {
            try {
                // TODO: Optimize?
                which.sync(mng);
                return true;
            } catch (e) {
                return false;
            }
        });
    
        if (!managers.length) {
            return reject(Error('your_package_manager install'));
        }
        
    return INSTALL_CMD[managers[0]].split(' ');    
}

/**
 * Gets the system packaging install command.
 *
 * @returns {object} { needsudo: boolean `true or false`, 
 *                     packager: string `your system packaging command`, 
 *             installercommand: string `full install command` } 
 *                   E.g. 'sudo apg-get install' for Debian based systems.
 *                   Defaults to 'your_package_manager install' if no package manager is found.
 * @throws Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
module.exports = getInstallCmd.packager = getInstallCmd; 

    getInstallCmd.packager = function packager() {
        var system_installer = package_manager();
        if (system_installer[0]) return { needsudo: (system_installer[0]=='sudo') ? true : false,
                                          packager: (!system_installer[2]) ? system_installer[0] : system_installer[1],
                                  installercommand: system_installer.join(' ') }
        else return new Error(system_installer);
    };  
    
/**
 * Install package using the system packaging manager command.
 *
 * @returns {string} Output of spawn command.
 *                   E.g. 'sudo apg-get install' for Debian based systems.
 *                   Defaults to 'your_package_manager install' if no package manager is found.
 * @throws Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
    getInstallCmd.installer = function installer(application) {
		var installoutput = '';
      return new Promise(function (resolve, reject) {
        if (!application) return reject(Error("Error: No package, application name missing."));  
        
        var system_installer = package_manager(reject);
        var cmd = system_installer[0];
        if (system_installer[1]) var args = [ system_installer[1] ];
        if (system_installer[2]) var install = [ system_installer[2] ];

        var whattoinstall = (Array.isArray(application)) ? [].concat(application).concat(['-y']) : [].concat([application]).concat(['-y']);        
        var distro = whattoinstall;
        if ((args) && (!install)) distro = args.concat(whattoinstall);
        if ((args) && (install)) distro = args.concat(install).concat(whattoinstall);
        
        if (cmd!='powershell') { 
            console.log('Running ' + cmd  + ' ' + distro);        
            var result = require('child_process').spawn(cmd, distro, { stdio: 'pipe' });
            result.on('error', (err) => { return reject(Error(err)); }); 
            result.stdout.on('data', function(data) { installoutput += data.toString(); });
            result.stderr.on('data', function(data) { return reject(Error(data.toString())); });
            result.on('close', function(code) { return resolve(installoutput) });    
            result.on('exit', function(code) { return resolve(installoutput) });    
        } else return reject(Error('No windows package manager installed!'));
        /*else if (process.platform=='win32') { 
            var PowerShell = require("powershell");
            console.log('Download and Install Chocolatey');        
            var ps = new PowerShell("./installChocolatey.ps1",{ executionpolicy: 'Unrestricted' });
            ps.on('error',  (err) => { return reject(Error(err)); }); 
            ps.on('output', function(data) { console.log(data); });
            ps.on('error-output', function(data) { return reject(Error(data)); });
            ps.on('end', function(code) { 
                console.log('Running choco install ' + whattoinstall);        
                var packageresult = require('child_process').spawn('choco', ['install'].concat(whattoinstall), { stdio: 'pipe' });
                packageresult.on('error', (err) => { return reject(Error(result.error)); }); 
                packageresult.stdout.on('data', function(data) { console.log(data.toString()); });
                packageresult.stderr.on('data', function(data) { return reject(Error(data.toString())); });
                packageresult.on('close', function(code) { return resolve(code); } ); 
                packageresult.on('exit', function(code) { return resolve(code) });    
            });                    
        }*/
      });        
    }
    
    getInstallCmd();

    function getInstallCmd() {
    }

})();