var path = require('path');
var FileFsStorage = require('../../lib/storages/fileFs');
var fsUtils = require('../../lib/utils/fs');

describe('FileFs exists', function () {

  before(function (done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function (done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    fsUtils.rmdir(rootPath)
        .then(() => fsUtils.mkdir(rootPath))
        .then(() => done());
  });

  it('Save a file and check if exists (true)', function (done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function (result) {
          return storage.exists('101010');
        }
    ).then(function (result) {
          result.should.be.equal(true);
          done();
        }
    ).catch(function (err) {
      done(err);
    });
  });

  it('Save a file and check if exists (false)', function (done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function (result) {
          return storage.exists('201010');
        }
    ).then(function (result) {
          result.should.be.equal(false);
          done();
        }
    ).catch(function (err) {
      done(err);
    });
  });
});
