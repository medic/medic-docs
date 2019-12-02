# User telemetry

_Introduced in v3.4.0_

The app collects performance data on certain user actions which is then aggregated over each calendar month and replicated to the server. This can be used to evaluate the performance of the code and configuration and to evaluate where improvements can be made.

The aggregate doc for the previous month is created when the first telemetry item is recorded each month. This is stored in the `medic-user-<username>-meta` database on the device and replicated to the server when an internet connection is available. This user specific server db is then replicated into the `medic-users-meta` database which holds all aggregate telemetry docs for all users.

The aggregate docs' IDs follow the pattern `telemetry-<year>-<month>-<username>-<uuid>`.

## Performance data

Each aggregate data point has the following fields.

| Field | Description |
|----|----|
| `sum` | A sum of all the recorded times. |
| `min` | The smallest time recorded. |
| `max` | The largest time recorded. |
| `count` | The number of times recorded. |
| `sumsqr` | The sum of squares of the times recorded. |

All times are recorded in milliseconds. The data points collected are.

| Field | Description |
|----|----|
| `boot_time` | The overall boot time including loading the code, purging, and accessing the database. |
| `boot_time:1:to_first_code_execution` | The time between the page loading and the JavaScript starting to run. |
| `boot_time:2:to_bootstrap` | The time between JavaScript starting and the bootstrapping (purging, initial replication, etc) to complete. |
| `boot_time:3:to_angular_bootstrap` | The time between bootstrapping completing and the webapp being ready to use. |
| `boot_time:4:to_db_warmed` | The time between the webapp being ready to use and the database being ready to use. |
| `enketo:reports:<form>:<action>:<component>` | The time taken to fill in Enketo forms. The `action` can either be "add" or "edit". The `component` is one of: "render" covers getting the form and rendering it on screen; "user_edit_time" is the time the user took to fill in and submit the form; or "save" is about converting the form into a report and saving it. |
| `enketo:contacts:<form>:add:<component>` | As above but for Contact creation forms. |
| `enketo:tasks:<form>:<action>:<component>` | As above but for forms on the Tasks tab. |
| `search:contacts` | The time taken to list all contacts. |
| `search:contacts:<filter[:filter]>` | The time taken to search all contacts using the given filters. |
| `search:reports` | The time taken to list all reports. |
| `search:reports:<filter[:filter]>` | The time taken to search all reports using the given filters. |
| `client-date-offset` | The difference between the client datetime and the server datetime. Only recorded if the difference is large enough that it may cause issues. |

## Metadata

When the aggregate doc is created the Telemetry service also includes a snapshot of some metadata.

| Field | Description |
|----|----|
| `year` | The year the data was collected. |
| `month` | The month the data was collected. |
| `user` | The username of the logged in user. |
| `deviceId` | A unique key for this device. |
| `versions.app` | The version of the webapp. |
| `versions.forms.<form>` | The version of each form. |
| `userAgent` | The userAgent string from the user's browser. |
| `hardwareConcurrency` | The number of cores reported from the browser. |
| `screen.width` | The width of the screen in pixels. |
| `screen.height` | The height of the screen in pixels. |
| `deviceInfo.app.version` | The version of the Android app. |
| `deviceInfo.software.androidVersion` | The version of Android OS. |
| `deviceInfo.software.osApiLevel` | The API of the Android OS. |
| `deviceInfo.software.osVersion` | The version of Android OS (detailed). |
| `deviceInfo.hardware.device` | The Android device name. |
| `deviceInfo.hardware.model` | The Android model name. |
| `deviceInfo.hardware.manufacturer` | The Android device manufacturer. |
| `deviceInfo.hardware.hardware` | The Android device hardware. |
| `deviceInfo.hardware.cpuInfo` | The Android device CPU information. |
| `deviceInfo.storage.free` | The available storage on the device. |
| `deviceInfo.storage.total` | The total storage on the device. |
| `deviceInfo.ram.free` | The available RAM on the device. |
| `deviceInfo.ram.total` | The total RAM on the device. |
| `deviceInfo.ram.threshold` | The level of RAM at which certain services will be killed by Android. |
| `deviceInfo.network.downSpeed` | The reported download speed of the network. |
| `deviceInfo.network.upSpeed` | The reported upload speed of the network. |
| `dbInfo.doc_count` | The number of docs in the local database. |
| `dbInfo.update_seq` | The update sequence of the local database. |
| `dbInfo.idb_attachment_format` | The format of database attachments. |
| `dbInfo.db_name` | The name of the local database. |
| `dbInfo.auto_compaction` | Whether or not auto compaction is set. |
| `dbInfo.adapter` | The database adapter being used. |
