# Securing Android devices

To secure an android device you should enable at least a pin code lock on the device, enable FDE (full disc encryption) and setup remote wiping capabilities by enabling mobile device management.

## PIN Setup and FDE

Instructions are slightly different per device. Enabling FDE has the added benefit that you must also lock the device with a pin code or password.

### Android 5.0 or later

Open the `Security` menu under settings. On unmodified versions of Android, this
can be found under `Settings` `>` `Personal` `>` `Security`. Choose `Encrypt
Phone`, `Encrypt Tablet`, or `Encrypt Device`. If you haven't already set a PIN
or passcode for the lock screen, you will be prompted to do so. Remember this
PIN and do not write it down.

![Screenshot for Android 5.0](securing-android-devices/encrypt-50.jpg)

### Android 4.4 or earlier

First, you'll need to set up a PIN. Navigate to `Settings` `>` `Security` `>`
`Screen Lock`, and set a numeric PIN for the device of *at least* four digits.
Remember this PIN and do not write it down.

Then, open the `Security` menu under settings. On unmodified versions of
Android, this can be found under `Settings` `>` `Personal` `>` `Security`.
On some devices, the exact menu layout may have been modified by the hardware
manufacturer. Choose `Encrypt Phone` or `Encrypt Tablet`.

![Screenshot for Android 4.4](securing-android-devices/encrypt-44.jpg)

### Android Versions before 3.0

Android does not support disk encryption in versions earlier than 3.0
(Honeycomb). If you have one of these devices, we recommend that you do not use it.

## Mobile device management

Setting up mobile device management that if a phone gets lost or stolen you can ensure the data on it is deleted safely.

You can enable this if the Google accounts used on the phones are part of a paid-for plan of Google's G Suite.

Up to date instructions for enabling mobile device management can be found here: https://support.google.com/a/answer/7400753

If you need to remotely wipe a device, see instructions here: https://support.google.com/a/answer/173390


