const which = require('which');

const INSTALL_CMD = {
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
	pkg_add: 'pkg_add'
};

const PKG_MANAGERS = {
	darwin: ['brew', 'port', 'pkgin'],
	win32: ['choco'],
	linux: ['apt-get', 'yum', 'dnf', 'nix', 'zypper', 'emerge', 'pacman'],
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
module.exports = function getInstallCmd () {
	let managers = PKG_MANAGERS[process.platform];
	if (!managers || !managers.length) {
		throw new Error(`unknown platform '${process.platform}'`);
	}
	managers = managers.filter((mng) => {
		try {
			// TODO: Optimize?
			which.sync(mng)
			return true;
		} catch (e) {
			return false;
		}
	});
	if (!managers.length) {
		return 'your_package_manager install';
	}
	return INSTALL_CMD[managers[0]];
}
