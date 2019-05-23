
# Obtaining logs

There are many places where useful logs reside. This details all those places, and the easiest way to get a hold of them.

## The browser

To check if there are relevant logs open up the developer console. The shortcut is probably COMMAND+ALT+I on MacOS, or CTRL+ALT+I on Linux and Windows. Click the console tab and copy out any errors or logging that you think is relevant.

## Servers

The easiest way is to use `medic-logs`, a tool that comes with [`medic-conf`](https://github.com/medic/medic-conf):

```
medic-logs anInstance gardener
```

See [medic-logs documentation](https://github.com/medic/medic-conf#medic-logs) for more details.

This will download logs to your current directory. You will need to look through these logs to work out what is relevant.
