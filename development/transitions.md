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

* It is not necessary for an individual transition to save the changes to `change.doc` to the db: the doc will be saved once, after all the transitions have edited it.
If an individual transition saves the document provided at `change.doc`, it takes responsibility re-attaching the newly saved document (with new seq etc) at `change.doc`
  
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

* callback(err, needsSaving)
  
   `needsSaving` is true if the `change.doc` needs to be saved to db by the transition runner. For instance the transition has edited the `change.doc` in memory.    
   `err` if truthy, the error will be added to the `changes.doc` in memory. (Note that if `needsSaving` is falsy, the doc will not be saved, so that error will not be persisted).

Regardless whether the doc is saved or not, the transitions will all be run (unless one crashes!). 

Ways to error : 
- crash sentinel. When sentinel restarts, since that `change` did not record a successful processing, it will be reprocessed. Transitions that did not save anything to the `change.doc` will be rerun.
- save an error to `change.doc` (`callback(someTruthyError, true)`): the transition exits cleanly with error, the error is saved to `change.doc`. The transition will not be rerun on this doc.
- log an error but don't save it to doc (`callback(truthyOrFalsy, false)`): there is no record on the `change.doc` that this transition ran. That particular `change` will not go through transitions again, but if the same doc has another change in the future, since there is no record of the erroring transition having run, it will be rerun.
