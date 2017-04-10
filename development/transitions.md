# Transitions API

A transition is javascript code that runs when a document is changed.  A
transition can edit the changed doc or do anything server side code can do for
that matter.

Transitions are run in series, not in parallel:

* For a given change, you can expect one transition to be finished before the
  next runs.

* You can expected one change to be fully processed by all transitions before
  the next starts being processed.

Transitions obey the following rules:

* has a `filter(doc)` function that accepts the changed document as an argument and
  returns `true` if it needs to run/be applied.

* a `onMatch(change, db, auditDb, callback)` function than will run on changes
  that pass the filter.

* has an `onChange(change, db, audit, callback)` function that makes changes to
  the `change.doc` reference (copying is discouraged). `db` and `audit` are
  handles to let you query those DBs. More about `callback` below.

* If they save the document provided at `change.doc` it takes responsibility for saving the document and re-attaching the newly saved document (with new seq etc) at `change.doc`
  
* guarantees the consistency of a document. 

* runs serially and in any order.  A transition is free to make async calls but
  the next transition will only run after the previous transitions's callback
  is called. If your transition is dependent on another transition then it will
  run on the next change.  Code your transition to support two changes rather
  than require a specific ordering.  You can optimize your ordering but don't
  require it.  This keeps configuration simpler.

* is repeatable, it can run multiple times on the same document without
  negative effect.  You can use the `transitions` property on a document to
  determine if a transition has run.


Callback arguments:

* callback(err, true)

  The document is saved and `ok` property value is false if `err` is truthy.

* callback(err)

  The document is saved and `ok` property value is false if `err` is truthy.
  Use this when a transition fails and should be re-run.

* callback()

  Nothing to be done, the document is not saved and next transition continues.
  Transitions will run again on next change.
