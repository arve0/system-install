(function () {
    'use strict';

var which = require('which');

var INSTALL_CMD = {
	brew: 'brew install',
	port: 'sudo port install',
	pkgin: 'sudo pkgin install',
	choco: 'choco install',
	powershell: "powershell Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))",
	'apt-get': 'sudo apt-get install',
	yum: 'sudo yum install',
	dnf: 'sudo dnf install',
	nix: 'nix-env --install',
	zypper: 'sudo zypper in',
	emerge: 'sudo emerge -a',
	pacman: 'sudo pacman -S',
	pkg: 'pkg install',
	pkg_add: 'pkg_add',
	crew: 'crew install',
	test: 'dummy installer'
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
        var managers = PKG_MANAGERS[process.platform];
        if (!managers || !managers.length) {
            return new Error('unknown platform \'' + process.platform + '\'');
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
            return new Error('your_package_manager install');
        }   

        var system_installer = INSTALL_CMD[managers[0]].split(' ');  
        return {
            needsudo: (system_installer[0]=='sudo') ? true : false,
            packager: (!system_installer[2]) ? system_installer[0] : system_installer[1],
            installercommand: INSTALL_CMD[managers[0]]
            } 
    };  
    
/**
 * Install package using the system packaging manager command.
 *
 * @returns {string} Output of spawn command.
 *                   E.g. 'sudo apg-get install' for Debian based systems.
 *                   Defaults to 'your_package_manager install' if no package manager is found.
 * @throws Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
    getInstallCmd.install = function install(application) {
      return new Promise(function (resolve, reject) {
        if (!application) return reject("Error: No package, application name missing.");    
    
        var managers = PKG_MANAGERS[process.platform];
        if (!managers || !managers.length) {
            return reject('unknown platform \'' + process.platform + '\'');
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
            return reject('your_package_manager install');
        }   

        var system_installer = INSTALL_CMD[managers[0]].split(' ');
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
            result.on('error', (err) => { return reject(result.error); }); 
            result.stdout.on('data', function(data) { console.log(data.toString()); });
            result.stderr.on('data', function(data) { console.log(data.toString()); });
            result.on('close', function(code) { resolve(code) });             
        }  
      });        
    }
    
    getInstallCmd();

    function getInstallCmd() {
    }

})();