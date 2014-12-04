process.env.NODE_CONFIG_PERSIST_ON_CHANGE = 'N';
process.env.NODE_ENV = 'test';

var path = require('path');
var rootPath = path.join(__dirname, '../', '/');
global.ROOT_PATH_FOR_TEST = rootPath;

require('should');

var config = require('config');

var log4js = require('log4js');
var logger = log4js.getLogger('main');
logger.setLevel('TRACE');

var connectionManager = require('./connectionManager');

var ready = require('readyness');
var MongoClient = require('mongodb').MongoClient;
var mongoConnected = ready.waitFor('mongoDbOk');
MongoClient.connect(
    'mongodb://' +
    config.mongodb.host + ':' +
    config.mongodb.port + '/' +
    config.mongodb.db, function(err, db) {
      if (err) {
        throw err;
      }
      connectionManager.setConnection(db);
      mongoConnected();
    });

var fixtures = require('pow-mongodb-fixtures').connect(config.mongodb.db);
var fixtureConnected = ready.waitFor('fixtureDbOk');
fixtures.clear(function(err) {
  fixtureConnected();
});

connectionManager.setFixtures(fixtures);
