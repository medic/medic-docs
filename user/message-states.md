# SMS message states/statuses

## Interaction between medic-webapp and medic-gateway
[Medic-webapp](https://github.com/medic/medic-webapp) uses [medic-gateway](https://github.com/medic/medic-gateway)
to send and receive SMS messages.

When an SMS report comes in from a user, [medic-sentinel](https://github.com/medic/medic-sentinel) adds the appropriate list of
scheduled messages (to be sent at a future date) to the report doc.

Periodically, sentinel checks for messages that need to be sent, and [sets their state to `pending`](https://github.com/medic/medic-sentinel/blob/master/schedule/due_tasks.js) if their scheduled sending time has been reached or passed.

Periodically, the gateway polls the medic-api over HTTP to get any messages that need to be sent (i.e. that are in `pending` state). At the same time it reports on the status of the messages it's trying to send and the messages it already sent for which it has delivery status updates.

Medic-api looks for messages with state `pending` and passes them along to gateway, and stores new states for messages based on gateway's status updates.

## Message statuses/states

Both webapp and gateway store states/statuses of the messages to keep track of the exchange. Webapp calls them states, gateway calls them statuses.
They each have their set of statuses, which sometimes are called the same but do not mean the same thing. Watch out.

### Message statuses in medic-gateway
See [https://github.com/medic/medic-gateway#content](https://github.com/medic/medic-gateway#content)

### Message states in medic-webapp

| State | Description |
|------|------|
| scheduled | Not yet due. Messages as part of a configured schedule start in this state and are changed to `pending` when due. |
| pending | Due to be sent. The SMS gateway should pick this up for sending. Auto replies and instant messages start in this state. |
| forwarded-to-gateway | Message has been sent to gateway. |
| received-by-gateway | Has been received by the gateway. |
| forwarded-by-gateway | Gateway has tried sending the message. |
| sent | Successfully delivered to the sms network. |
| delivered | Successfully received by the recipient's device. |
| failed | The sending attempt failed. Sending will not be retried without user intervention. |
| denied | This will not be sent. The recipient phone number is configured to be denied via `outgoing_deny_list`, `outgoing_deny_with_alphas`, or `outgoing_deny_shorter_than`. |
| cleared | This will not be sent as a report has triggered an event to stop it. This can happen if a patient visit has occurred before the visit reminder is sent. |
| muted | This will not be sent as the task has been deliberately stopped. Messages in this state can be unmuted by user action. |

## Timeline of the protocol, for Webapp-originating message

Read the table below like a vertical timeline : each time an event happens, the states/statuses corresponding to the message get updated.

Note 1 : Gateway only sends a status update for a message only if the "needs forwarding" flag for the message status is true, and then sets it back to false. So it only sends status updates once.

Note 2 : If api sends the same WO message again, then gateway sets its needs forwarding flag to true, and so sends the status at the next poll.

Note 3 : not all of the events below happen every time : this is assuming only one step of SMS-sending happens between each poll. If several steps happened, then some of the events below are skipped. If several status changes have happened between polls, Gateway will report the multiple new statuses at the next poll.

number | Event | webapp state | gateway status | gateway "Needs forwarding" flag
-|------|---------------|---------------|-----
1 | Due date to send the message passes | pending | ---
2 | Gateway polls and gets a new WO message | forwarded-to-gateway | --- | ---
3 | Gateway saves message in its DB | forwarded-to-gateway | UNSENT | true
4 | Gateway reports UNSENT status for the message | received-by-gateway | UNSENT | false
5 | Gateway sends the message | received-by-gateway | PENDING | true
6 | Gateway reports PENDING status for the message | forwarded-by-gateway | PENDING | false
7 | Gateway gets confirmation the message left | forwarded-by-gateway | SENT | true
8 | Gateway reports SENT status for the message | sent | SENT | false
9 | Gateway gets confirmation the message arrived | sent | DELIVERED | true
10 | Gateway reports DELIVERED status for the message | delivered | DELIVERED | false
