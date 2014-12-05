var path = require('path');
var connectionManager = require('../connectionManager');
var GridFsStorage = require('../../lib/storages/gridFs');
var constants = require('../../lib/constants');

describe('GridFs exists', function() {

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

  it('Save a file and check if exists (true)', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
          return storage.exists('101010');
        }
    ).then(function(result) {
          result.should.be.equal(true);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Save a file and check if exists (false)', function(done) {
    var storage = new GridFsStorage({
      db: connectionManager.getConnection()
    });

    var sourceFile = path.join(__dirname, '..', 'sampleFiles', 'test.png');
    storage.save(sourceFile, '101010').then(
        function(result) {
          return storage.exists('201010');
        }
    ).then(function(result) {
          result.should.be.equal(false);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
