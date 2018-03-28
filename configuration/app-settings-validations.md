# App Settings Validations
Validation rules are code fragments used to determine if some input is valid. For example, to say a field is only valid if the value has at least five characters, you would use the lenMin(5). They are used in `registrations[].validations.list[].rule` and `patient_reports[].validations.list[].rule` to determine if an incoming report is accepted. A report is accepted as valid only if all rules return `true`. If any validation rule returns `false` then the report is marked as invalid, and a message is automatically sent to the submitter. The content for the message is set in the `translation_key` associated to each rule. If a report fails multiple validations then each message will be sent. These can be combined into a single SMS by specifying `"*.validations.join_responses" : true`.

## Operators
The available operators are:

| Operator | Description |
|----|----|
| && |and |
| \|\| |or |
| ! |not |
| a ? b : c | ternary, ie: if 'a' is true, then check 'b', otherwise check 'c' |
| () | nested blocks, eg: 'a && (b || c)' |

## Rules
Validation settings may consist of Pupil.js rules and rules specific to Medic Mobile.
These two types of rules cannot be combined as part of the same rule.

Not OK:
`rule: "regex(\d{5}) && unique('patient_id')"`

OK:
`rule: "regex(\d{5}) && max(11111)"`
     
If for example you want to validate that patient_id is 5 numbers and it
is unique (or some other custom validation) you need to define two
validation configs/separate rules in your settings. Example validation
settings:

```
[
	{
		property: "patient_id",
		rule: "regex(\d{5})",
		message: [{
		    content: "Patient ID must be 5 numbers.",
		    locale: "en"
	}]
	},
	{
		property: "patient_id",
		rule: "unique('patient_id')",
		message: [{
		    content: "Patient ID must be unique.",
		    locale: "en"
		}]
	}
]
```

`validate()` modifies the property value of the second item to
`patient_id_unique` so that pupil.validate() still returns a valid
result.  Then we process the result once more to extract the custom
validation results and error messages.

### Pupil.js validation functions

Available validation functions are available at https://www.npmjs.com/package/pupil#validation-functions

The following functions are available by default:

| Function | Description |
|----|----|
| `equals` |  Comparison |
| `iEquals` |  Case insensitive comparison |
| `sEquals` |  Type sensitive equals |
| `siEquals` |  Type sensitive case insensitive equals |
| `lenMin` |  Minimum length |
| `lenMax` |  Maximum length |
| `lenEquals` |  Exact length |
| `min` |  Minimum value |
| `max` |  Maximum value |
| `between` |  Minimum and maximum value |
| `in` |  One of the provided values |
| `required` |  Must have a value |
| `optional` |  Always valid |
| `numeric` |  Numbers only |
| `integer` |  Integer numbers only |
| `alpha` |  Letters only |
| `alphaNumeric` |  Numbers and letters only |
| `email` |  Email address format |
| `regex` |  A custom regular expression |
| `equalsTo` | Compare to another field by its key |

#### Sample usage

For case-insensitive comparison `iEquals` function in Pupil, 
And you can use `||` for logical OR : https://www.npmjs.com/package/pupil#rule-strings

So you can do this : 
`rule: 'iEquals("mary") || iEquals("john")'`
matches "mary", "Mary", "john", "John", "JOhN", etc. Not "maryjohn"

### Medic Mobile validation functions
| Function | Description |
|----|----|
| `unique(*fields)` | Returns `true` if no existing valid report has the same value for all of the listed fields. Fields are compared to those at the top level and within `fields` for every report doc. To include the form type use `'form'` as one of the fields. Eg `uniqueWithin('form', 'patient_id', '1 week')` checks that the same report wasn't submitted for this patient in the past week. |
| `uniqueWithin(*fields, time_period)` | Same as `unique` but the last argument is the time period in which to search. Eg `uniqueWithin('form', 'patient_id')` checks that this report was never submitted for this patient. |
| `exists(form_id, field)` | Returns `true` if a report matches the `form_id` and value for `field`. This is useful to check that a patient was registered for a service before reporting about it. Eg `exists('REG', 'patient_id')` checks that a `REG` form was already submitted for a patient. As of 2.12 most uses of this function are obsolete because checking for a valid `patient_id` is done automatically by the `accept_patient_report` transition using `registration_not_found` in the `messages.event_type`. |
