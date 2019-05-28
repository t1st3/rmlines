# rmlines [![Build Status Travis](https://travis-ci.org/t1st3/rmlines.svg?branch=master)](https://travis-ci.org/t1st3/rmlines) [![codecov](https://codecov.io/gh/t1st3/rmlines/badge.svg?branch=master)](https://codecov.io/gh/t1st3/rmlines?branch=master)

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


## Related

* [rmlines-cli](https://github.com/t1st3/rmlines-cli) | CLI for rmlines
* [gulp-rmlines](https://github.com/t1st3/gulp-rmlines) | rmlines as a [`gulp`](http://gulpjs.com/) plugin
* [grunt-rmlines](https://github.com/t1st3/grunt-rmlines) | rmlines as a [`Grunt`](http://gruntjs.com/) plugin


## License

MIT © [t1st3](https://t1st3.com)
