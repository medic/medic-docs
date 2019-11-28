## Moving Contacts within the Hierarchy

Contacts are organized into a hierarchy. It is not straight-forward to move contacts from one position in the hierarchy to another because many copies of this hierarchy exist. Use the `move-contacts` action to assign a new parent to contacts. This command will move the specified contact, all the contacts under that contact, and all reports created by any of those contacts. This action will download all documents that need to be updated, update the lineages within those documents, and then save the updated documents on your local disk. To commit those changes to the database, run the `upload-docs` action.

**Offline users who have contacts removed from their visible hierarchy will not automatically see those contacts disappear. The contact remains on the user's device. Any updates made to the contact (or any reports created for that contact) will silently fail to sync (medic/medic/#5701). These users must be encouraged to clear cache and resync!** Also impactful, but less serious - this script can cause significant amounts of changes to the database and offline users who have contacts moved into their visible hierarchy may experience lengthy and bandwidth-intensive synchronizations.

Parameter | Description | Required
-- | -- | --
contacts | Comma delimited list of contact IDs which will be moved | Yes
parent | ID of the new parent which will be assigned to the provided contacts | Yes
docDirectoryPath | This action outputs files to local disk at this destination | No. Default `json-docs`

Some constraints when moving contacts:

* **Allowed Parents** - When moving contacts on WebApp &gt;v3.7, your chosen parent must be listed as a valid parent for the contact as defined in the [configuration for place hierarchy](https://github.com/medic/medic-docs/blob/master/configuration/app-settings.md#configuring-place-hierarchy). For WebApp &lt;v3.7, the default hierarchy is enforced.
* **Circular Hierarchy** - Nobody's parent can ever be themself or their child.
* **Primary Contacts** - Primary contacts must be a descendant of the place for which they are the primary contact. You may need to select a new primary contact for a place through the WebApp if you'd like to move a primary contact to a new place in the hierarchy.
* **Minification** - Due to contact "minification" (#2635) which was implemented in v2.13, this script should not be used for versions prior to v2.13.

### Examples
Move the contacts with the id `contact_1` and `contact_2` to have the parent `parent_id`. The changes will be in the local folder `my_folder` only for review. Run the second command to upload the changes after review.

    medic-conf --instance= move-contacts -- --contacts=contact_1,contact_2 --parent=parent_id --docDirectoryPath=my_folder
    medic-conf --local upload-docs -- --docDirectoryPath=my_folder

Move the contact with the id `contact_1` to the top of the hierarchy (no parent).

    medic-conf --local move-contacts upload-docs -- --contacts=contact_1 --parent=root
