# Development Workflow

## Daily Stand

Each day developers post our objectives in the #dailies Slack channel for the previous and current day and discuss any potential blockers. If a issue will not be completed within an iteration time frame that should be discussed.

## Weekly Call

Each week the team meets on a call to discuss progress and plans for the next week. Someone reports back to #weeklies to update the wider team.

## Fortnightly Iterations

We strive to do fortnightly iterations with feature reviews and deployment to our beta/testing market. An iteration begins with a meeting where the relevant issues are discussed, prioritized and assigned.

At the end of each iteration we have a meeting where working code is demonstrated and acceptance by stake holders is confirmed. Issues are closed or moved to a ready or released state and new issues are potentially opened if unfinished work or new issues are discovered.

## Coding

### Writing

Aim for self-documenting code. Where code cannot be made self-documenting add commenting. Unnecessary comments and hard to read code fail a code review.

### Testing

All features and bug fixes must have at least one unit test. All features must have at least one end-to-end test.

### Migrating

When the schema is changed you must also provide a migration so when instances are upgraded existing data is compatible with the new code.

## Commits

We typically share one branch 'master' where new code is developed, merged and reviewed. Use your discretion or discuss with the team whether to start a separate feature branch or not. It is recommended if the commit is large or has a good chance of breaking something. Branches and pull requests are easier to review.

Include an issue number with every commit. Every commit should be related to an issue, in some cases you might create an issue for the commit before you push it. Commit and push, early and often, but don't introduce breaking changes if the branch is shared. In the case you want to commit and push out a feature for feedback, you can put breaking commits in a switch so they don't impede another developer's progress.

Format your commit messages according to Git standards. First line should be a short title/summary (50 characters or so) with more details in a separate paragraph, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.

Every good commit message should be able to complete the following sentence:

  When applied, this commit will: {{YOUR COMMIT MESSAGE}}

Never force push remote. Prefer rebasing over merging as it makes for a cleaner history.

Commit reformats and refactors separately from actual code changes to make reviewing easier.

## Branches

- The main branch is `master` and is the github default branch and contains the latest code.
- Release branches have the form `<major>.<minor>.x` and should be stable.
- Feature branches have the form `<issue-number>-<issue-description>` and are work in progress.

## Issues

Issues are managed in Github. When creating issues assign a status value by choosing a label. This is used to track progress, so we have some idea what work is being handled. All issues are created in the medic-webapp repository so they can be tracked in one place.

### States

#### 0 - Backlog

Proposed but not approved for development yet. This issue may be closed as unrequired, moved into scheduled, or linger in purgatory forever more.

#### 1 - Scheduled

Ready for development to begin. Scheduled issues must also be assigned to a milestone.

#### 2 - Active Work

In development and being worked on. Issues in this state must be assigned to a developer.

##### Without Pull Request

If you decide no Pull Request is required then changes are to be committed directly into the branch (usually the `master` branch). Once you're satisfied with your changes apply the Code Review tag and assign to another developer.

##### With Pull Request

If you decide to create a Pull Request then create one feature branch in each of the repositories you update. The name of the feature branch should be in the form `<issue-number>-<readable-name>`, for example `1104-inclusive-export`. Once you're satisfied with your changes:

1. Submit a PR for each of the branches.
2. Link from the PR to the original issue or vice versa.
3. Assign the original issue to another developer for review, the PR can be
left unassigned since it's linked on the original issue.

#### 3 - Code Review

All non-trivial commits should be reviewed by another developer. Reviews should focus on code readability, test quality and coverage, and looking for obvious bugs.

If the code fails review then comment on the issue, apply the Active Work tag, and assign back to the original developer.

Once the code passes review:

1. merge the Pull Request (if applicable)
2. apply the Acceptance Testing tag
3. close the issue
4. clear your assignment

#### 4 - Acceptance Testing

Ready to be user acceptance tested. If the issue passes acceptance testing then apply the Ready state tag. However if the issue fails it must be reopened, and the Active Work and Returned tags applied, and assigned back to the closing developer.

#### 5 - Ready

Passed acceptance testing and ready for release.

#### 6 - Released

The code to resolve the issue has been released to the market.

## Releasing

### Webapp

Release process checklist for medic-webapp:

1. If releasing a new major or minor version create a new release branch from master named `<major>.<minor>.x`. If releasing a patch version then merge or cherry pick the necessary commits from master into the relevant release branches.
2. Update changes log (Changes.md), include descriptions of bug fixes, features, breaking changes, known issues, and workarounds. Include link to issues or further documentation where applicable.
3. Bump version numbers in kanso.json, package.json, and npm-shrinkwrap.json according to semver.
4. Tag release in git. CI will publish to the correct market depending on the name of the tag.
  - If releasing a final then name the tag `<major>.<minor>.<patch>`
  - If releasing a beta then name the tag `<major>.<minor>.<patch>-beta.<beta-number>`
5. If the release is a final release also create a tag in each submodule repository (api and sentinel), mirroring with that version.
6. Confirm the release build completes successfully and the new release is available on the correct market.
7. If the release is final announce the release in the #general slack channel.

Generally from master we create beta releases, and once QA passes beta releases get "promoted" to final by retagging the successful beta as final.

### Android apps

Publishing the Android apps for **Medic Mobile** (`medic-android`) and **Collect** (`medic-collect`) to the Google Play Store:

* Connect to the Medic Mobile build server using Remote Desktop Connection.
* Go to the Jenkins project for [medic-android](http://localhost:8080/job/medic-android/) or [medic-collect](http://localhost:8080/job/medic-collect/), and then `Build with Parameters`:
  * `VERSION_TO_BUILD` = Complete numerical version number:
    * Medic Mobile: `a.b.c` format. Eg `0.1.71`
    * Collect: `a.b.c.d` format. Eg `1.4.5.1100` where `1.4.5` is the base Collect version and `1100` is the build number.
* Go to the Jenkins project for [medic-android-publish](http://localhost:8080/job/medic-android-publish/) or [medic-collect-publish](http://localhost:8080/job/medic-collect-publish/), and then `Build with Parameters`:
  * `VERSION_TO_PUBLISH` = Use the same medic-android or medic-collect version that was just built.
  * `RELEASE_TRACK` = Select `alpha`, `beta`, or `production` as needed.
  * `BRANDING` = Choose the "product flavor" to publish.
* Check the Google Play Store developer console to make sure that the version matches the updated app's build number.
