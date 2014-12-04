var _connection;
var _fixtures;

module.exports = {
  setConnection: function(conn) {
    _connection = conn;
  },
  getConnection: function() {
    return _connection;
  },
  setFixtures: function(fixture) {
    _fixtures = fixture;
  },
  getFixtures: function() {
    return _fixtures;
  }
};
