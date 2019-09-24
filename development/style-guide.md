This is a guide, not a law - use your discretion. Mostly based on [Felix Geisendörfer's](https://github.com/felixge/node-style-guide) guide with our own tweaks.

## Indention

Use 2 spaces for indenting your code and swear an oath to never mix tabs and
spaces - a special kind of hell is awaiting you otherwise.

## Newlines

Use UNIX-style newlines (`\n`), and a newline character as the last character
of a file. Windows-style newlines (`\r\n`) are forbidden inside any repository.

## No trailing whitespace

Just like you brush your teeth after every meal, you clean up any trailing
whitespace in your JS files before committing. Otherwise the rotten smell of
careless neglect will eventually drive away contributors and/or co-workers.

## Use Semicolons

According to [scientific research][hnsemicolons], the usage of semicolons is
a core value of our community. Consider the points of [the opposition][], but
be a traditionalist when it comes to abusing error correction mechanisms for
cheap syntactic pleasures.

[the opposition]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[hnsemicolons]: http://news.ycombinator.com/item?id=1547647

## Use single quotes

Use single quotes, unless you are writing JSON.

*Right:*

```js
const foo = 'bar';
```

*Wrong:*

```js
const foo = "bar";
```

## Opening braces go on the same line

Your opening braces go on the same line as the statement, with whitespace before and after the condition, followed by a new line.

*Right:*

```js
if (true) {
  console.log('winning');
}
```

*Wrong:*

```js
if (true)
{
  console.log('losing');
}

if (true) { console.log('losing'); }

if(true){
  console.log('winning');
}
```

## Method chaining

One method per line should be used if you want to chain methods.

You should also indent these methods so it's easier to tell they are part of the same chain.

*Right:*

```js
User
  .findOne({ name: 'foo' })
  .populate('bar')
  .exec(() => true);
````

*Wrong:*

```js
User
.findOne({ name: 'foo' })
.populate('bar')
.exec(() => true);

User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(() => true);

User.findOne({ name: 'foo' }).populate('bar')
.exec(() => true);

User.findOne({ name: 'foo' }).populate('bar')
  .exec(() => true);
````

## Use lowerCamelCase for variables, properties, and function names

Variables, properties and function names should use `lowerCamelCase`.  They
should also be descriptive. Single character variables and uncommon
abbreviations should generally be avoided.

*Right:*

```js
const adminUser = db.query();
```

*Wrong:*

```js
const admin_user = db.query();
```

## Use UpperCamelCase for class names

Class names should be capitalized using `UpperCamelCase`.

*Right:*

```js
function BankAccount() {
}
```

*Wrong:*

```js
function bank_Account() {
}
```

## Use `const` and `let`

There is no longer a good reason to use `var`. Use `const` whenever you can,
and `let` when you must. Hardcoded constants should be named in all UPPERCASE.

*Right:*

```js
const DELAY = 10 * 1000; // ten seconds
const output = input * 10;
let temp = 50;
let unknown;
```

*Wrong:*

```js
var DELAY = 10 * 1000;
```

## Use arrow functions

Use arrow functions as much as possible for cleaner code and better scoping. Omit the
return keyword when the entire function definition fits on one line. Omit the parens
when taking a single parameter.


*Right:*

```js
let result = '';

const append = a => {
  result += a;
};

const combine = (a, b) => {
  result = a + b;
};

const getResult = () => result;
```

*Wrong:*

```js
let result = '';

const append = (a) => {
  result += a;
};

const combine = function(a, b) {
  result = a + b;
};

const getResult = () =>
  result;
```

## Object / Array creation

Put short declarations on a single line. For long declarations put a line
break after each comma.

*Right:*

```js
const a = ['hello', 'world'];
const b = {
  good: 'code',
  'is generally': 'pretty',
};
```

*Wrong:*

```js
const a = [
  'hello', 'world'
];
const b = {"good": 'code'
        , is generally: 'pretty'
        };
const c = ['one', 'two',
           'three', 'four'];
```

## Use the === operator

Programming is not about remembering [stupid rules][comparisonoperators]. Use
the triple equality operator as it will work just as expected.

*Right:*

```js
if (a !== '') {
  console.log('winning');
}

```

*Wrong:*

```js
if (a == '') {
  console.log('losing');
}
```

[comparisonoperators]: https://developer.mozilla.org/en/JavaScript/Reference/Operators/Comparison_Operators

## Do not extend built-in prototypes

Do not extend the prototype of native JavaScript objects. Your future self will be forever grateful.

*Right:*

```js
const a = [];
if (!a.length) {
  console.log('winning');
}
```

*Wrong:*

```js
Array.prototype.empty = function() {
  return !this.length;
}

const a = [];
if (a.empty()) {
  console.log('losing');
}
```

## Use descriptive conditions

Any non-trivial conditions should be assigned to a descriptively named variable or function:

*Right:*

```js
const isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);

if (isValidPassword) {
  console.log('winning');
}
```

*Wrong:*

```js
if (password.length >= 4 && /^(?=.*\d).{4,}$/.test(password)) {
  console.log('losing');
}
```

## Write small functions

Keep your functions short. A good function fits on a slide that the people in
the last row of a big room can comfortably read. So don't count on them having
perfect vision and limit yourself to ~15 lines of code per function.

## Return early from functions

To avoid deep nesting of if-statements, always return a function's value as early
as possible.

*Right:*

```js
function isPercentage(val) {
  if (val < 0) {
    return false;
  }

  if (val > 100) {
    return false;
  }

  return true;
}
```

*Wrong:*

```js
function isPercentage(val) {
  if (val >= 0) {
    if (val < 100) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

Or for this particular example it may also be fine to shorten things even
further:

```js
function isPercentage(val) {
  var isInRange = (val >= 0 && val <= 100);
  return isInRange;
}
```

## Adding documentation comments

To add documentation comments that will be built using jsdocs, use
[jsdoc block tags](https://jsdoc.app/). For angular code use the
[angular tags](https://www.npmjs.com/package/angular-jsdoc#tags-available), see
[examples](https://www.npmjs.com/package/angular-jsdoc#example).

Try to write comments that explain higher level mechanisms or clarify
difficult segments of your code. Don't use comments to restate trivial
things.

*Right:*

```js
/**
 * 'ID_SOMETHING=VALUE' -> ['ID_SOMETHING=VALUE', 'SOMETHING', 'VALUE']
 * @type {boolean}
 */
const matches = item.match(/ID_([^\n]+)=([^\n]+)/));

/**
 * Loads a user. This function has a nasty side effect where a failure to increment a
 * redis counter used for statistics will cause an exception. This needs
 * to be fixed in a later iteration.
 * @param {string} id the user id
 * @param {function} cb a callback function that applied to the user
 */
function loadUser(id, cb) {
  ...
}
```

*Wrong:*

```js
/**
 * Execute a regex
 */
const matches = item.match(/ID_([^\n]+)=([^\n]+)/);

/**
 * Usage: loadUser(5, function() { ... })
 */
function loadUser(id, cb) {
  ...
}

/**
 * Check if the session is valid
 */
const isSessionValid = (session.expires < Date.now());
/** If the session is valid */
if (isSessionValid) {
  ...
}
```

## Object.freeze, Object.preventExtensions, Object.seal, with, eval

Crazy stuff that you will probably never need. Stay away from it.

## Getters and setters

Do not use setters, they cause more problems for people who try to use your
software than they can solve.

Feel free to use getters that are free from [side effects][sideeffect], like
providing a length property for a collection class.

[sideeffect]: http://en.wikipedia.org/wiki/Side_effect_(computer_science)


