# SMS message states

## Interaction between medic-webapp and medic-gateway
[Medic-webapp](https://github.com/medic/medic-webapp) uses [medic-gateway](https://github.com/medic/medic-gateway)
to send SMS messages.

When a report comes in, [medic-sentinel](https://github.com/medic/medic-sentinel) adds the appropriate list of
scheduled messages (to be sent at a future date) to the report doc.

Periodically, sentinel checks for messages that need to be sent, and [sets their status to `pending`](https://github.com/medic/medic-sentinel/blob/master/schedule/due_tasks.js).

Periodically, the gateway pings the webapp over HTTP to get any messages that need to be sent.
and report on the status of the messages it's trying to send.
Webapp looks for messages with status `pending` and passes them along to gateway, and stores new statuses for messages based on gateway's status updates.

## Message statuses

Both webapp and gateway store statuses of the messages to keep track of the exchange.
They each have their set of statuses, which sometimes are called the same but do not mean the same thing. Watch out.

### Message statuses in medic-gateway
See [https://github.com/medic/medic-gateway#messages](https://github.com/medic/medic-gateway#messages)

### Message statuses in medic-webapp

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

Event | webapp status | gateway status
------|---------------|---------------
Report comes in | scheduled | ---
Due date to send the message passes | pending | ---
Gateway pings webapp and gets the message | forwarded-to-gateway | pending
Gateway confirms it got the message from webapp | received-by-gateway | pending
Gateway sends the message | received-by-gateway | sent
Gateway reports having sent the message | sent | sent
Gateway gets report that message is received by recipient | sent | delivered
Gateway reports to webapp that message is received by recipient | delivered | delivered


