var cabs = require('content-addressable-blob-store')
var blobs = require('fs-blob-store')
var multi = require('multi-write-stream')
var path = require('path')

module.exports = BlobStore

function BlobStore (dir) {
  if (!(this instanceof BlobStore)) return new BlobStore(dir)
  this.dir = dir
  this.cabs = cabs(path.join(dir, '.dat', 'blobs'))
  this.local = blobs(dir)
}

BlobStore.prototype.createWriteStream = function (opts, cb) {
  var localStream = this.local.createWriteStream(opts)
  var cabsStream = this.cabs.createWriteStream(opts)

  var stream = multi([localStream, cabsStream])

  if (cb) stream.on('error', cb)
  stream.on('finish', function () {
    stream.key = cabsStream.key
    stream.size = cabsStream.size
    if (cb) cb(null, stream)
  })

  return stream
}

BlobStore.prototype.createReadStream = function (opts) {
  return this.cabs.createReadStream(opts)
}

BlobStore.prototype.exists = function (opts, cb) {
  this.cabs.exists(opts, cb)
}

BlobStore.prototype.remove = function (opts, cb) { // for now only remove from local store
  this.local.remove(opts, cb)
}
