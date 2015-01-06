var Promise = require('bluebird');
var fs = require('fs');
var nodeFs = require('node-fs');

function unlink(path, continueIfNotExists) {
  return new Promise(function(resolve, reject) {
    fs.unlink(path, function(err) {
      if (err) {
        if (err.errno && continueIfNotExists) {
          return resolve();
        }
        reject(err);
      }
      resolve();
    });
  });
}

function exists(itemPath) {
  return new Promise(function(resolve, reject) {
    try {
      fs.exists(itemPath, function(exists) {
        resolve(exists);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function mkdir(itemPath, mode) {
  if (mode == null) {
    mode = '0755';
  }
  return new Promise(function(resolve, reject) {
    nodeFs.mkdir(itemPath, mode, true, function(err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  return new Promise(function(resolve, reject) {
    var rd = fs.createReadStream(source);
    rd.on('error', function(err) {
      done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on('error', function(err) {
      done(err);
    });
    wr.on('close', function(ex) {
      done();
    });
    rd.pipe(wr);

    function done(err) {
      if (err) {
        return reject(err);
      }
      if (!cbCalled) {
        cbCalled = true;
        resolve();
      }
    }
  });
}

function stats(path) {
  return new Promise(function(resolve, reject) {
    fs.stat(path, function(err, stats) {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
}

function writeJson(fileName, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function readJson(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, 'utf8', function(err, data) {
      if (err) {
        return reject(err);
      }
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}

function writeFromStream(buffer, filename) {
  return new Promise(function(resolve, reject) {
    var fs = require('fs');
    var wstream = fs.createWriteStream(filename);
    wstream.write(buffer);
    wstream.on('finish', function() {
      resolve();
    });
    wstream.on('error', function(err) {
      reject(err);
    });
  });
}

function _removeRecursive(itemPath, cb) {
  fs.stat(itemPath, function(err, stats) {
    if (err) {
      cb(err, stats);
      return;
    }
    if (stats.isFile()) {
      fs.unlink(itemPath, function(err) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, true);
        }
        return;
      });
    } else if (stats.isDirectory()) {
      // A folder may contain files
      // We need to delete the files first
      // When all are deleted we could delete the
      // dir itself
      fs.readdir(itemPath, function(err, files) {
        if (err) {
          cb(err, null);
          return;
        }
        var fileLength = files.length;
        var fileDeleteIndex = 0;

        var checkStatus = function() {
          // We check the status
          // and count till we r done
          if (fileLength === fileDeleteIndex) {
            fs.rmdir(itemPath, function(err) {
              if (err) {
                cb(err, null);
              } else {
                cb(null, true);
              }
            });
            return true;
          }
          return false;
        };
        /*jslint loopfunc: true */
        if (!checkStatus()) {
          for (var i = 0; i < fileLength; i++) {
            (function() {
              var filePath = itemPath + '/' + files[i];
              _removeRecursive(filePath,
                  function removeRecursiveCB(err, status) {
                    if (!err) {
                      fileDeleteIndex++;
                      checkStatus();
                    } else {
                      cb(err, null);
                      return;
                    }
                  });
            })();
          }
        }
      });
    }
  });
}

function rmdir(itemPath) {
  return new Promise(function(resolve, reject) {
    _removeRecursive(itemPath, function(err) {
      if (err) {
        if (err.errno === 34) {
          return resolve();
        }
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  copyFile: copyFile,
  unlink: unlink,
  exists: exists,
  mkdir: mkdir,
  rmdir: rmdir,
  stats: stats,
  readJson: readJson,
  writeJson: writeJson,
  writeFromStream: writeFromStream
};
