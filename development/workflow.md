# Development Workflow

## Daily Stand

Each day developers post our objectives in the #dailies Slack channel for the previous and current day and discuss any potential blockers. If a issue will not be completed within an iteration time frame that should be discussed.

There are optional daily standup meetings twice a day roughly 12 hours apart. Show up to whichever one fits with your timezone. It's a good place to check in and discuss issues.

## Weekly Call

Each week the team meets on a call to discuss progress and plans for the next week. Notes are taken in the [agenda doc](https://docs.google.com/document/d/14AuJ7SerLuOPESBjQlJqpBtzwSAoVf5ykTT7fjyJBT0/edit#). Someone reports back so our progress can be reported in #medic-news for the wider team.

## Monthly Goals

At the end of each month we review progress and plan the goals for the next month.

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

#### 1 - Triaged

We have all the design and detail we need to begin development. Once issues are in this state they can be selected for inclusion in a milestone and can be assigned to a developer for Active Work.

#### 2 - Active work

In development and being worked on. Issues in this state must be assigned to a developer and be in the current milestone.

Create one feature branch in each of the repositories you update. The name of the feature branch should be in the form `<issue-number>-<readable-name>`, for example `1104-inclusive-export`. Once you're satisfied with your changes:

1. Submit a PR for each of the branches.
2. Link from the PR to the original issue or vice versa.
3. Assign the original issue to another developer for review, the PR can be left unassigned since it's linked on the original issue.

#### 3 - Code review

All non-trivial commits should be reviewed by another developer. Reviews should focus on code readability, test quality and coverage, and looking for obvious bugs.

If the code fails review then comment on the issue, apply the Active Work tag, and assign back to the original developer.

Once the code passes review:

1. Merge the Pull Request. Most of the time we use the Squash and Merge technique to make the git history as clean as possible.
2. Apply the Acceptance Testing tag.
3. Clear your assignment.

#### 4 - Acceptance testing

Ready to be user acceptance tested. If the issue passes acceptance testing then apply the Ready state tag and close the issue. However if the issue fails then add the Active Work and Returned tags, assigned back to the developer who worked on it, and move it to the current milestone.

#### 5 - Ready

Passed acceptance testing and ready for release.

#### 6 - Released

The code to resolve the issue has been released to the market.

## Triaging old tickets

We periodically run a [script](https://github.com/medic/github-issue-roulette) against medic-webapp tickets. We do this to catch two situations:
 - Tickets that do not have the three labels they need (Type, Priority and Status)
 - Tickets that have not been touched in 90 days
 
The plan is to keep cruft in our ticket DB to a minimum, and have them curated into a colletion of detailed clear tickets that can and should be actionable in the near to mid future.

You will occasionally get assigned tickets and asked to deal with one or both of the above problems.

### What do I do when I get one of these tickets?

Use your judgement (or someone else's, feel free to pull in others either directly on the ticket or via Slack etc) to decide:
 - Is its description too vague? Is it detailed enough to be actionable?
 - Is this something we want to do **in the near future**? Does it fit with our product etc?
 - If this is an older ticket, do you think it is still relevant? Is there still interest? (If there is no interest it can be closed: it can always be re-opened or re-written in the future)
 - Is this covered by existing tickets, or existing plans?
 - If it's a bug, does it have: steps to reproduce; expected behaviour; actual behaviour; server info, browser info, screenshots etc where applicable?

From this decide if you need to go back to the ticket creator for more information, or close the ticket (using one of the `Won't Fix` labels), or keep it.

Additionally, if there are missing labels:
 - Type should be reasonably obvious: which of those labels most fits the issue
 - Status should almost certainly be `Status: 1 - Triaged`
 - Priority is dependent on the severity of the problem: if it's a production issue it's probably high, if it's a minor thing it's probably low, medium for everything else (but use your judgement)
 
### Anything else?

Regardless of what you do with the ticket, please:
 - Remove the `Needs Triage` label once triage is complete
 - Document the reasoning by commenting in the issue. This will help reduce mistakes, as the reasoning will be available for everyone to read, and any mistakes there can be rectified.

