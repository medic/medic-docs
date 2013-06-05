Garden
======================================

After installing an instance of Kujua-Lite, it is fairly easy to administer
access to it. This document will explain how.

Goal
----

  - To ensure only members of the group 'organizationX' have access to an instance of kujua-lite.

Prerequisites
-------------

  - a couchdb has been installed and running at: `http://dev.medicmobile.org:5984`
  - A garden dashboard installed, and available at `http://dev.medicmobile.org:5984/dashboard/_design/dashboard/_rewrite/'
  - An installed kujua-lite

Step 1
------

Create a new group in the garden dashboard. 

  - Go to 'http://dev.medicmobile.org:5984/dashboard/_design/dashboard/_rewrite/settings#/groups'
  - Click Add Group. Enter 'organizationX'. Click Save.

Step 2
------

Adjust kujua-lite access settings.

  - Go to `http://dev.medicmobile.org:5984/dashboard/_design/dashboard/_rewrite/settings#/apps`
  - On the row with the newly installed kujua app, click settings.
  - Click on the tab 'User Access'
  - Select the radio 'Specified Groups'
  - Type 'organizationX' and select it.
  - Click 'Save Changes'

Users
-----

Add a user to the new organiztion

  - Go to `http://dev.medicmobile.org:5984/dashboard/_design/dashboard/_rewrite/settings#/users`
  - Click 'Add User'
  - Enter the username or email address
  - Choose a password, or generate one.
  - In the groups field, make sure 'organizationX' is added
  - Click on one of the add options.

Add the needed roles in the user editor

  - Go to `http://dev.medicmobile.org:5984/dashboard/_design/dashboard/_rewrite/settings#/users`
  - Click the edit button for the user.
  - Add the roles `kujua-user', and optionally 'district_admin' or 'national_admin'.
  - In the kujua-base section, add a district id. 
  - Click Save

