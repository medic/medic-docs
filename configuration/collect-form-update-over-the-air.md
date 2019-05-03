# Update Collect Forms Remotely

To do over the air Medic Collect form updates via HTTP rather than sending APKs which have a long manual install process, follow the steps below:

1. Have your xls forms ready in the folder. 
- They should use underscore as name separators. e.g form_name.xlsx
- They should have `form_id` and `name`  properties in the settings

![Name property](img/xform_name_settings.png)

2. Upload the forms to the instance using `Medic-Conf` Using the `upload-collect-forms` [action](https://github.com/medic/medic-conf/blob/master/src/cli/supported-actions.js) as shown below.
```
medic-conf --instance=user:pass@instancename.app.medicmobile.org upload-collect-forms
```
3. Go to the Collect App. Delete All forms then go to `Get Blank Form` and select all the forms you need.

# Troubleshooting

When you go to `Get Blank Forms` and instead of getting a list of the forms available, you get a pop-up error which has a portion of this message instead

```
...OpenRosa Version 1.0 standard: Forms list entry 1 is missing one or more tags: formId, name or downloadUrl
```

This means you probably uploaded a XLS file without a `name` or `form_id` property. To find out which form is missing that, use this command:

```
curl -vvvv -H "x-openrosa-version: 1" http://user:pass@host:port/api/v1/forms
```

Should bring a list like this one

![Xform List](img/xform_list.png)


Go through the list and see which form has  a missing `<name>` or `<formID>` property. Add it and reuploadthe forms using `medic-conf` again.

