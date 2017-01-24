# Message states

All messages in the system are in one of the following states.

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
