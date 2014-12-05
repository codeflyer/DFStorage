var storages = require('../lib/index');
var constants = require('../lib/constants');

describe('Accessors test', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function() {
    storages.reset();
  });

  it('Get Not existent Storage', function() {
    try {
      storages.getStorage('my-storage');
      throw 'Should trown an error';
    } catch (e) {
      e.getCode().should.be.equal(constants.ERROR_STORAGE_NOT_EXISTS);
    }
  });

  it('Set storage and get a differnt one', function() {
    try {
      storages.setStorage('my-storage', 'somestorage');
      storages.getStorage('my-storage2');
      throw 'Should trown an error';
    } catch (e) {
      e.getCode().should.be.equal(constants.ERROR_STORAGE_NOT_EXISTS);
    }
  });

  it('Set storage and get it', function() {
    storages.setStorage('my-storage', 'somestorage');
    var myStorage = storages.getStorage('my-storage');
    myStorage.should.be.equal('somestorage');
  });
});
