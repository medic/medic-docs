# Virtual Appliance Install

This document will take you through the recommended steps to install the 
the Medic Mobile Virtual Appliance.

## Download the ISO

* Download the [latest bootable ISO image](https://medic.s3.amazonaws.com/downloads/iso/mmva-image-20130207.iso).

* Move it out of the downloads folder, give it a permanent home in your file
  structure.  The virtual machine will need to reference it on boot.

## Install VMWare Player

### Download 

1. Go to the [VMWare Player Products](http://www.vmware.com/products/player/) page.
2. Download and install the latest version for your operating system.

## Create New Virtual Machine

* Once installed, launch VMWare Player
* On the launch screen choose Create New Virtual Machine

![Create New VM](img/vm/create_new_vm.png)

### Select Bootable ISO file

![Select ISO](img/vm/select_iso.png)

### Select Linux OS

![Select Linux](img/vm/select_other_linux.png)

### Change VM Name
 
![Select Linux](img/vm/change_vm_name.png)

### Specify 64G of maximum disk capacity

The VM will only use as much space as it needs, but 64G is the maximum.

![Specify 64](img/vm/64G_of_disk.png)

### Choose Customize Hardware

![Customize HW](img/vm/customize_hw.png)

### Change memory setting

Allocate a minimum of 512MB of RAM for the VM.

![Use 512M of RAM](img/vm/512M_of_ram.png)

### Use Bridged Networking

This allows the local network to access the VM.

![Use Bridged Networking](img/vm/bridged_networking.png)

### Finish

Verify your settings are correct and click Finish.

![Finish](img/vm/finish.png)

## Setup Medic VM

### Click Play

![Play](img/vm/play.png)

On first run the VM will do some software copy and setup.  You should see progress messages changing.

![Setting Up](img/vm/setting_up_software.png)

When the VM is up and running normally you will see this screen.

![Up and running](img/vm/up_and_running.png)

### Set a password to secure the virtual machine.

Navigate to the IP address in your browser and enter a password twice into the form.

![Set password](img/vm/set_password.png)

![Verify password is set](img/vm/verify_password_set.png)

Copy the password down somewhere safe so you don't lose or forget it.

Congrats, you have completed the VM setup! (Onward... more to come.)
