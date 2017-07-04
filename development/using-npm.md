
# Using npm

## npm Orgs

We use npm Orgs to organize our npm packages.  It provides a centralized way
to manage a team's published npm packages and permissions.  Here are some
guidelines when using this service.

See [https://www.npmjs.com/docs/orgs/](https://www.npmjs.com/docs/orgs/) for more information.

Our organization is `medic` or using npm's notation, `@medic`.

We also created `@medicmobile` but it's not currently in use, it was created to
reserve the namespace.

### Adding a Package 

When you publish an npm module on npmjs.com, add it to the developers team
under the `@medic` org.

This can be done using the web interface:

  - Login to npmjs.com then Navigate to [Medic Developer's Team](https://www.npmjs.com/org/medic/team/developers)
    and add your package there.

Or command line:

  - Change your directory to where the package's `package.json` lives, then run:

  ```
  npm access grant read-write medic:developers
  ```

  - Then `npm access` should show the updated permissions for the team members.

  ```
  $ npm access ls-collaborators
  {
    "mandric": "read-write",
    "estellecomment": "read-write",
    "garethbowen": "read-write",
    "scdf": "read-write",
    "alxndrsn": "read-write",
  }
  ```
            
### Using an Org Scoped Package

A scope should be specified when a published package is a fork of an existing
package, but otherwise scope is not needed since there is no conflict with the
registry.

For example if you fork `moment` and you can't get your changes merged upstream
and need to publish a new package then modify the package name (in
package.json) to specify a organizational scope, like `@medic/moment` and publish it.

For more info see [Publishing an Org Scoped Package](https://www.npmjs.com/docs/orgs/publishing-an-org-scoped-package.html).