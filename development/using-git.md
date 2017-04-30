
# Using Git

New to Git or need a refesher?

 - [A tutorial introduction to Git](https://git-scm.com/docs/gittutorial)
 - [A tutorial introduction to Git: part two](https://git-scm.com/docs/gittutorial-2)
 - [A Git core tutorial for developers](https://git-scm.com/docs/gitcore-tutorial)

If you're on Unix, these are also likely installed as man pages:

```
man gittutorial
man gittutorial-2
man gitcore-tutorial
```

For more reading, [Pro Git](https://git-scm.com/book) is available online, and
[Chapter 10: Git Internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
is quite helpful.

Published a commit by mistake?  GitHub has a decent writeup on that:

 - [Removing sensitive data from a repository](https://help.github.com/articles/removing-sensitive-data-from-a-repository/)


## How To Extract a Module From an Existing Repo

The following are the steps I used for creating [medic-smsparser](https://github.com/medic/medic-smsparser) based off medic-webapp.

First git clone using a URL scheme rather than plain file system path otherwise
you will get hard links instead of a copy.

```
git clone git@github.com:medic/medic-webapp.git 
```

<p style="text-align:center">or</p>

```
git clone file:///home/linus/dev/medic-webapp
```

Then compile a list of files you are interested in.  If you only have a single directory
you need then read about the `--subdirectory-filter` option of
`filter-branch`.  In this how-to I'm using a set of files:

```
$ cat files
packages/kujua-sms/kujua-sms/validate.js 
packages/kujua-sms/views/lib/javarosa_parser.js 
packages/kujua-sms/views/lib/mp_parser.js 
packages/kujua-sms/views/lib/smsparser.js 
packages/kujua-sms/views/lib/textforms_parser.js 
packages/kujua-sms/kujua-sms/utils.js 
tests/nodeunit/form_definitions.js 
tests/nodeunit/unit/kujua-sms/smsparser.js 
tests/nodeunit/unit/kujua-sms/smsparser_compact_textform.js 
tests/nodeunit/unit/kujua-sms/textforms_parser.js 
tests/nodeunit/unit/kujua-sms/validate.js 
```

Next query the git history for any file renames by using `--follow`:

```
for i in `cat files`; do \
  git log --oneline --name-only --follow --all -- "$i" | \
  egrep -v -e '^[0-9A-Fa-f]+\s'; \
done | sort | uniq > all-files
```

In the following commands I assume the branch we are working on is `master`, but this could easily be applied to any branch.

Take a note of your original commit count.  

```
$ git rev-list master | wc -l
    6844
```


Run the filter on the current branch, this might take a little while:

```
git filter-branch -f --prune-empty --index-filter  '\
     git rm --cached -r -q -- . ; \
     git reset -q $GIT_COMMIT -- \
       lib/utils.js \
       packages/kujua-sms-import/kujua-sms-import/smsparser.js \
       packages/kujua-sms-import/views/lib/smsparser.js \
       packages/kujua-sms/kujua-sms/utils.js \
       packages/kujua-sms/kujua-sms/validate.js \
       packages/kujua-sms/tests/kujua-sms/smsparser.js \
       packages/kujua-sms/tests/kujua-sms/smsparser_compact_textform.js \
       packages/kujua-sms/tests/kujua-sms/textforms_parser.js \
       packages/kujua-sms/tests/kujua-sms/validate.js \
       packages/kujua-sms/views/lib/javarosa_parser.js \
       packages/kujua-sms/views/lib/mp_parser.js \
       packages/kujua-sms/views/lib/smsparser.js \
       packages/kujua-sms/views/lib/textforms_parser.js \
       tests/nodeunit/form_definitions.js \
       tests/nodeunit/unit/kujua-sms/smsparser.js \
       tests/nodeunit/unit/kujua-sms/smsparser_compact_textform.js \
       tests/nodeunit/unit/kujua-sms/textforms_parser.js \
       tests/nodeunit/unit/kujua-sms/validate.js tests/smsparser.js \
       views/lib/smsparser.js \
' -- --all
```

Nice, less commits!  

```
$ git rev-list master | wc -l
     461
```

Peruse git log a bit and do a few spot checks to see if things look right.  The commit hashes have been rewritten and should only include commits where the files listed above were affected.

```
$ git log
$ git show d3b2be79
```

But if we query on all refs (branches/tags) our rev list is still large, hrm...

```
$ git rev-list --all | wc -l
    7664
```

Local repo is also still larger than expected.

```
$ du -hs .git
 41M	.git
```

How many branches and tags do we have?  Yikes, we've been busy.

```
$ git for-each-ref | wc -l
     183
```

Ok, we still have some work to do, lots of refs/tags/branches still holding on to
trees!

First order of business is to say goodbye to the origin remote, we no longer call that home.

```
git remote rm origin
rm -rf .git/refs/original/ .git/refs/remotes/ .git/*_HEAD .git/logs/
```

Now delete all related branches and tags:

```
git for-each-ref --format="%(refname)" refs/original/ refs/tags | \
  xargs -n1 git update-ref -d
```

One ferocious garbage collection incantation:

```
$ git -c gc.reflogExpire=0 -c gc.reflogExpireUnreachable=0 -c gc.rerereresolved=0 \
    -c gc.rerereunresolved=0 -c gc.pruneExpire=now gc --aggressive
```

A basic check shows no errors:

```
$ git fsck --full
Checking object directories: 100% (256/256), done.
Checking objects: 100% (2064/2064), done.
```

Look Ma, I'm all cleaned up!

```
$ git for-each-ref
dbcc2677aa56c40fbf83d72e6e413b86d3b2be79 commit refs/heads/master
$ git rev-list --all | wc -l
     461
$ du -hs .git
384K	.git
```

Maybe have a play now and make sure things look right to you.  Then publish your new repo!

```
$ git remote add origin git@github.com:medic/medic-smsparser.git
$ git push origin master
```

### Notes

Once you understand a little about git internals, have a look at `git-filter-branch` manual (see also the checklist at the bottom):

  - [git-filter-branch - Rewrite branches](https://git-scm.com/docs/git-filter-branch)

Ferocious GC

  - [How to remove unreferenced blobs from my git repo](http://stackoverflow.com/questions/1904860/how-to-remove-unreferenced-blobs-from-my-git-repo/)

Need to update the `rm -rf` command used there, the `git update-ref -d` that comes after takes care of most of that except the `refs/logs` part.  Will try next time.