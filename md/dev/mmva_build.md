# Medic Mobile Virtual Appliance Build Environment

## Intro

The Medic Mobile Virtual Appliance is a 65M bootable Linux ISO that contains all the software requirements to run the Medic Mobile software stack, including [Node.js](http://nodejs.org), [CouchDB](http://couchdb.org) and [Gammu](http://gammu.org).

To save time building it a [VMWare](http://vmware.com) Virtual Machine is provided which includes all the dependencies to compile it.  

You can download and boot this VM and then run `make` in the root account.  The build takes between 30 minutes to an hour depending on your hardware and internet connection.  The source code for the Linux kernel, CouchDB,
Node.js, OpenSSH, etc are all downloaded and compiled.

## Download

Download and untar the build VM.

```
curl -O https://scri.pt/get/medic-vm-builder-20121221.tar.xz
tar xvJf medic-vm-builder-20121221.tar.xz
```
*Note: Keep the `.tar.xz` file around so that later you can apply patches to it.*

These commands will create a directory like `medic-vm-builder-20121221.vmwarevm` that contains the VMWare Virtual Machine.  


## Build

Boot the build environment:

* Launch VMWare 
* Drag the build VM into the Virtual Machine Library
* Click Play to boot it
* Choose I Copied It at the dialogue window

Once booted, login on the console as `root` with password `vm-build` and run `make`.

![Build VM Login](http://f.cl.ly/items/0M2N3j2u2C0v3z2z050S/login-build-vm.png)

When the build completes the bootable ISO is saved in
`/root/vm-toaster/output/image.iso`.  Copy this file to the host system with
ssh, e.g.:

```
scp root@192.168.213.129:/root/vm-toaster/output/image.iso ~
```

## Boot 

Use VMWare to boot the freshly built ISO image:

* Start VMWare 
* Click New or the plus icon and New option to create a new virtual machine
* Click Continue Without Disc
* Click Choose a disc image… twice
* Navigate to location of `image.iso` and select it
* Select Operating System: Linux
* Select Version: Other Linux 2.6.x kernel
* Choose Finish to launch the VM 

Once finished booting you should see a status screen similar to this:

![Medic Mobile Virtual Appliance](http://f.cl.ly/items/232O3M350z0W2y2J2D0T/mmvm-status.png)

## Setup

The final step is to set a password for the system:

* Navigate your browser to the advertised IP address.
* Enter a password and optionally public SSH key.
* Click Save

This sets the password (and optionally authorized ssh key) for a `tc` Unix
account and for a CouchDB admin account with username `admin`.  SSH and CouchDB
are available on ports 33696 and 5984 respecitvely.  The default configuration
disables ssh access and a login shell for the root account, but the `tc`
account does have access to the `sudo` command.

```
$ curl http://192.168.213.129:5984
{"couchdb":"Welcome","version":"1.2.0"}
```

```
$ ssh -p 33696 tc@192.168.213.129
tc@192.168.213.129's password: 
tc@toaster:~$ 
```

Enjoy!

