# Development Workflow

## Daily Stand

Each day we post our objectives in the #stand Slack channel for the previous and current day and discuss any potential blockers. If a issue will not be completed within an interation time frame, that should be discussed.

## Weekly Stand

Each week we post out objectives and accomplishments in the #weeklies Slack channel to keep the wider organisation up to date on development progress.

## Fortnightly Iterations

We strive to do fortnightly iterations with feature reviews and deployment to our beta/testing market. An iteration begins with a meeting where the relevant issues are discussed, prioritized and assigned.

At the end of each iteration we have a meeting where working code is demonstrated and acceptance by stake holders is confirmed. Issues are closed or moved to a ready or released state and new issues are potentially opened if unfinished work or new issues are discovered.

## Commits, Branching and Code Review

We typically share one branch 'develop' where new code is developed, merged and reviewed. Use your discretion or discuss with the team whether to start a separate feature branch or not. It is recommended if the commit is large or has a good chance of breaking something. Branches and pull requests are easier to review.

Include an issue number with every commit. Every commit should be related to an issue, in some cases you might create an issue for the commit before you push it. Commit and push, early and often, but don't introduce breaking changes if the branch is shared. In the case you want to commit and push out a feature for feedback, you can put breaking commits in a switch so they don't impede another developer's progress.

Format your commit messages according to Git standards. First line should be a short title/summary (50 characters or so) with more details in a separate paragraph, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.

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

If you decide no Pull Request is required then changes are to be committed directly into the branch (usually the `develop` branch). Once you're satisfied with your changes apply the Code Review tag and assign to another developer.

##### With Pull Request

If you decide to create a Pull Request then create one feature branch in each of the repositories you update. The name of the feature branch should be in the form `{issue-number}-{readable-name}`, for example `1104-inclusive-export`. Once you're satisfied with your changes:

1. submit a Pull Request for each of the branches
2. link from the original Issue to the PRs
3. apply the Code Review tag and assign to another developer

#### 3 - Code Review

All non-trivial commits should be reviewed by another developer. Reviews should focus on code readability, test quality, and looking for obvious bugs.

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

Release process checklist for medic-webapp:

* Update changes log (Changes.md), include descriptions of bug fixes, features
  and breaking changes or workarounds. Include link to issues or further documentation 
  where applicable.
* Bump version numbers in kanso.json and package.json according to semver.
* Tag release in git using Github releases manager.
* Optionally merge with major version branch, e.g. v0.4, v1, testing, develop.
* Push build to release market or confirm this happened automatically by CI.

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
