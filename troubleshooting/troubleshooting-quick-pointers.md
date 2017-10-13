# Troubleshooting - Quick Pointers and Tips

* ### Message Loops

This is happens when a feedback loop happens between the webapp and a mobile number via the gateway due to autoreplies from the webapp.

See the [Github Issue](https://github.com/medic/medic-webapp/issues/750#issuecomment-146254467).

**Solution:** Add the offending number(e.g `800` or `SAFARICOM`) to the `Outgoing Deny List` in the webapp's `app_settings` configuration file.

```
  "multipart_sms_limit": 10,
  "outgoing_deny_list": "800, SAFARICOM",
  "contact_summary": ""

```

