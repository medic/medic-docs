#!/bin/bash -x

if [ -z "$UPLOAD_MARKET" ]; then
    echo 'Define UPLOAD_MARKET in your environment.'
    exit 1
fi

if [ -z "$UPLOAD_STAGING_DB" ]; then
    echo 'Define UPLOAD_STAGING_DB in your environment.'
    exit 1
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
    kanso push "$UPLOAD_MARKET" || exit "$?"
    kanso push "$UPLOAD_STAGING_DB" || exit "$?"
fi

exit "$?"
