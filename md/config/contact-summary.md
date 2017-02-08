# Contact Summary

In the `app_settings.contact_summary` you can write a script to output fields for the contact info pane and help decide which reports should be able to be filed against a contact. The script is evaluated as JavaScript so all the standard language features are available.

There are two variables in scope that you can inspect to generate the summary information:

- `contact` which is the currently selected contact.
- `reports` which is an array of reports for the contact.

The output of your script is an object with three properties:

- `values` which is an array of fields which summarize the contact and will be shown at the top of the contact pane.
- `cards` which is an array of cards to show below the summary, each with their own header and arrays of values.
- `context` is an object which is passed to each forms `expression` to give more information to decide whether or not to allow a report of that type to be filed.

Each field is an object with four properties:

- `label` is the translation key to be used for the label.
- `value` is the value to display.
- `width` is how wide out of 12 the field should be shown.
Common filter names are listed below.
- `translate` (defaults to false) is whether or not to translate the value, eg: `{ label: "contact.sex", value: "label.male", translate: true }`
- `context` (optional) is for providing translation context for complex values.
- `filter` (optional) is the name of the display filter to apply to the value. 

Common filters are: `age`, `phone`, `weeksPregnant`, `relativeDate`, `relativeDay`, `fullDate`, `simpleDate`, `simpleDateTime`, `clinic`

## Example

```javascript
var cards = [];
var context = {};
var info = [];

if (contact.type === 'person') {
  info = [
    { label: 'patient_id', value: contact.patient_id, width: 3 },
    { label: 'contact.sex', value: contact.sex, width: 3 },
    { label: 'contact.age', value: contact.date_of_birth, width: 3, filter: 'age' },
    { label: 'Phone Number', value: contact.phone, width: 3, filter: 'phone' },
    { label: 'Notes', value: contact.notes, width: 12 },
    { label: 'contact.parent', value: contact.parent, filter: 'clinic' }
  ];
  var pregnancy;
  var pregnancyDate;
  reports.forEach(function(report) {
    if (report.form === 'pregnancy' || report.form === 'P') {
      var subsequentDeliveries = reports.filter(function(report2) {
        return report2.form === 'D' && report2.reported_date > report.reported_date;
      });
      if (subsequentDeliveries.length > 0) {
        return;
      }
      var subsequentVisits = reports.filter(function(report2) {
        return report2.form === 'V' && report2.reported_date > report.reported_date;
      });
      context.pregnant = true; // don't show Create Pregnancy Report button
      var edd = report.expected_date || report.fields.edd_8601;
      if (!pregnancy || pregnancyDate < report.reported_date) {
        pregnancyDate = report.reported_date;
        pregnancy = {
          label: 'label.pregnancy',
          values: [
            { label: 'EDD', value: edd, filter: 'relativeDay' },
            { label: 'Visits', value: 'label.visits.of', translate: true, context: { count: subsequentVisits.length, total: 4 } }
          ]
        };
      }
    }
  });
  if (pregnancy) {
    cards.push(pregnancy);
  }
} else {
  info = [
    { label: 'contact.place.id', value: contact.place_id, width: 12 },
    { label: 'Notes', value: contact.notes, width: 12 }
  ];
}

var result = {
  values: info,
  cards: cards,
  context: context
};
result; // output on the last line of the configuration
```