# Releasing

## Webapp

We release betas at the end of every sprint. These are cut directly from master:

1. Pull master to make sure you have everything
2. `git tag x.y.0-beta.z`, e.g. `get tag 2.9.0-beta.4`. This version should be the next logical version that is not yet released.
3. `git push --tags`
4. As long as the build passes Travis will take care of the rest

Release process checklist for medic-webapp:

1. If releasing a new major or minor version create a new release branch from master named `<major>.<minor>.x`. If releasing a patch version then merge or cherry pick the necessary commits from master into the relevant release branches.
2. Update changes log (Changes.md), include descriptions of bug fixes, features, breaking changes, known issues, and workarounds. Include link to issues or further documentation where applicable.
3. Bump version numbers in kanso.json, package.json, and npm-shrinkwrap.json according to semver.
4. Tag the release in git. CI will publish to the correct market depending on the name of the tag.
  - If releasing a beta then create a tag named `<major>.<minor>.<patch>-beta.<beta-number>`
  - If releasing a final create a release in GitHub so it shows up under the [Releases tab](https://github.com/medic/medic-webapp/releases). Use the naming convention `<major>.<minor>.<patch>`. This will create the git tag automatically. Copy the entry from the changes log as the release description. Also create a tag in each submodule repository (api and sentinel) with the same tag name.
5. Confirm the release build completes successfully and the new release is available on the correct [market](https://staging.dev.medicmobile.org).
6. If the release is final let the product manager (Sharon) know to announce the release.

Generally from master we create beta releases, and once QA passes beta releases get "promoted" to final by retagging the successful beta as final.

## Android apps

Publishing the Android apps for **Medic Mobile** (`medic-android`) and **Collect** (`medic-collect`) and **Gateway** (`medic-gateway`) to the Google Play Store:

* Connect to the Medic Mobile build server using Remote Desktop Connection.
* Go to the Jenkins project for [medic-android](http://localhost:8080/job/medic-android/) or [medic-collect](http://localhost:8080/job/medic-collect/), and then `Build with Parameters`:
  * `VERSION_TO_BUILD` = Complete numerical version number:
    * Medic Mobile: `a.b.c` format. Eg `0.1.71`
    * Collect: `a.b.c.d` format. Eg `1.4.5.1100` where `1.4.5` is the base Collect version and `1100` is the build number.
* Go to the Jenkins project for [medic-android-publish](http://localhost:8080/job/medic-android-publish/) or [medic-collect-publish](http://localhost:8080/job/medic-collect-publish/) or [medic-gateway-publish](http://localhost:8080/job/medic-gateway-publish/), and then `Build with Parameters`:
  * `VERSION_TO_PUBLISH` = Use the same medic-android or medic-collect version that was just built.
  * `RELEASE_TRACK` = Select `alpha`, `beta`, or `production` as needed.
  * `BRANDING` = Choose the "product flavor" to publish.
* Check the Google Play Store developer console to make sure that the version matches the updated app's build number.
