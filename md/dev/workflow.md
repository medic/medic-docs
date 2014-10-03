# Development Workflow

## Weekly iterations

We strive to do weekly iterations with feature reviews and deployment to our
beta/testing market.  An iteration begins with a meeting where the relevant
issues are discussed, prioritized and assigned.

At the end of each iteration we have a meeting where working code is
demonstrated and acceptance by stake holders is confirmed. Issues are closed or
moved to a ready or released state and new issues are potentially opened if
unfinished work or new issues are discovered.

## Daily stand

Each day, we post our objectives for the previous and current day and discuss
any potential blockers.  If a issue will not be completed within an interation
time frame, that should be discussed.

## Issues

Issues are managed in Github.  When creating issues assign a status value by
choosing a label.  This is used to track progress, so we have some idea what 
work is being handled.

## Commits, Branching and Code Review

We typically share one branch 'develop' where new code is developed, merged and
reviewed.  Use your discretion or discuss with the team whether to start a
separate feature branch or not. It is recommended if the commit is large or has
a good chance of breaking something. Branches and pull requests are easier to
review.  To notify a specific person for code review use @username in the PR
description.

Include an issue number with every commit.  Every commit should be related to an
issue, in some cases you might create an issue for the commit before you push
it.  Commit and push, early and often,  but don't introduce breaking changes if
the branch is shared.  In the case you want to commit and push out a feature
for feedback, you can put breaking commits in a switch so they don't impede
another developer's progress.

Format your commit messages according to Git standards.  First line should be a
short title/summary (50 characters or so) with more details in a separate
paragraph, respecting 79 character line widths. Using `git -av` is recommended
to review your diff while you write your commit message.
