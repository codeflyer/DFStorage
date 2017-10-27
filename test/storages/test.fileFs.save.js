var path = require('path');
var FileFsStorage = require('../../lib/storages/fileFs');
var fsUtils = require('../../lib/utils/fs');

describe('FileFs save', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    fsUtils.rmdir(rootPath)
        .then(() => fsUtils.mkdir(rootPath))
        .then(() => done());
  });

  it('Save a file with default options', function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
