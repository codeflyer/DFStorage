var path = require('path');
var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');

describe('GridFs loadMeta', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var fixtures = connectionManager.getFixtures();
    fixtures.clear(function(err) {
      done();
      //fixtures.load(__dirname + '/path/to/fixtures', done);
    });
  });

  it('Load meta after save', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
          return storage.loadMeta('101010');
        }
    ).then(function(result) {
          result._id.should.be.equal('101010');
          result.filename.should.be.equal('101010');
          result.contentType.should.be.equal('plain/text');
          result.length.should.be.equal(1806);
          result.chunkSize.should.be.equal(2048);
          result.metadata.should.be.eql({});
          result.md5.should.be.eql('fc9f1ffb1c6fda2c180a9789d1294b3e');
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load non existent meta', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
          return storage.loadMeta('501010');
        }
    ).then(function(result) {
          (result == null).should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
