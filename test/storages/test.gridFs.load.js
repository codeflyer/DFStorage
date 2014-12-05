var path = require('path');
var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');
var constants = require('../../lib/constants');
var httpMocks = require('node-mocks-http');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

describe('GridFs load', function() {

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

  it('Load a file', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    var loadedFile = fs.readFileSync(sourceFile).toString();
    //result.md5.should.be.eql('fc9f1ffb1c6fda2c180a9789d1294b3e');
    storage.save(sourceFile, '101010').then(
        function(result) {
          var response = httpMocks.createResponse({eventEmitter: EventEmitter});
          response.on('end', function(result) {
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

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    var loadedFile = fs.readFileSync(sourceFile).toString();
    //result.md5.should.be.eql('fc9f1ffb1c6fda2c180a9789d1294b3e');

    var response = httpMocks.createResponse({eventEmitter: EventEmitter});
    response.on('end', function(result) {
      response._getData().should.be.equal('404');
      done();
    });

    storage.sendToResponse('201010', response);

  });
});
