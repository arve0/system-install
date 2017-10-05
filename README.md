[![npm version](https://badge.fury.io/js/system-install.svg)](https://badge.fury.io/js/system-install) [![Build Status](https://travis-ci.org/arve0/system-install.svg?branch=master)](https://travis-ci.org/arve0/system-install)

# system-install

Get the install command for the system packaging manager, e.g. `sudo apt-get install` for Debian-based systems.

`system-install` will try to find which system packaging is installed for the given `process.platform`. If no system package manager is found, `'your_package_manager install'` is returned.

## Install
```sh
npm install system-install
```

## Usage

### Node
```js
const mngr = require('system-install')();
/* - 'brew install' on OS X if homebrew is installed.
 * - 'sudo apt-get install' on debian platforms.
 * - 'your_package_manager install' if no package manager is found.
 *
 * Throws if `process.platform` is none of darwin, freebsd, linux, sunos or win32.
 */

console.log(`Please install pandoc: ${mngr} pandoc`);
```

### CLI
```sh
$ npm i -g system-install
$ system-install
brew install
```

## Supported package managers

### FreeBSD
- [pkg]
- [pkg_add]

### Linux
- [apt-get]: (Debian, Ubuntu)
- [dnf]: (fedora)
- [emerge]: (Gentoo)
- [nix]: (NixOS)
- [pacman]: (ArchLinux)
- [yum]: (fedora)
- [zypper]: (OpenSUSE)
- [chromebrew]: (Chrome OS)

### OS X
- [brew]
- [pkgin]
- [port]

### Solaris
- [pkg](https://docs.oracle.com/cd/E23824_01/html/E21802/gihhp.html)

### Windows
- [chocolatey]

[apt-get]: https://help.ubuntu.com/community/AptGet/Howto
[brew]: http://brew.sh
[pacman]: https://wiki.archlinux.org/index.php/pacman
[yum]: https://fedoraproject.org/wiki/Yum
[dnf]: https://fedoraproject.org/wiki/Dnf
[nix]: https://nixos.org/nix/
[zypper]: https://en.opensuse.org/Portal:Zypper
[emerge]: https://wiki.gentoo.org/wiki/Portage
[port]: https://guide.macports.org/#using.port
[pkgin]: https://github.com/cmacrae/saveosx
[pkg]: https://www.freebsd.org/doc/handbook/pkgng-intro.html
[pkg_add]: https://www.freebsd.org/cgi/man.cgi?query=pkg_add&manpath=FreeBSD+7.2-RELEASE
[chocolatey]: https://chocolatey.org
[chromebrew]: https://github.com/skycocker/chromebrew

