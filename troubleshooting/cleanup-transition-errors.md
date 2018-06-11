# Transition errors

When there's an error processing a sentinel transition, a document is marked as invalid (has a non-empty `errors` attribute). Such documents are not included in when looping through contact reports and thus affect tasks and targets.

When the cause of the transition error is resolved, the affected documents need to have the error properties removed so as to be reprocessed by sentinel.

NB: restart gardener if the fix entailed fixing something with the transition logic.

Here's a script that can be executed to do that cleanup.

NB: Are there any edgecases that may have been overlooked?

```code
#!/bin/bash

set -eux

echo "Ensure COUCH_URL is in the following format: https://user:pass@instance-name.medicmobile.org"

command -v jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.  Aborting."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo >&2 "I require curl but it's not installed.  Aborting."; exit 1; }

curl --compressed -H 'content-type:application/json' -G --data-urlencode 'key=['false']' $COUCH_URL/medic/_design/medic-client/_view/reports_by_validity?include_docs=true | \
jq '{docs: [ .rows[] | select(.doc).doc | del(.tasks) | del(.transitions) | del(.errors) ]}' |  \
curl -H 'content-type:application/json' -d@- $COUCH_URL/medic/_bulk_docs
```