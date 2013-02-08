## Cache Manifest Timestamps

This package will automatically add a comment to the bottom of cache manifest files
with the current time (at push). This causes the browser to refresh any cached
content since the last push occurred.

### Usage

```javascript
// kanso.json
{
    ...
    "attachments": [
        ...
        "myproject.appcache"
    ],
    "cache_manifests": [
        "myproject.appcache"
    ],
    "dependencies": {
        ...
        "cache-manfiest-timestamp": null
    }
}
```
