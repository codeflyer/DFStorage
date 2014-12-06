var constants = require('../constants');
var path = require('path');
var fs = require('fs');
var ErrorX = require('codeflyer-errorx');
var Promise = require('bluebird');

var fsUtils = require('../utils/fs');

function FileFsStorage(options) {
  if (options == null) {
    throw new ErrorX(constants.ERROR_INIT_OPTIONS_NOT_DEFINED,
        'Options not defined');
  }
  if (options.path == null) {
    throw new ErrorX(constants.ERROR_STORAGE_PARAM_NOT_VALID,
        'Save path not defined connection not valid');
  }
  this.path = options.path;
  this.deep = options.deep || 3;
  this.contentType =
      options.contentType || constants.DEFAULT_CONTENT_TYPE;
}

FileFsStorage.prototype._getRelativePath = function(UID) {
  var pathToken = [];
  for (var i = 0; i < this.deep; i++) {
    pathToken.push(UID.substring(i, i + 1));
  }
  return pathToken.join('/');
};

FileFsStorage.prototype.save = function(originalPath, UID, options) {
  options = options || {};
  var metadata = options.metadata || {};
  var contentType = options.contentType || this.contentType;
  var that = this;

  var relativePath = this._getRelativePath(UID);
  var absolutePath = path.join(that.path, relativePath);
  var fileAbsolutePath = path.join(that.path, relativePath, UID);

  return new Promise(function(resolve, reject) {
    fsUtils.exists(absolutePath).then(
        function(exists) {
          if (!exists) {
            return fsUtils.mkdir(absolutePath);
          }
          return Promise.resolve();
        }
    ).then(
        function() {
          return [
            fsUtils.unlink(fileAbsolutePath, true),
            fsUtils.unlink(fileAbsolutePath + '.json', true)];
        }
    ).spread(function() {
          return fsUtils.copyFile(originalPath, fileAbsolutePath);
        }
    ).then(function(result) {
          return fsUtils.stats(fileAbsolutePath);
        }
    ).then(function(stats) {
          var data = {
            contentType: contentType,
            length: stats.size,
            uploadDate: new Date(),
            filename: UID,
            metadata: metadata
          };
          return fsUtils.writeJson(fileAbsolutePath + '.json', data);
        }
    ).then(function(data) {
          resolve(data);
        }
    ).catch(function(err) {
          console.log(err);
          return reject(err);
        }
    );
  });
};

FileFsStorage.prototype.sendToResponse = function(UID, response) {
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

FileFsStorage.prototype.load = function(UID, outputStream) {
  var that = this;
  var relativePath = this._getRelativePath(UID);
  var fileAbsolutePath = path.join(that.path, relativePath, UID);
  var readstream = fs.createReadStream(fileAbsolutePath);
  readstream.pipe(outputStream);
};

FileFsStorage.prototype.remove = function(UID) {
  var fileAbsolutePath = path.join(this.path, this._getRelativePath(UID), UID);
  return new Promise(function(resolve, reject) {
        Promise.all([
          fsUtils.unlink(fileAbsolutePath, true),
          fsUtils.unlink(fileAbsolutePath + '.json', true)]).spread(
            function() {
              resolve();
            }
        ).catch(function(err) {
              reject(new ErrorX(
                  constants.ERROR_PERSISTENCE_ERROR, 'File systen Error', err));
            });
      }
  );
};

FileFsStorage.prototype.loadMeta = function(UID) {
  var fileAbsolutePath = path.join(this.path, this._getRelativePath(UID), UID);
  return new Promise(function(resolve, reject) {
    fsUtils.readJson(fileAbsolutePath + '.json').then(
        function(data) {
          resolve(data);
        }
    ).catch(function(err) {
          if (err.errno === 34) {
            return resolve();
          }
          reject(err);
        });
  });
};

FileFsStorage.prototype.exists = function(UID) {
  var fileAbsolutePath = path.join(this.path, this._getRelativePath(UID), UID);
  return new Promise(function(resolve, reject) {
    fsUtils.exists(fileAbsolutePath).then(
        function(exists) {
          return resolve(exists);
        }
    ).catch(function(err) {
          reject(err);
        }
    );
  });
};

module.exports = FileFsStorage;
