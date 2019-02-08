# User Deletion

The user deletion scripts are located in the medic/script/data-deletion folder

Two key scripts in the above location can help delete different types of data:
The scripts are:

  - delete_training_data.js	
  - delete_contacts_for_place.js (With a little tweak)
  
# Deleting using delete_training_data.js
This script can be used to delete all training data from couch db. 
To run the script:
 1. add the COUCH_URL variable to your environment ```export COUCH_URL=https://admin:pass@xxx.app.medicmobile.org/medic```
 2. open the delete_training_data.js

Only uncomment one line at a time in delete_training_data.js and delete the data in the following order 
1. reports
2. persons
3. areas
4. health centres
5. district

This is because you need a `place id` to delete the reports and the persons hence they should be deleted first. Uncomment the below code one by one sequentially as listed below:
```
 // .then(_.partial(deleteReports, db, dryrun, branchId, startTimestamp, endTimestamp, logdir, batchSize))
 // .then(_.partial(deletePersons, db, dryrun, branchId, startTimestamp, endTimestamp, logdir, batchSize))
 // .then(_.partial(deleteClinics, db, dryrun, branchId, startTimestamp, endTimestamp, logdir, batchSize))
 // .then(_.partial(deleteHealthCenters, db, dryrun, branchId, startTimestamp, endTimestamp, logdir, batchSize))
 // .then(_partial(deleteBranches, db, dryrun, branchId, startTimestamp, endTimestamp, logdir, batchSize))
 ```
 3. supply the following command in the terminal and the named arguments to start deleting the data 

 ``` node delete_training_data.js <branchId> <startTime> <endTime> <logdir> <batchSize> [dryrun]```

 4. The number of records that were deleted would be shown on the terminal screen once the command runs successfully
 
# Deleting  using delete_contacts_for_place.js
This script can be used to delete different types of CouchDB data using the below tweak.
1. First export the `COUCH_URL` PATH to your environment ```export COUCH_URL=https://admin:pass@xxx.app.medicmobile.org/medic```
2. Open the design document that contains all views using CouchDB futon by clicking the following link https://xxx.app.medicmobile.org/_utils/document.html?medic/_design/medic
3. Navigate to the views field in this design document and add the `contacts_by_type` view:
```
"contacts_by_place": {
       "map": "function (doc) {\n var types = [ 'district_hospital', 'health_center', 'clinic', 'person' ]; \n var idx = types.indexOf(doc.type); \nif (idx !== -1) { \nvar place = doc.parent;\nvar order = idx + ' ' + (doc.name && doc.name.toLowerCase());\nwhile (place) {\n if (place._id) {\n  emit([ place._id ], order);\n} \nplace = place.parent; \n} \n}\n }"
   }
```
4. Now you can delete documents of  type `person`, `clinic`, `health_center`, `district_hospital`  using this command:
```node delete_contacts_for_place.js <branch_id|area_id|health_center_id|user_id>```
4. All data would be deleted depending of the type of the id that was supplied in the above command (see the output below)
![Output of deletion](img/data-deletion.png)


