# Tasks

Tasks are used in the app to help CHWs plan their activities by reminding them about forms they need to complete on behalf of their patients. They are essentially the Medic app's version of SMS reminders - instead of receiving an SMS reminder, the app generates a task for the CHW to complete. When a CHW clicks on a tasks from the Tasks tab or from a contact profile, they will be taken to the designated form that they need to fill in order to complete the task.

Tasks can be viewed in a few places in the Medic app. Tasks for a particular patient can be viewed on the patient's profile, tasks for a family/household as well as the family members can be viewed on the family/household profile, and all tasks for all patients and families can be viewed on the tasks tab. Tasks are listed in order of due date. Tasks that are past due will appear at the top of the list and tasks due in the future will appear at the end of the list. If a task is high priority (more on this in the next two sections) it will come first within the subset of tasks that are due on its due date. So if you have three tasks due on Thursday and one of them is high priority, the high priority task will be the first in the list of tasks due on Thursday.

Tasks can be configured for any user that has offline access (user type is "restricted to their place"). When configuring tasks, you have access to all the contacts (people and places) that your logged in user can view, along with all the reports about them. Tasks can also pull in fields from the reports that trigger them and pass these fields in as inputs to the form that opens when you click on the task. So, for example, if you register a pregnancy and include the LMP, this generates follow-up tasks for ANC visits. When you click on an ANC visit task, it will open the ANC visit form and this form could "know" the LMP of the woman. More on how to configure this later in this document.

## Types of Tasks

The main two types of tasks we have are normal tasks and high priority tasks.

### Normal Task

A normal task has an icon, a title and a due date.

![Normal task](img/normal_task.png)

### High Priority Task

A high priority task has an icon, a title, and a due date, just like a normal task. In addition, it has the high risk icon and a descriptive message on the second line.

![High priority task](img/high_priority_task.png)

### Task Summary Screen

When a user clicks on a task in the task list, the app can either take them to the task summary screen...

![Task summary screen](img/task_summary_screen.png)

...or directly to the action (form) they need to complete.

![Task form](img/task_form.png)

## Using Tasks

As you'll see in the `task-rules.js` files for existing projects, in order to make tasks work, you have to first create the task and then emit the task. There are functions for both of these steps already written. You can also create custom task creation functions if it is useful.

### Creating a Task

```javascript
var createTask = function(contact, schedule, report) {
  return new Task({
    _id: contact.contact._id + '-' + schedule.id,
    deleted: (contact.contact ? contact.contact.deleted : false) || (report ? report.deleted : false),
    doc: contact,
    contact: contact.contact,
    icon: schedule.icon,
    priority: schedule.description ? 'high' : null,
    priorityLabel: schedule.description ? schedule.description : '',
    date: null,
    title: schedule.title,
    fields: [],
    resolved: false,
    actions: []
  });
};
```

### Emitting a Task

```javascript
var emitTask = function(task, scheduleEvent) {
  if (Utils.isTimely(task.date, scheduleEvent)) {
    emit('task', task);
  }
};
```

## Task Properties

When creating a task, you are required to pass in a contact, a schedule and a report (see above function). Tasks have many properties:

* `_id`: By default, the `_id` is set to [contact ID]-[schedule ID]. [contact ID] is the `_id` of the contact that you passed in. [schedule ID] is the `id` of the particular task that you indicated in your `task-schedules.json` file.
* `deleted`: Set based on whether the report that generated the task is deleted.
* `doc`: Set to the contact you passed in and includes their contact info and an array of the reports about that contact
* `contact`: Set to the contact you passed in. Has contact information only.
* `icon`: Set to the `icon` specified for the task in `task-schedules.json`.
* `priority`: Set to high priority if there is a description for the task in `task-schedules.json`. High priority means that the task has the high risk icon on the right hand side.
* `priorityLabel`: Set to the `description` listed in `task-schedules.json` for the task if there is a description.
* `date`: This is the due date of the task. It is left null during task creation and set later.
* `title`: Set to the `title` that you indicated in your `task-schedules.json` file. The title is the text that appears in the UI on the task.
* `fields`: Fields are pieces of data that display on the task summary screen. List a label and value for each field you want to display on the summary screen.
* `resolved`: This tracks whether or not the task has been completed. It is set to false initially and then updated to a condition later.
* `actions`: This is an array of the actions (forms) that a user can access after clicking on a task. If you put multiple forms here, then the user will see a task summary screen where they can select which action they would like to complete.

## Configuring Tasks

Tasks are configured in two places: `task-rules.js` and `task-schedules.json`. `task-rules.js` is where you define which form submissions trigger tasks and set the rules for creation and emission of tasks, including which types of users will see which tasks. This is also where you can pull information from the form that triggers the task schedule and pass it to the form that the user needs to fill to complete the tasks. More information on this is below. 

`task-schedules.json` is where you define all of the different tasks in each of your task schedules. You set the due date and task window, the icon and the task title.

### `task-schedules.json`

Each task needs a due date, window, icon and title to be defined so that the app knows how to render it. The diagram below explains where each of the properties will appear. You will need to include the properties listed after the diagram for each of your task schedules.

![Task description](img/task_with_description.png)

* `name`: This is the name of the task schedule. This is just a reference for the configurer to know which schedule they are looking at.
* `events`: These are the individual tasks in the schedule. You may have one or more tasks in your schedule.

For each event, you need to include the following:

* `events.id`: This is an `id` you define for each of your tasks.
* `events.days`: Due date for the task. It is the number of days after the schedule start date that a task is due.
* `events.start`: The number of days before the task due date that the task should appear in the task list.
* `events.end`: The number of days after the task due date that the task should continue to appear in the task list.
* `events.icon`: You can use any icon that you like, but make sure the icon has been uploaded to your instance and the name matches.
* `events.title`: The name of your task that will appear to the user. This field supports locales, so you can include translations if you have users viewing the app in different languages on the same instance.
* `events.description`: This is optional. It is a second line of text that can appear at the right side of the task on the tasks list.

