var path = require('path');
var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');
var httpMocks = require('node-mocks-http');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var fsUtils = require('../../lib/utils/fs');

describe('GridFs load', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    var fixtures = connectionManager.getFixtures();
    var rootPath = path.join(__dirname, '..', 'sampleFiles', 'dest');
    fixtures.clear(function(err) {
      fsUtils.rmdir(rootPath)
          .then(() => fsUtils.mkdir(rootPath))
          .then(() => done());
    });
  });

  it('Load a file', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
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
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var response = httpMocks.createResponse({eventEmitter: EventEmitter});
    response.on('end', function(result) {
      response._getData().should.be.equal('404');
      done();
    });

    storage.sendToResponse('201010', response);
  });
});
