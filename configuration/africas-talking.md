# Africa's Talking Integration

Added in v3.6.0

SMS messages can be sent and received using the [Africa's Talking](https://africastalking.com) service.

## Africa's Talking configuration

First generate a long unique key to use as the `medic-api-key`.

Log on to the [Africa's Talking Dashboard](https://account.africastalking.com) and configure your callback URLs as follows.

- Delivery Reports: `https://<hostname>/api/v1/sms/africastalking/delivery-reports?key=<medic-api-key>`
- Incoming Messages: `https://<hostname>/api/v1/sms/africastalking/incoming-messages?key=<medic-api-key>`

Then generate an "API Key" (we'll refer to this as the `at-api-key`) and save this in your Medic configuration covered below.

## Medic configuration

### API keys

The API keys should be treated as securely as a password as anyone with access to them will be able to send messages using your account. Therefore we store them in the CouchDB configuration.

To add the credentials to the admin config you need to either [PUT the value using curl](https://docs.couchdb.org/en/stable/api/server/configuration.html#put--_node-node-name-_config-section-key) or similar:

```sh
curl -X PUT https://<user>:<pass>@<domain>/_node/couchdb@127.0.0.1/_config/medic-credentials/africastalking.com:incoming -d '"<medic-api-key>"'
curl -X PUT https://<user>:<pass>@<domain>/_node/couchdb@127.0.0.1/_config/medic-credentials/africastalking.com:outgoing -d '"<at-api-key>"'
```

_(Note that `couchdb@127.0.0.1` is the local node name, and may be different for you depending on your setup.)_

You can also add it via Fauxton:
 - Navigate to [the Config screen](http://localhost:5984/_utils/#/_config)
 - Click `Add Option`
 - The `Section` should be `medic-credentials`, the `Name` should be `africastalking.com:incoming` or `africastalking.com:outgoing`, and the value should be the relevant API key.
 - Click `Create`
 - You should then be able to see your credential in the list of configuration shown

### App settings

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "africas-talking",
    "reply_to": "<africa's talking shortcode>",
    "africas_talking": {
      "username": "<africa's talking username>"
    }
  }
}
```

## Testing

To test your integration, set your "username" to "sandbox", log in to [Africa's Talking](https://account.africastalking.com), and go to the Sandbox app.
