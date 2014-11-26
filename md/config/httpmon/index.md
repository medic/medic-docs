
![edit-monitor](edit-monitor.png)

Add monitor.

So you want to add the check for a response code of 401. Then you should get an
SMS.  So we're just testing that the auth prompt is returned.

Conditions: HTTP response code is: 401

![edit-request](edit-request.png)

![respons-code-401](response-code-401.png)

Then action is send message and you can tweak the 15 minute alert if it gets
annoying, it should continue alerting you every 15 minutes if the connection is
severed/broken (the test fails).

Request should the full domain/URL. i.e. http://kilifikids.app.medicmobile.org.
The request URL to be the same one that is used for the sync URL in SMSSync,
since that the server we want to make sure is reachable.

Then Start the monitor. The green plus means testing passed. 

Now you should test that messaging works, so test a failure.

Then to test, you might edit the response code to 402 or something. To edit do
a long tap on the conditions entry/line then choose edit.

Modify the response code to be 402 and restart the monitor. You should get an
SMS at the alert number you configured.

![start-at-boot](start-at-boot.png)

Also enable Start at Boot

You can add multiple tests and notifcations so more than one person can be
alerted if necessary.

Do a reboot of the phone for good measure and check to see httpmon is
monitoring. If you have access to the server you can also shut down the web
server to test a failure notification.

