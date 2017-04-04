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
| forwarded-to-gateway | Has been sent to the gateway. |
| received-by-gateway | Has been received by the gateway. |
| sent | Successfully delivered to the sms network. |
| delivered | Successfully received by the recipient's device. |
| failed | The sending attempt failed. Sending will not be retried without user intervention. |
| denied | This will not be sent as the recipient phone number is configured in the `outgoing_deny_list`. |
| cleared | This will not be sent as a report has triggered an event to stop it. This can happen if a patient visit has occurred before the visit reminder is sent. |
| muted | This will not be sent as the task has been deliberately stopped. Messages in this state can be unmuted by user action. |

## Timeline of the protocol

Read the table below like a vertical timeline : each time an event happens, the states/statuses corresponding to the message get updated.

Event | webapp state | gateway status
------|---------------|---------------
Report comes in | scheduled | ---
Due date to send the message passes | pending | ---
Gateway polls webapp and gets the message | forwarded-to-gateway | pending
Gateway confirms it got the message from webapp | received-by-gateway | pending
Gateway sends the message | received-by-gateway | unsent
Gateway reports having sent the message | sent | sent
Gateway gets report that message is received by recipient | sent | delivered
Gateway reports to webapp that message is received by recipient | delivered | delivered


