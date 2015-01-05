var constants = require('../constants');
var mongo = require('mongodb');
var fs = require('fs');
var Grid = require('gridfs-stream');
var ErrorX = require('codeflyer-errorx');
var Promise = require('bluebird');

//// create or use an existing mongodb-native db instance
//var gfs = Grid(db, mongo);
//
//// streaming to gridfs
//var writestream = gfs.createWriteStream({
//  filename: 'my_file.txt'
//});
//fs.createReadStream('/some/path').pipe(writestream);
//
//// streaming from gridfs
//var readstream = gfs.createReadStream({
//  filename: 'my_file.txt'
//});
//
////error handling, e.g. file does not exist
//readstream.on('error', function(err) {
//  console.log('An error occurred!', err);
//  throw err;
//});
//
//readstream.pipe(response);

function GridFsStorage(options) {
  if (options == null) {
    throw new ErrorX(constants.ERROR_INIT_OPTIONS_NOT_DEFINED,
        'Options not defined');
  }
  if (options.db == null) {
    throw new ErrorX(constants.ERROR_STORAGE_PARAM_NOT_VALID,
        'MongoDb connection not valid');
  }
  this.db = options.db;
  this.collectionRoot =
      options.collectionRoot || constants.DEFAULT_COLLECTION_ROOT;
  this.chunkSize =
      options.chunkSize || constants.DEFAULT_CHUNK_SIZE;
  this.contentType =
      options.contentType || constants.DEFAULT_CONTENT_TYPE;

  this._gfs = new Grid(this.db, mongo);
}

GridFsStorage.prototype.save = function(originalPath, UID, options) {
  options = options || {};
  var metadata = options.metadata || {};
  var chunkSize = options.chunkSize || this.chunkSize;
  var contentType = options.contentType || this.contentType;
  var that = this;
  return new Promise(function(resolve, reject) {
    var writestream = that._gfs.createWriteStream({
      _id: UID,
      filename: UID,
      mode: 'w',
      chunkSize: chunkSize,
      'content_type': contentType,
      root: that.collectionRoot,
      metadata: metadata
    });
    fs.createReadStream(originalPath).pipe(writestream);

    writestream.on('close', function(data) {
      resolve(data);
    });

    writestream.on('error', function(error) {
      reject(error);
    });
  });
};

GridFsStorage.prototype.sendToResponse = function(UID, response) {
  var that = this;
  that.loadMeta(UID).then(
      function(meta) {
        response.writeHead(200, {'Content-Type': meta.contentType});
        response.contentLength = meta.length;
        that.load(UID, response);
      }
  ).catch(function(err) {
        response.end(404);
      });
};

GridFsStorage.prototype.sendToFile = function(UID, absolutePath) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.loadMeta(UID).then(
        function(meta) {
          var wstream = fs.createWriteStream(absolutePath);
          wstream.on('finish', function() {
            resolve(absolutePath);
          });
          wstream.on('error', function(err) {
            reject(err);
          });
          that.load(UID, wstream);
        }
    ).catch(function(err) {
          reject(err);
        });
  });
};

GridFsStorage.prototype.load = function(UID, outputStream) {
  var that = this;
  var readstream = that._gfs.createReadStream({
    filename: UID,
    root: that.collectionRoot
  });
  readstream.pipe(outputStream);
};

GridFsStorage.prototype.remove = function(UID) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that._gfs.remove({
      filename: UID,
      root: that.collectionRoot
    }, function(err, result) {
      if (err) {
        return reject(
            new ErrorX(
                constants.ERROR_PERSISTENCE_ERROR, 'Mongodb Error', err)
        );
      }
      resolve(result);
    });
  });
};

GridFsStorage.prototype.loadMeta = function(UID) {
  var that = this;
  return new Promise(function(resolve, reject) {
    var collection = that.db.collection(that.collectionRoot + '.files');
    collection.findOne({'_id': UID}, function(err, doc) {
      if (err) {
        return reject(
            new ErrorX(
                constants.ERROR_PERSISTENCE_ERROR, 'Mongodb Error', err)
        );
      }
      resolve(doc);
    });
  });
};

GridFsStorage.prototype.exists = function(UID) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that._gfs.exist(
        {'filename': UID, 'root': that.collectionRoot}, function(err, found) {
          if (err) {
            return reject(
                new ErrorX(
                    constants.ERROR_PERSISTENCE_ERROR, 'Mongodb Error', err)
            );
          }
          resolve(found);
        });
  });
};

module.exports = GridFsStorage;
