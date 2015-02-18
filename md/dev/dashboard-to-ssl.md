# How to Migrate Dashboard to SSL

On Feb 17, 2015 the staging server or market/release server was changed to SSL
only (https). This means redirects were setup for the non-SSL (http) port 80.
Unfortunately the dashboard does not support redirects at the time of the
change so we just migrated all the production instances manually to use SSL.

But if you have a local development or testing install, or a DIY install then
you won't get this change.  But updating the dashboard install and market
documents is quite simple using Futon.

Navigate to your installation to the get_markets view, .e.g:

```
http://192.168.3.10/_utils/database.html?dashboard/_design/dashboard/_view/get_markets
```

![Get Markets View](img/get-markets-view.png)

There you will see a list of documents, anywhere you see 'http' you will want to
edit and replace instances of 'http' with 'https' and save the changes.  To edit the document click on the ID field in the list.

![Edit Install Document](img/edit-install-doc.png)

