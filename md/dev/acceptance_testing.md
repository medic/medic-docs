Acceptance Testing
==================

It involves making sure the original issue is resolved. After testing the issue
needs to be commented on with the result, and the issue updated accordingly. 

  - If it does work, remove label `Acceptance Testing`, add label `Ready`.
  - If it does not solve the original issue, reopen the issue (which flags it to the dev), and add the `Returned` label.

Open additional issues as they are discovered.

For low level issues I think another dev is the best person to do acceptance
testing internally. For feature requests the best person is the original
requester - which can be a PM, myself, or anyone else on the team.

Ideally the person who opened the issue would do the final acceptance testing
(read close) of the issue since they are most familiar it, this is by no means
a requirement.  Anyone familiar enough with the feature can do the acceptance
testing.  If the feature or bug is not clearly described then ask questions in
the issue discussion thread.

