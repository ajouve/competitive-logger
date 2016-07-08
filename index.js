var winston = require('winston');
var winstonRedis = require('winston-redis');

var logLevels = ['error', 'warn', 'info', 'debug'];
var transformers = [];

var logger = {
  configureRedis: function(config) {
    winstonRedis.Redis;
    winston.add(winston.transports.Redis, {
      host: config.host,
      auth: config.password
    });
  },
  addTransformer: function(transformer) {
    transformers.push(transformer);
  },
  disable: function() {
    winston.clear();
  }
};

logLevels.forEach(function(logLevel){
  logger[logLevel] = function(message, meta) {
    if (!meta) meta = {};
    transform(message, meta);
    winston[logLevel](message, meta)
  }
});

function transform(message, meta) {
  transformers.forEach(function(transformer){
    transformer(message, meta);
  });
}

module.exports = logger;
