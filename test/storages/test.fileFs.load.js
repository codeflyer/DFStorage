var path = require('path');
var FileFsStorage = require('../../lib/storages/fileFs');
var httpMocks = require('node-mocks-http');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var fsUtils = require('../../lib/utils/fs');

describe('FileFs load', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    fsUtils.rmdir(rootPath)
        .then(() => fsUtils.mkdir(rootPath))
        .then(() => done());
  });

  it('Load a file', function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    var loadedFile = fs.readFileSync(sourceFile).toString();
    storage.save(sourceFile, '101010').then(
        function() {
          var response = httpMocks.createResponse({eventEmitter: EventEmitter});
          response.on('end', function() {
            response._getData().should.be.equal(loadedFile);
            done();
          });

          storage.sendToResponse('101010', response);
        }
    ).catch(function(err) {
          done(err);
        });

  });

  it('Load a file that not exists', function(done) {
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    var storage = new FileFsStorage({
      path: rootPath
    });

    var response = httpMocks.createResponse({eventEmitter: EventEmitter});
    response.on('end', function(result) {
      response._getData().should.be.equal('404');
      done();
    });

    storage.sendToResponse('201010', response);
  });
});
