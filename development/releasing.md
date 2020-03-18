# Releasing

## CHT core

[Create an issue](https://github.com/medic/cht-core/issues/new/choose) for either a Major/Minor or Patch release issue template and assign it to the release manager to follow the process.

## medic-conf

Follow the [instructions in the readme](https://github.com/medic/medic-conf/#releasing).

## Android apps

All medic Android projects automatically build, sign, and publish builds via Travis. To create a new release:

1. Determine what version the build will be. This should be a valid semver (eg. `v1.1.1`). Increment the semver appropriately based on the latest release version:
    * [medic-android](https://github.com/medic/medic-android/releases)
    * [medic-gateway](https://github.com/medic/medic-gateway/releases)
    * [medic-collect](https://github.com/medic/medic-collect/releases)
    * [rdt-capture](https://github.com/medic/rdt-capture/releases)
1. Tag the commit in `master` which you'd like to release. Use `git tag v1.1.1` with the version from above and then run `git push --tags`.
1. Wait for the build to complete. You can monitor the build via travis-ci.org.
1. **To Release via the Google Play Store** - Login to the [Google Play Console](https://play.google.com/apps/publish/) and select the app flavor for release. Navigate to "Release Management > Alpha" and click "Release to Beta". Repeat this for each flavor.
1. **To Side-Load** (for Collect and Gateway) - Navigate to the GitHub Releases page (linked above) and download the relevant APKs for distribution.
