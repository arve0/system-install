'use strict';

var which = require('which');

var INSTALL_CMD = {
	brew: 'brew install',
	port: 'sudo port install',
	pkgin: 'sudo pkgin install',
	choco: 'choco install',
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
	win32: ['choco'],
	linux: ['apt-get', 'yum', 'dnf', 'nix', 'zypper', 'emerge', 'pacman', 'crew'],
	freebsd: ['pkg', 'pkg_add'],
	sunos: ['pkg']
	// netbsd?
};

/**
 * Gets the system packaging install command.
 *
 * @returns {string} System packaging install command.
 *                   E.g. 'sudo apg-get install' for Debian based systems.
 *                   Defaults to 'your_package_manager install' if no package manager is found.
 * @throws Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
module.exports = function getInstallCmd(application) {
	var managers = PKG_MANAGERS[process.platform];
	if (!managers || !managers.length) {
		throw new Error('unknown platform \'' + process.platform + '\'');
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
		return 'your_package_manager install';
	}
    
    var system_installer = INSTALL_CMD[managers[0]].split(' ');
    var cmd = system_installer[0];
    if (system_installer[1]) var args = [ system_installer[1] ];
    if (system_installer[2]) var install = [ system_installer[2] ];
    if ((args) && (!install)) var distro = args;
    if ((args) && (install)) var distro = args.concat([install]);
    if (!args) var distro = [];
    
    if (application) {
        var spawn = require('child_process').spawnSync;
        console.log('Running ' + cmd  + ' ' + distro.concat(['-y', application]));
        var result = spawn(cmd, distro.concat(['-y', application]), { stdio: 'pipe' });
        if (result.error) return new Error(result.error);  
        if (result.stdout.toString()) return result.stdout.toString();  
    }
    else return INSTALL_CMD[managers[0]]; 
};
