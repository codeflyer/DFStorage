var path = require('path');
var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');

describe('GridFs save', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var fixtures = connectionManager.getFixtures();
    fixtures.clear(function(err) {
      done();
    });
  });

  it('Save a file with default options', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
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

  it('Save a file with new options', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010',
        {
          chunkSize: 4096,
          contentType: 'image/png',
          metadata: {
            ip : '10.0.0.1'
          }
        }
    ).then(
        function(result) {
          result._id.should.be.equal('101010');
          result.filename.should.be.equal('101010');
          result.contentType.should.be.equal('image/png');
          result.length.should.be.equal(1806);
          result.chunkSize.should.be.equal(4096);
          result.metadata.should.be.eql({
            ip : '10.0.0.1'
          });
          result.md5.should.be.eql('fc9f1ffb1c6fda2c180a9789d1294b3e');
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
