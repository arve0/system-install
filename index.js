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

var defaultCallback = function (err, stdout, stderr) {
    if (err) return console.error(err);

    if (stderr) console.log(stderr);
    if (stdout) console.log(stdout);
};
    
/**
 * Gets the system packaging install command.
 *
 * @returns {string} System packaging install command.
 *                   E.g. 'sudo apg-get install' for Debian based systems.
 *                   Defaults to 'your_package_manager install' if no package manager is found.
 * @throws Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */
module.exports = function getInstallCmd(application, callback) {
    if (!callback) callback = defaultCallback;
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
    
    if (application) {
        var whattoinstall = (Array.isArray(application)) ? ['-y'].concat(application) : ['-y'].concat([application]);        
        var distro = whattoinstall;
        if ((args) && (!install)) distro = args.concat(whattoinstall);
        if ((args) && (install)) distro = args.concat(install).concat(whattoinstall);
        
        console.log('Running ' + cmd  + ' ' + distro);        
        var result = require('child_process').spawnSync(cmd, distro, { stdio: 'pipe' });
        if (result.error) return callback(result.error, null);
        return callback(null, result.stdout.toString(), result.stderr.toString());
    }
    else 
        return {
            needsudo: (cmd=='sudo') ? true : false,
            packager: (!install) ? cmd : args,
            installer: INSTALL_CMD[managers[0]]
            } 
};
