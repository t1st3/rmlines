# rmlines [![Build Status Travis](https://travis-ci.org/t1st3/rmlines.svg?branch=master)](https://travis-ci.org/t1st3/rmlines) [![Coverage Status](https://coveralls.io/repos/github/t1st3/rmlines/badge.svg?branch=master)](https://coveralls.io/github/t1st3/rmlines?branch=master)

> Streaming line remover

`rmlines` is a [Transform stream](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) that remove lines (based on line numbers) from any string.


## Install

```
$ npm install --save rmlines
```


## Usage

Suppose a file named `example.txt` containing the following:

```
abc
def
ghi
jkl
mno
```

then, `rmlines()` returns a transform stream that accepts strings and emits the string without unwanted lines (here: line 2 and line 4)

```js
const rmlines = require('rmlines');
let txt = '';

fs.createReadStream('example.txt')
  .pipe(rmlines([2, 4]))
  .on('data', function (data) {
    txt += data;
  }).on('end', function () {
    console.log((txt === 'abc\nghi\nmno\n'));
    // => true
  });
```

## Options

### maxLength

Type: `integer`

Set a buffer size limit.


## API

### rmlines(lines, [options])

#### lines

Type: `integer|array`

The number(s) of the line(s) that must be removed.

#### options

Type: `object`<br>
as described above


## License

MIT © [t1st3](https://t1st3.com)
