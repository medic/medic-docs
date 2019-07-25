# Developing on Windows

We don't actively support development on Windows, instead preferring MacOS or Linux.

However, Microsoft has recently been stabilising their [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about), which appears to work reasonably well for development.

Installation instructions are mostly the same as they written in [the README](https://github.com/medic/medic/blob/master/README.md) with a couple of caveats as of time of writing (2019-07-25), noted below.

**Note**: both the Windows Subsystem for Linux and Medic's support for developing in it is very much in beta. These are advanced instructions, expect some understanding of linux and may not always work. Be patient and raise bugs as you find them!

## Installing Ubuntu in the Windows Subsystem for Linux.

For the rest of this document we're going to presume that you're using Ubuntu. Medic probably works all on all distributions, but Ubuntu is likely the best supported.

First, follow Microsoft's [instructions on enabling and installing linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10). At the end of this process you should have a linux terminal.

Note: for the rest of this tutorial **in linux** means code executing or performing actions in the subsystem command prompt, while **in Windows** means code executing or performing actions in Windows natively.

## CouchDB

As of writing CouchDB wouldn't autostart due to systemd not existing (I think?), and wasn't manually starting due to erlang errors.

Luckily, there is a perfectly working CouchDB installation for Windows:
 - Download from [CouchDB](https://couchdb.apache.org/#download) and install the Windows version. This will create a Windows service.
 - Run it either by directly executing `C:\CouchDB\bin\couchdb.cmd` or by starting the service

Then go to `http://localhost:5984/_utils/#/setup` in Windows and do the single node setup. Once done head back to linux and confirm it works:

```
scdf@EDGELORD:/mnt/c/Users/stefa/Code/medic$ curl http://localhost:5984/
{"couchdb":"Welcome","version":"2.3.1","git_sha":"c298091a4","uuid":"5f60350abaaa11c0131a5630e83ae979","features":["pluggable-storage-engines","scheduler"],"vendor":{"name":"The Apache Software Foundation"}}
```

## Installing NPM

The default `npm` in linux is really old and doesn't have `npm ci`, which we need.

Instead use [nvm](https://github.com/nvm-sh/nvm) to install a later version.

Once you've installed nvm: `nvm install 8` (or a later or earlier version if you like, minimum 6).

## Checking out the code

I used linux's git to check out the code, though presumably git in Windows works just as well.

You can access you c drive (and other Window's drives) from `/mnt`. To make life easier consider a symlink in your linux home directory to your code in Windows. In your linux home directory:

```
scdf@EDGELORD:~$ mkdir /mnt/c/Users/<username>/Code
scdf@EDGELORD:~$ ln -s /mnt/c/Users/<username>/Code
scdf@EDGELORD:~$ cd Code
scdf@EDGELORD:~$ git clone git@github.com:medic/medic.git
scdf@EDGELORD:~$ cd medic
```

## Everything else

`npm ci` should just work once you've installed a later npm via nvm as noted above.

You won't have grunt: `npm i -g grunt-cli`

Using `.bashrc` works as expected, and so is a good place to put exports:

```
# Medic stuff
export COUCH_URL=http://admin:pass@localhost:5984/medic
export COUCH_NODE_NAME=couchdb@localhost
```

To get multiple linux terminals (so you can run `grunt`, `api` and `sentinel` at the same time) either install and use something like Tmux, or if you click `Ubuntu` in the Windows start menu again it will open up a new terminal in the same linux instance.

Once you're done with the default instructions and have api running, check it works by going to http://localhost:5988 in Windows.

## Problems?

As none of our code developers use Windows as a development environment daily this solution may not be as stable as directly using MacOS or Linux. If you encounter issues please let a developer know
