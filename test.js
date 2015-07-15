var tape = require('tape')
var store = require('./')
var os = require('os')
var rimraf = require('rimraf')
var path = require('path')
var concat = require('concat-stream')
var fs = require('fs')

function create () {
  var tmp = path.join(os.tmpdir(), 'dat-blob-store-' + Date.now() + '-' + process.pid)
  rimraf.sync(tmp)
  return store(tmp)
}

tape('write + read', function (t) {
  var blobs = create()
  var ws = blobs.createWriteStream('test.txt')

  ws.write('helloworld')
  ws.end(function () {
    t.ok(true, 'write succeded')
    var rs = blobs.createReadStream(ws.key)
    rs.pipe(concat(function (data) {
      t.same(data.toString(), 'helloworld', 'same data')
      t.end()
    }))
  })
})

tape('local copy', function (t) {
  var blobs = create()
  var ws = blobs.createWriteStream('test.txt')

  ws.write('helloworld')
  ws.end(function () {
    t.ok(true, 'write succeded')
    var rs = fs.createReadStream(path.join(blobs.dir, 'test.txt'))
    rs.pipe(concat(function (data) {
      t.same(data.toString(), 'helloworld', 'same data')
      t.end()
    }))
  })
})

tape('exists', function (t) {
  var blobs = create()
  var ws = blobs.createWriteStream('test.txt')

  ws.write('helloworld')
  ws.end(function () {
    t.ok(true, 'write succeded')
    blobs.exists(ws.key, function (err, yes) {
      t.error(err, 'no error')
      t.ok(yes, 'should exist')
      t.end()
    })
  })
})
