# Development Workflow

## Daily Stand

Each day developers post our objectives in the #dailies Slack channel for the previous and current day and discuss any potential blockers. If a issue will not be completed within an iteration time frame that should be discussed.

There are optional daily standup meetings, at 9am UTC (10am CEST) and 8pm UTC (9am NZST). Show up if you want, it's a good place to check in and discuss issues.

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

The main branch is `master` which must be kept stable so as not to impact other developers and so we can take a release branch as needed. To achieve this we do (almost) all development in a branch and submit a PR for code review. This means the CI runs and another developer has signed off on the change before it hits the `master` branch.

Format your commit messages according to Git standards. First line should be a short title/summary (50 characters or so) with more details in a separate paragraph, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.

See tips on [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) and add your favorites here.

> Every good commit message should be able to complete the following sentence:
>
> When applied, this commit will: {{YOUR COMMIT MESSAGE}}

Never force push remote. Prefer rebasing over merging as it makes for a cleaner history.

Commit reformats and refactors separately from actual code changes to make reviewing easier.

For more help with Git see: [Using Git](./using-git.md).

## Branches

- The main branch is `master` and is the github default branch and contains the latest code.
- Release branches have the form `<major>.<minor>.x` and should be stable.
- Feature branches have the form `<issue-number>-<issue-description>` and are work in progress.

## Issues

Issues are managed in Github. When creating issues assign a status value by choosing a label. This is used to track progress, so we have some idea what work is being handled. All issues are created in the medic-webapp repository so they can be tracked in one place.

### States

#### Nothing

If an issue has no status label at all then it needs to be triaged to work out the scheduled and priority.

#### 0 - Backlog

Proposed but not approved for development yet. This issue may be closed as unrequired, moved into scheduled, or linger in purgatory forever more.

#### 1 - Scheduled

We have all the design and detail we need to begin development. Once issues are in this state they can be selected for inclusion in a milestone and can be assigned to a developer for Active Work.

#### 2 - Active Work

In development and being worked on. Issues in this state must be assigned to a developer and be in the current milestone.

Create one feature branch in each of the repositories you update. The name of the feature branch should be in the form `<issue-number>-<readable-name>`, for example `1104-inclusive-export`. Once you're satisfied with your changes:

1. Submit a PR for each of the branches.
2. Link from the PR to the original issue or vice versa.
3. Assign the original issue to another developer for review, the PR can be left unassigned since it's linked on the original issue.

#### 3 - Code Review

All non-trivial commits should be reviewed by another developer. Reviews should focus on code readability, test quality and coverage, and looking for obvious bugs.

If the code fails review then comment on the issue, apply the Active Work tag, and assign back to the original developer.

Once the code passes review:

1. Merge the Pull Request. Most of the time we use the Squash and Merge technique to make the git history as clean as possible.
2. Apply the Acceptance Testing tag.
3. Close the issue.
4. Clear your assignment.

#### 4 - Acceptance Testing

Ready to be user acceptance tested. If the issue passes acceptance testing then apply the Ready state tag. However if the issue fails then: reopened it, add the Active Work and Returned tags, assigned back to the developer who worked on it, and move it to the current milestone.

#### 5 - Ready

Passed acceptance testing and ready for release.

#### 6 - Released

The code to resolve the issue has been released to the market.

## Triaging old issues

There is a [script](https://github.com/SCdF/github-issue-roulette) that can be configured to run against medic-webapp.

This script is meant to randomly assign old untriaged issues to devs in the sprint.

At the time of writing it will be run once every sprint, and will assign 2 issues per developer.

### What do I do with one of these tickets?

We are trying to cut down on a giant unmanagable backlog of possibly irrelevant tickets.

Before the end of the sprint, you must, for each ticket assigned to you, work out if that ticket should be scheduled or closed. You may need to ask other relevant people about it, so you probably won't want to leave it until the last day. You can either :

 - **schedule it**: the issue is currently relevant and should be done as soon as time and priorities allow. Label it `1 - Scheduled`. No need to put it in current sprint. It will be considered for future sprints.

 - **close it**: if it is not that relevant, or might be interesting deep in the future, or is interesting but maybe not a big deal: **just close it**! If it's really that important it will come up again.

Regardless of what you do with the ticket, please document the reasoning by commenting in the issue. This will help reduce mistakes, as the reasoning will be available for everyone to read, and any mistakes there can be rectified.
