const winston = require('winston');
let cache = null;

const isTrue = (value) => value && value !== '0' && value !== 'false';

if (isTrue(process.env.USE_REDIS)) {
  winston.info('using redis');
  const redis = require('redis');
  const client = redis.createClient();

  const ignore_cache = isTrue(process.env.REDIS_IGNORE_CACHE);

  client.on('error', err => {
    winston.error('redis error:', err);
  });

  cache = {
    get: (key, callback) => client.get(key, (err, reply) => {
      if (err) {
        callback(err);
        return;
      }

      if (!reply || ignore_cache) {
        callback({ notFound: true });
        return;
      }

      callback(null, reply);
    }),
    del: (key, options, callback) => client.del(key, callback),
    put: (key, value, callback) => client.set(key, value, callback),
    disconnect: () => client.quit(),
  };
} else {
  const levelup = require('level');
  const path = require('path');

  cache = levelup(path.join(__dirname, '..', 'cache'));
}

module.exports = cache;
