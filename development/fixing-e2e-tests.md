# How to fix e2e tests

End to end (e2e) tests can be really difficult to debug - sometimes they fail seemingly at random, and sometimes they only fail on certain environments (eg: ci but not locally). This can make reproducing and reliably fixing the issue challenging, so here are some tips to help!

## Read the protractor logs

Read the failure carefully - it often has really good info but sometimes it's just hard to find. Most importantly it tells you exactly the line in the test that failed and you can look that up in the source to see what protractor was trying to do. The error message itself is also really useful. Also sometimes one error causes the next, so always start with the first test failure before looking at the others.

### Known failure patterns

- Can't click on an element because another element would get the click. This usually means a modal dialog was being shown. 90% of the time this is the update notification modal which means some settings change has been detected after the test started execution.
- Stale element. This means the DOM element has been removed after protractor found it on the page but before you tried to do something with it. I generally try to get protractor to find the element just before I need it to reduce the chance of this happening.

## Other logs

The API and Sentinel logs are sometimes useful, particularly if API has crashed. These are available locally under `/tests/logs/` and for CI builds [on AWS](https://s3.console.aws.amazon.com/s3/buckets/medic-e2e/).

## Screenshots

We automatically take screenshots when a test fails and store it locally in `/tests/results/` and for CI builds [on AWS](https://s3.console.aws.amazon.com/s3/buckets/medic-e2e/). These can be particularly useful if a dialog was blocking a click.

## Running just the failing test

### Option 1

Running e2e tests can be quite slow so to save time modify the `specs` property of `/tests/base.conf.js` so it only finds your test. You can also change `describe` and `it` to `xdescribe` and `xit` to skip specific tests.

### Option 2

Alternatively you can run API in test mode using:

```
API_PORT=4988 COUCH_URL=http://admin:pass@localhost:5984/medic-test node server.js
```

Then grep for just the tests you want to run:

```
protractor /home/kenn/webapp/tests/e2e.tests.conf.js --specs='/home/kenn/webapp/tests/e2e/api/controllers/_changes.spec.js' --grep="should allow DB admins to POST to _changes"
```

### Option 3

Use the "Protractor test runner" extension for VSCode.

## Watching the test run

Running the tests locally with `grunt e2e-debug` will allow you to watch it run but if you interact with the page the test will fail in unexpected ways. Furthermore the browser will close after a short timeout so you won't be able to inspect the console or DOM. To do this, force quit the process running the test before it tears down and you will be able to navigate around the app, use Chrome dev tools, and inspect the docs in the database to (hopefully) work out what's going wrong.
