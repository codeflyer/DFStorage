var ErrorX = require('codeflyer-errorx');
var constants = require('./constants');
var _storages = {};

function getStorage(name) {
  if (_storages[name] == null) {
    throw new ErrorX(constants.ERROR_STORAGE_NOT_EXISTS, 'Storage not defined');
  }
  return _storages[name];
}

function setStorage(name, storage) {
  _storages[name] = storage;
}

function getKeyList() {
  return Object.keys(_storages);
}

function reset() {
  _storages = [];
}

module.exports = {
  getStorage: getStorage,
  setStorage: setStorage,
  getKeyList: getKeyList,
  reset: reset,
  constants: constants,
  FileFS : require('./storages/fileFs'),
  GridFS : require('./storages/GridFs')
};
