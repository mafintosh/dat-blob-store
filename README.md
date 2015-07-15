# dat-blob-store

The blob store [dat](https://github.com/maxogden/dat) uses per default

```
npm install dat-blob-store
```

## Usage

``` js
var store = require('dat-blob-store')
var blobs = store('./some-folder')

var ws = blobs.createWriteStream('test.txt')

ws.write('hello world\n')
ws.end(function () {
  console.log(ws.key) // use this key (a hash) to read out the blob
})
```

The blob store will store two copies of the file written. One in `test.txt` and one
content-addressed in `.dat/blobs`.

## License

MIT
