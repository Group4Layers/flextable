# FlexTable (flextablejs)

[![JavaScript](https://img.shields.io/badge/made_in-javascript-fed93d.svg?style=flat-square)](https://developer.mozilla.org/docs/Web/JavaScript) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Group4Layers/flextable/blob/master/LICENSE.md) [![Coverage](https://img.shields.io/badge/coverage-91.57%25-green.svg)](https://github.com/Group4Layers/flextable) [![Tests](https://img.shields.io/badge/tests-39%2F39-green.svg)](https://github.com/Group4Layers/flextable)

FlexTable (flextablejs) is a JavaScript library that provides a class with a simple API to work with tables (headers, rows, columns, sort, format) facilitating the analysis and data manipulation.

Online tools: [![Build Status](https://travis-ci.org/Group4Layers/flextable.svg?branch=master)](https://travis-ci.org/Group4Layers/flextable) [![Coverage Status](https://coveralls.io/repos/github/Group4Layers/flextable/badge.svg?branch=master)](https://coveralls.io/github/Group4Layers/flextable?branch=master) [![Ebert](https://ebertapp.io/github/Group4Layers/flextable.svg)](https://ebertapp.io/github/Group4Layers/flextable) [![Inline Docs](https://inch-ci.org/github/Group4Layers/flextable.svg)](https://inch-ci.org/github/Group4Layers/flextable)

This library is commonly used with [CSV Types](https://github.com/Group4Layers/csv-types-js) to parse text files with fields delimited by a character (like CSV). FlexTable is compatible with the data structure produced by CSV Types. Every values-headers definition can be converted to a FlexTable. If the CSV file follow the types specs, multiple tables can be created from a single CSV file.

### [Repo](https://github.com/Group4Layers/flextable) &nbsp;&nbsp; [Docs](https://group4layers.github.io/flextable/) &nbsp;&nbsp; [NPM package](https://www.npmjs.com/package/flextablejs)

## Table of Contents

1. [Description](#description)
1. [Installation](#installation)
1. [Examples](#examples)
1. [TODO](#todo)
1. [Test & Coverage](#test-coverage)
1. [New features](#new-features)
1. [Author](#author)
1. [ChangeLog](#changelog)
1. [License](#license)

## Description

FlexTable (flextablejs) is a JavaScript library that provides a class with a simple API to work with tables (headers, rows, columns, sort, format) facilitating the analysis and data manipulation.

## Installation

```sh
npm i flextablejs -S
```

Or from the repo:

```sh
npm i "http://github.com/Group4Layers/flextable.git"
```

It has been tested with `node >= 6`, but it is widely used in Firefox and Chrome with building tools like `webpack`.

This library is commonly used with [CSV Types](https://github.com/Group4Layers/csv-types-js) to parse text files with fields delimited by a character (like CSV). FlexTable is compatible with the data structure produced by CSV Types. Every values-headers definition can be converted to a FlexTable. If the CSV file follow the types specs, multiple tables can be created from a single CSV file.

## Examples

The best way to learn something is to see how it behaves.

**Starting from an empty table**

```js
const FlexTable = require('flextablejs').FlexTable;
let table = new FlexTable();

table.setColumn('device type', ['CPU', 'GPU', 'FPGA']);
table.setColumn('speedup', [1, 8.43, 2.3]);

table.appendRow(['Xeon Phi', 3.5]);

// get the indices and set values manually
let idx = table.idx;
// update the Xeon Phi
table.values[3][idx['speedup']] = 3.455;

// change the header name
table.headers[idx['speedup']] = 'S(t)';
delete table.idx; // remove the indices to force update

// convert a column (rounding)
table.setColumn('S(t)', value => Number(value.toFixed(2)))

let results = table.format('markdown');
```

`console.log(results)`:

```markdown
| device type | S(t) |
|-------------|------|
| CPU         |    1 |
| GPU         |  8.4 |
| FPGA        |  2.3 |
| Xeon Phi    |  3.5 |
```

**Importing the data from a CSV with headers**

```csv
#device type,S(t)
CPU,1
GPU,8.43
FPGA,2.3
Xeon Phi,3.455
```

```js
const CSV = require('csv-types').CSV;
const FlexTable = require('flextablejs').FlexTable;

let parsed = new CSV().parse(`#device type,S(t)
CPU,1
GPU,8.43
FPGA,2.3
Xeon Phi,3.455
`);

let table = new FlexTable(parsed);

// convert a column (lower case, hyphen)
table.setColumn('device type', value => value.toLowerCase().replace(/ /g, '-'));

let results = table.format('md');
```

`console.log(results)`:

```markdown
| device type | S(t) |
|-------------|------|
| CPU         |    1 |
| GPU         |  8.4 |
| FPGA        |  2.3 |
| Xeon Phi    |  3.5 |
```

Until the README is completed and improved with real examples, we encourage you to read the source code documentation. It has examples of use: [Docs](https://group4layers.github.io/flextable/).

## TODO

- [ ] Write multiple examples showing the library.
- [ ] Perform more tests and increase the code coverage.
- [ ] Improve the documentation of the source code.
- [ ] Show real use cases.

## New features

You can request new features for this library by opening new issues. If we find it useful (or there are at least 2 users interested in a proposal) we can implement it. Also, we accept pull requests with bugfixes or new features.

## Test & Coverage

```sh
npm test
npm run coverage
```

Test covered:

```
  FlexTable
    Rows
      ✓ append rows at the end
      ✓ insert rows at the middle
      ✓ insert rows at the beginning
      ✓ remove rows at the beginning
      ✓ remove rows at the middle
      ✓ remove rows at the end
      ✓ replace rows at the beginning
      ✓ replace rows at the middle
      ✓ replace rows at the end
      ✓ remove rows by a custom function (not true leaves unchanged)
      ✓ remove rows by a custom function (true removes)
      ✓ modify rows by a custom function (null leaves unchanged)
      ✓ modify rows by a custom function (not null modifies the row)
    Columns
      ✓ setHeadersIndex
      ✓ setColumn triggers setHeadersIndex
      ✓ setColumn can remove a column that exists
      ✓ setColumn cannot remove a column that doesn't exist
      ✓ setColumns can remove columns
      ✓ setColumn can replace a column that exists
      ✓ setColumn can add a column that doesn't exist
      ✓ setColumns can replace and add columns
      ✓ setColumn can use a custom function to modify values (cast)
      ✓ setColumn can use a custom function to insert values (based on the row)
    Create
      ✓ create an empty table, append a row and insert a row
      ✓ create an empty table and append rows
      ✓ create an empty table without headers and with rows throws
      ✓ create a table with rows
    Sort
      ✓ can sort rows using mapchains and sorters (<num, skip)
      ✓ can sort rows using mapchains and sorters (>num, skip, <num)
      ✓ can sort rows using mapchains and sorters (custom funcs)
    Format
      ✓ as markdown (default fmt)
      ✓ as markdown (custom fmt)
      ✓ as markdown (by column fmt)
      ✓ as markdown (escaping)
      ✓ as csv (default fmt)
      ✓ as csv (custom fmt)
      ✓ as csv (by column fmt)
      ✓ as csv (escaping)
    clone
      ✓ supports cloning (not shared references)


  39 passing (72ms)
```

## Author

nozalr <nozalr@group4layers.com> (Group4Layers®).

## ChangeLog

*GitHub/Gitlab readers (repo, no docs): [CHANGELOG.md](CHANGELOG.md).*

## License

ExImageInfo source code is released under the MIT License.

*GitHub/Gitlab readers (repo, no docs): [LICENSE.md](LICENSE.md).*
