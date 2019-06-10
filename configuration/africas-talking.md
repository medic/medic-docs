# Africa's Talking Integration

Added in v3.6.0

SMS messages can be sent and received using the [Africa's Talking](https://africastalking.com) service.

## Africa's Talking configuration

Log on to the [Africa's Talking Dashboard](https://account.africastalking.com) and configure your callback URLs as follows.

- Delivery Reports: `https://<hostname>/api/v1/sms/africastalking/delivery-reports`
- Incoming Messages: `https://<hostname>/api/v1/sms/africastalking/incoming-messages`

Then generate an "API Key" and save this in your Medic Configuration.

## Medic configuration

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "africas-talking",
    "reply_to": "<phone number that messages will be from>",
    "africas_talking": {
      "api_key": "<africa's talking api key>",
      "username": "<africa's talking username>",
      "allowed_ips": [ "164.177.141.82", "164.177.141.83" ]
    }
  }
}
```

The `allowed_ips` is hardcoded to the Africa's Talking server's IPs. Use the ones above unless AT change their addresses.

## Testing

To test your integration, set your "username" to "sandbox", log in to [Africa's Talking](https://account.africastalking.com), and go to the Sandbox app.
