# Releasing

## Webapp

When all the required issues are fixed in master it's time to put together a release.

1. Pick a version number. We use [semver](http://semver.org) so if there are breaking changes increment the major, otherwise if there are new features increment the minor, otherwise increment the service pack. Breaking changes in our case relate to updated software requirements (egs: CouchDB, node, minimum browser versions) or broken backwards compatibility in an api.
2. If releasing a new major or minor...
  - Update [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber) to the latest version in api, sentinel, and webapp and commit to `master` and push. This ensures we're up to date with the latest in phone number validation.
  - Update the git submodules (api and sentinel) to the latest and commit to `master` and push.
  - [Export the translations](translations.md) for all languages from POE which pushes directly to `master` so pull these changes locally.
  - Create a new release branch from `master` named `<major>.<minor>.x` in medic-webapp, medic-sentinel, and medic-api.
3. Set the version number from step 1 in medic-webapp kanso.json, package.json, and npm-shrinkwrap.json. If releasing a new major or minor, also set the versions in `master` to be the next version (e.g. `<major>.<minor+1>.0`), so that the alpha builds will have the right version.
4. If releasing a service pack use `git cherry-pick` to merge the relevant commits into the release branch.
5. Update the [changelog](https://github.com/medic/medic-webapp/blob/master/Changes.md) include descriptions of bug fixes, features, breaking changes, known issues, and workarounds. Include link to issues or further documentation where applicable. You may find [this script](https://github.com/medic/medic-webapp/blob/master/scripts/changelog-generator.js) useful to find issues closed since the previous release.
6. Commit and push the above changes.
7. Release a beta for the new version by tagging the release branch, ie: `git tag <version>-beta.<beta-number> && git push --tags`
8. Wait for the build to succeed then notify developers, testers, and product managers to begin release testing. Until release testing passes, fix the issues in `master`, and go back to step 4.
9. Create a release in GitHub so it shows up under the [Releases tab](https://github.com/medic/medic-webapp/releases) with the naming convention `<major>.<minor>.<patch>`. This will create the git tag automatically. Copy the entry from the changes log as the release description. Also create a tag in medic-api and medic-sentinel with the same tag name.
10. Confirm the release build completes successfully and the new release is available on the correct [market](https://staging.dev.medicmobile.org).
11. Copy the changelog for the release from the release branch into `master`
12. Let the product manager (Sharon) know to announce the release.
13. :beer:

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
