var storages = require('../lib/index');

describe('Storage getKeyList', function() {

  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function() {
    storages.reset();
  });

  it('Get list after first init', function() {
    storages.getKeyList().length.should.be.equal(0);
  });

  it('Get list after first insert', function() {
    storages.setStorage('first-storage', 'somestorage');
    storages.getKeyList().length.should.be.equal(1);
    storages.getKeyList().should.be.eql(['first-storage']);
  });

  it('Get list after many insert', function() {
    storages.setStorage('first-storage', 'somestorage');
    storages.setStorage('second-storage', 'somestorage');
    storages.setStorage('third-storage', 'somestorage');
    storages.getKeyList().length.should.be.equal(3);
    storages.getKeyList().should.be.eql(
        ['first-storage', 'second-storage', 'third-storage']);
  });
});
