# Configuration Best Practices

This document covers the configuration best practices of forms, tasks, targets, and contact profiles when building your own community health app. 

<br>

## Contents
- [Forms](#forms)
- [Condition Cards](#condition-cards)
- [Targets](#targets)

<br>

## Forms

We use forms to build the **Tasks**, **Care Guides**, and **Reports** that take health workers through care protocols and provide decision support for their interactions with patients. In this context, a form is any document with questions and blank spaces or selectable options for answers. Forms can be found in many parts of your app including the **Tasks**, **People**, and **Reports** tabs


While both Tasks and Reports are built with forms, there are key differences. Tasks are blank forms that need to be completed, while Reports are forms that have already been submitted. When a Task is completed and submitted, it automatically becomes a Report. 

*Note: The icons and titles that we choose for Tasks remain the same when they become Reports.*

<br>

### Anatomy of a Task

The **Task** tab shows a list of upcoming visits, follow-ups, or other tasks that need to be done. When a Task is finished, it will automatically clear from the **Tasks** list and move to **Reports**.

Each Task has an icon on the left side which indicates which type of Task it is. The first bold line of text is the **name** of the person or family that the Task is about. The second line of text is the **title** of the Task. 

The **due date** for the Task is located in the upper right hand corner. If a Task is due today or overdue, the due date will be red. Tasks are listed in order of due date, grouped by household.

[INSERT IMAGE]

<br>


### Anatomy of a Report

The first line of bold text is the **name** of the person whom the Report is about. The second line of text is the **title** of the Report, and the third line of text is the hierarchy of **place** to which that person belongs. In the upper right corner, a **timestamp** displays when the Report was submitted. 

Reports are sorted by submission date, with the most recently submitted Reports at the top. If a Report is unread, the timestamp will be bold blue and there will be a horizontal blue line above it. 

[INSERT IMAGE]

<br>

### Form Titles

The patient’s name should not be included in the form title. 

Avoid generic words like “Visit” or “Report”. Every form can be a Report and often involves a visit, so including these words in the title doesn’t help differentiate it from other forms.

Each word in a title should be capitalized (Title Case). 

Keep form titles short and concise. Long titles will sometimes be truncated (cut off with an ellipsis) and the text at the end of the title might be lost. As a rough estimate, strive to keep titles **no longer than 40 characters** in length.


| ✅ Do this                            	| ❌ Don't do this                                           	 |
|--------------------------------------	|--------------------------------------------------------------	|
| Delivery Follow-Up                  	| Beatrice Bass Delivery Follow-Up                            	|
| Pregnancy Follow-Up                  	| Pregnancy Follow-Up Visit                                    	|
| Death Report                          | death report                                                  |
| Title Is Less Than Forty Characters 	| This Title Has Way More Than Forty Characters And Is Too Long |

The screenshots below represent some of the smallest phones our users have. On both the Tasks and Reports tabs, titles less than forty characters will fit in the space. Titles longer than about forty characters will be cut off with an ellipsis (...).

[INSERT SMALL SCREENSHOTS]

<br>

### Form Icons

The Community Health Toolkit includes a collection of [60+ free icons](https://github.com/medic/icon-library) that represent key elements of different community health workflows and protocols. Please review the recommended usages that follow. 

People and Places Hierarchies

|Icon | Usage |
|-|-|
| ![Hospital](https://github.com/medic/icon-library/blob/master/people_and_places/SVGs/hierarchies-district-hospital.svg)| Hospital or District |
| ![CHW Area](https://github.com/medic/icon-library/blob/master/people_and_places/SVGs/hierarchies-chw-area.svg) | CHW Area |
| ![Facility](https://github.com/medic/icon-library/blob/master/people_and_places/SVGs/hierarchies-health-center.svg) | Branch or Health Facility |
| ![Family](https://github.com/medic/icon-library/blob/master/people_and_places/SVGs/hierarchies-family.svg) | Family |
| ![Person](https://github.com/medic/icon-library/blob/master/people_and_places/SVGs/hierarchies-person.svg) | Person

Family Planning

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![Family Planning](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-family-planning.svg)	| - Family Planning Screening<br>- Family Planning Referral or Follow-Up 	|


ANC

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![ANC](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-people-woman-pregnant.svg) | - ANC Registration<br>- ANC Visit or Missed Visit<br>- ANCE Follow-Up 	|
| ![ANC Danger](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-ANC-danger-sign.svg) | - ANC Danger Sign<br>- ANC Danger Sign Follow-Up|


PNC

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![PNC](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-people-woman-baby.svg) | - PNC Registration<br>- PNC Visit or Missed Visit<br>- PNC Follow-Up|
| ![PNC Danger](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-PNC-danger-sign.svg) | - PNC Danger Sign<br>- PNC Danger Sign Follow-Up|


ICCM and Child Health

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![ICCM](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-people-child.svg) | - ICCM Assessment<br>- ICCM Treatment<br>- ICCM Referral or Follow-Up|
| ![ICCM Danger](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-ICCM-danger-sign.svg) | - ICCM Danger Sign<br>- ICCM Danger Sign Follow-Up|


Immunization

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![Immunization](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-healthcare-immunization.svg) | - Immunization Visit<br>- Immunization Follow-Up|


Visits

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![Visits](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-followup-general.svg) | - General Follow-Up<br>- Proactive Visit<br>- Educational Visit|


Community

| Icon 	| Usage                                         	|
|------	|-----------------------------------------------	|
| ![Community](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-community.svg) | - Community Event<br>- Community Meeting|


Misc / Various Usage

| Icon | Usage |
|-|-|
| ![Delivery](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-delivery.svg) | Delivery |
| ![Malnutrition](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-child-nutrition.svg) | Malnutrition |
| ![Growth](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-child-growth.svg) | Growth Monitoring |
| ![Cognition](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-child-cognition.svg) | Cognition |
| ![General](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-form-general.svg) | General Forms |
| ![Assessments](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-healthcare-assessment.svg) | General Assessments |
| ![Equity](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-household-equity.svg) | Equity Survey |
| ![Net](https://github.com/medic/icon-library/blob/master/forms_tasks_targets/SVGs/icon-household-bednet.svg) | Bed Net Distribution |

<br>

### Form Content and Layout

**Group Related Information** <br>
Users think in batches, and long forms can feel overwhelming. By creating logical groups the user will make sense of the form much faster.

**Reflect Input Length in Field** <br>
Employ this for fields that have a defined character count like phone numbers, zip codes, etc. Ex: Field boxes for something like zip code should be shorter than field boxes for street address.

**Don’t Put Placeholder Or Helper Text Inside The Form Fields**
People go through forms quickly and if a field looks like it already has an answer they may accidentally miss it. Research shows that empty fields draw more attention than those with placeholder text.

**Make Required Fields Very Clear** <br>
Users don’t always know what is implied by the required field marker ( * ). Instead, denoting what is optional is a preferred method, especially for forms with many required fields. If you do use asterisks, make the meaning of the symbol clear by stating “Fields with an asterisk ( * ) are mandatory.”

**Always Stack Radio Buttons And Checkboxes In A Single Vertical Column** <br>
Placing the options underneath each other allows for easy scanning and makes it less likely that a user will completely overlook one of the options.

[INSERT IMAGE]

**Don’t Use Dropdowns If There Are Less Than Seven Options** <br>
For smaller lists, use radio buttons instead of drop-down menus. Radio buttons have lower cognitive load because they make all options visible for easy comparison.

**Make Use Of Images** <br>
Where it makes sense, use images to aid in the understanding of a question

[INSERT IMAGE]

<br>

#### Form Summary Page

