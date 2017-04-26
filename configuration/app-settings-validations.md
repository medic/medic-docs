### App Settings Validations

From https://github.com/medic/medic-sentinel/blob/a44dba9705a7ed7928adfafa4101184edc297c08/lib/validation.js#L128

Validation settings may consist of Pupil.js rules and custom rules.
These cannot be combined as part of the same rule.
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

#### Validation functions

The following functions are available by default:

```
equals
iEquals      # A case-insensitive comparison
sEquals      # A strict comparison
siEquals
lenMin
lenMax
lenEquals
min
max
between
in           # Compare to a list of values
required
optional
numeric
alpha
alphaNumeric
email
regex        # Supply a custom regex
integer
equalsTo     # Compare to another field by its key
```

#### Sample usage

For case-insensitive comparison `iEquals` function in Pupil, 
And you can use `||` for logical OR : https://www.npmjs.com/package/pupil#rule-strings

So you can do this : 
`rule: 'iEquals("mary") || iEquals("john")'`
matches "mary", "Mary", "john", "John", "JOhN", etc. Not "maryjohn"