var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');
var constants = require('../../lib/constants');

describe('GridFs constructor', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  it('Initialize without options', function() {
    try {
      new GridFsStorage();
      throw 'Should trown an error';
    } catch (e) {
      e.getCode().should.be.equal(constants.ERROR_INIT_OPTIONS_NOT_DEFINED);
    }
  });

  it('Initialize without db', function() {
    try {
      new GridFsStorage({});
      throw 'Should trown an error';
    } catch (e) {
      e.getCode().should.be.equal(constants.ERROR_STORAGE_PARAM_NOT_VALID);
    }
  });

  it('Initialize with db and default params', function() {
    var storage = new GridFsStorage({db: connectionManager.getConnection()});
    storage.collectionRoot.should.be.equal(constants.DEFAULT_COLLECTION_ROOT);
    storage.chunkSize.should.be.equal(constants.DEFAULT_CHUNK_SIZE);
    storage.contentType.should.be.equal(constants.DEFAULT_CONTENT_TYPE);
  });

  it('Initialize with db and other params', function() {
    var storage = new GridFsStorage(
        {
          db: connectionManager.getConnection(),
          collectionRoot: 'my-collection-root',
          chunkSize: 10000,
          contentType: 'html/zip'
        });
    storage.collectionRoot.should.be.equal('my-collection-root');
    storage.chunkSize.should.be.equal(10000);
    storage.contentType.should.be.equal('html/zip');
  });
});
