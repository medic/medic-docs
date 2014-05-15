#!/bin/bash -x

STAGING_DB='http://travis-ci:a5nghmongP!@staging.dev.medicmobile.org/kujua-docs'
MARKET='http://travis-ci:a5nghmongP!@staging.dev.medicmobile.org/markets-release/upload'

if [ "$TRAVIS_BRANCH" == "master" ]; then
    kanso push "$MARKET" || exit "$?"
    kanso push "$STAGING_DB" || exit "$?"
fi

exit "$?"
