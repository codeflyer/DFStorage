var path = require('path');
var FileFsStorage = require('../../lib/storages/fileFs');
var fsUtils = require('../../lib/utils/fs');

describe('FileFs loadMeta', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    fsUtils.rmdir(rootPath).then(function() {
      done();
    });
  });

  it('Load meta after save', function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101012').then(
        function(result) {
          return storage.loadMeta('101012');
        }
    ).then(function(result) {
          result.filename.should.be.equal('101012');
          result.contentType.should.be.equal('plain/text');
          result.length.should.be.equal(1806);
          result.metadata.should.be.eql({});
          done();
        }
    ).catch(function(err) {
          console.log(err);
          done(err);
        });
  });

  it('Load non existent meta', function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
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
          console.log(err);
          done(err);
        });
  });
});
