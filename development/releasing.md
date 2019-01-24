# Releasing

## Webapp

When all the required issues are fixed in master it's time to put together a release.

1. Pick a version number. We use [semver](http://semver.org) so if there are breaking changes increment the major, otherwise if there are new features increment the minor, otherwise increment the service pack. Breaking changes in our case relate to updated software requirements (egs: CouchDB, node, minimum browser versions) or broken backwards compatibility in an api.
2. If releasing a new major or minor...
  - Update [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber) to the latest version in api, sentinel, and webapp and commit to `master` and push. This ensures we're up to date with the latest in phone number validation.
```bash
npm install --save google-libphonenumber@latest
```
  - [Import translations keys](translations.md#adding-new-keys) into POE and make sure the #translations Slack channel is notified to translate new and updated values.

  - Create a new release branch from `master` named `<major>.<minor>.x` in medic-webapp.
3. Set the version number from step 1 in medic-webapp kanso.json, package.json, and npm-shrinkwrap.json. If releasing a new major or minor, also set the versions in `master` to be the next version (e.g. `<major>.<minor+1>.0`), so that the alpha builds will have the right version.
4. If releasing a service pack use `git cherry-pick` to merge the relevant commits into the release branch.
5. Create a new document in the [release-notes folder](https://github.com/medic/medic-webapp/tree/master/release-notes). Ensure all issues are in the GH Project, that they're correct labelled, and have human readable descriptions. Use [this script](https://github.com/medic/medic-webapp/blob/master/scripts/changelog-generator) to export the issues into our changelog format. Manually document any known migration steps and known issues. Provide description, screenshots, videos, and anything else to help communicate particularly important changes.
6. Commit and push the above changes.
7. Release a beta for the new version by tagging the release branch, ie: `git tag <version>-beta.<beta-number> && git push --tags`
8. Wait for the build to succeed then notify developers, testers, and product managers to begin release testing. Until release testing passes, fix the issues in `master`, and go back to step 4.
9. [Export the translations](translations.md#exporting-changes-from-poeditor-to-github) to your git clone and commit to `master` and your release branch.
10. Create a release in GitHub so it shows up under the [Releases tab](https://github.com/medic/medic-webapp/releases) with the naming convention `<major>.<minor>.<patch>`. This will create the git tag automatically. Link to the release notes created in step 5 in the description of the release.
11. Confirm the release build completes successfully and the new release is available on the [market](https://staging.dev.medicmobile.org).
12. Let the product manager know to announce the release.
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
