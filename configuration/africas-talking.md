# Africa's Talking Integration

Added in v3.6.0

SMS messages can be sent and received using the [Africa's Talking](https://africastalking.com) service.

## Configuration

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "africas-talking",
    "reply_to": "<phone number that messages will be from>",
    "africas_talking": {
      "api_key": "<africa's talking api key>",
      "username": "<africa's talking username>"
    }
  }
}
```

## Testing

To test your integration, set your "username" to "sandbox", log in to [Africa's Talking](https://account.africastalking.com), and go to the Sandbox app.
