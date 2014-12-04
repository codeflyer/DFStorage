var connectionManager = require('./connectionManager');
var index = require('../lib/index');

describe('Index test', function() {

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

  it('First test', function() {
    index.start().should.be.equal('OK');
  });
});
