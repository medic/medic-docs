# SMSSync Setup

This document guides you through SMSSync configuration to get SMS 
messages in and out of Medic Mobile.

## Download

Launch the browser on your device and download the latest SMSSync build here: 
[http://dev.medicmobile.org/downloads/gateways/](http://dev.medicmobile.org/downloads/gateways/)

You will be prompted to install the `.apk` file. Follow the instructions and
complete the install.

## Configure Wi-Fi Sleep Settings

Set the Wi-Fi sleep setting to `Never` so SMSSync will continuously process messages.

Navigate your device:

* Settings -> Wireless & Network Settings -> Wi-Fi Setting
* Menu -> Advanced -> Wi-Fi Sleep Policy -> Never

![Wifi Settings](img/smssync/wifi-settings.png)
![Wifi Settings Advanced](img/smssync/wifi-settings-adv.png)
![Wifi Sleep Policy](img/smssync/wifi-sleep-policy.png)
![Wifi Sleep Never](img/smssync/wifi-sleep-never.png)

## Confirm Connectivity

In this tutorial we assume there are two devices on a Wi-Fi network, typically
this an Android device acting as a gateway and a laptop that is running Medic Mobile.
Lets confirm the network is setup right and the devices can connect to each
other.  

* Launch the device and browse to the IP address where Medic Mobile is running.
For example: `http://192.168.213.165/`.

* Do the same thing on the laptop confirming that both devices can connect to
the same IP address.

![Confirm Network IP](img/smssync/confirm-network.png)

## Configure SyncURL

This is by far the most daunting task of the setup.  Please bare with us while
we work on automating this process.

To determine your SyncURL you will need 3 things:

* The IP address of Medic Mobile (see previous step)
* Your gateway authentication credentials
* The Medic Mobile web service endpoint, typically this is:
`/medic/_design/medic/_rewrite/add` 

Combine the above and you have your complete SyncURL. For example:
`http://gateway:123qwe@192.168.213.165/medic/_design/medic/_rewrite/add?locale=en`

*Note* the colon `:` character separates the username and password and the `@` symbol
separates the IP address from the password.  We recommend having a gateway user
assigned the `gateway` role but you can use any user that has create
privileges.

The following `locale` options are supported: 

* English: en
* French: fr
* Nepali: ne
* Spanish: es
* Swahili: sw

Now add this new SyncURL to SMSSync:

* Launch SMSSync and browse to menu by choosing the icon in top left
* Choose Sync URL and then the plus to add a new one
* Enter the name and URL then choose OK to save it
* Finally Start SMSSync and enable the SyncURL you just created

![SMSSync Menu](img/smssync/menu.png)
![SyncURL Menu](img/smssync/menu-syncurl.png)
![Add SyncURL](img/smssync/add-syncurl.png)
![SyncURL Details](img/smssync/syncurl-details.png)
![Enable SyncURL](img/smssync/enable-syncurl.png)

At this point you should be able to send an SMS message into Medic Mobile via the gateway.  Test it out! 

Messages should immediately be forwarded to Medic Mobile and moved to the Sent queue.  Take a look at the Pending and Sent queues.  If messages are in the Pending view then they could not get forwarded automatically and there is likely a problem connecting to Medic Mobile.

![SMSSync Menu](img/smssync/menu-insyncurl.png)
![Pending](img/smssync/menu-pending.png)


## Troubleshooting

If you are still having problems the best troubleshooting tactic is to use the browser of the device to confirm the SyncURL is correct.  If the browser fails to load the SyncURL then there is likely a connectivity issue.

## Editing SyncURL

To edit a SyncURL tap and hold the entry you want then choose Edit in the drop down menu in the top right.

![Edit SyncURL](img/smssync/edit-syncurl.png)

## Enable Task Checking

Assuming incoming messages are functioning correctly, to send outgoing/pending
messages you need to enable task checking in SMSSync.  This will poll Medic Mobile
every minute for outgoing/pending messages. 

**Warning** if you have been testing Medic Mobile without the gateway you might have
*many* pending messages.  Enabling this feature could potentially spend your
mobile provider credit.  Consider deleting records in Medic Mobile, starting with a
fresh Medic Mobile install or initially removing your SIM card from the gateway.

* Choose the menu button on your device to get the settings menu
* Check Enable Task Checking
* Set Frequency to 1 Minute

![Settings](img/smssync/settings-fromsyncurl.png)
![Enable Task Checking](img/smssync/enable-task-checking.png)
![Set 1 minute frequency](img/smssync/freq-1minute.png)


## Enable Auto Sync

When new SMS messages arrive to SMSSync it will immediately sync them.  In some cases though, the connection between server and gateway is unstable so they cannot be synced immediately.  In this case they will remain in the pending box of SMSSync until you manually sync them.  With Auto Sync enabled they will get synced automatically on an interval.  

* Choose the menu button on your device to get the settings menu
* Check Enable Auto Sync
* Set Frequency to 1 Minute


![Settings](img/smssync/settings-fromsyncurl-2.png)
![Enable Task Checking](img/smssync/enable-autosync.png)
![Set 1 minute frequency](img/smssync/enable-autosync-freq1min.png)

## Final Steps

* Reboot the device to make sure the SMSSync service starts up automatically.
* Send some test messages through with another phone, and verify both incoming 
  and outgoing work.  
* Confirm that a message syncs instantly when received by the gateway without any interaction on the device.
* If possible leave the gateway plugged into a power source and with a decent
  data connection, preferrably Wifi.  It should manage the incoming and
  outgoing message queues automatically.

