/*jslint node: true */
"use strict";

require('dotenv').config();

const C = require('../shared/C');
const getSetsToDo = require('../shared/getSetsToDo');
const winston = require('winston');
const cluster = require('cluster');

const processCount = ((threads, use_redis) => {
  const threadCount = parseInt(threads, 10);

  // Only do multi-threading if we have a redis config.
  if (!use_redis) return 1;

  if (!threadCount) return require('os').cpus().length;

  return threadCount;
})(process.env.THREADS, process.env.USE_REDIS);

const getMCISetCodes = () => C.SETS.filter(SET => SET.isMCISet).map(SET => SET.code);

const excludeSets = C.SETS_NOT_ON_GATHERER.concat(getMCISetCodes());
const setsToDo = getSetsToDo().filter(set => !excludeSets.includes(set));

function callbackToPromise(func, parameter) {
  return new Promise((accept, reject) => {
    func(parameter, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      accept(data);
    });
  });
}

async function executeSet(shared, setCode) {
  const rip = require('./rip');

  const setCodeLowerCase = setCode.toLowerCase();
  const targetSet = C.SETS.find(set => (
    set.name.toLowerCase() === setCodeLowerCase ||
    set.code.toLowerCase() === setCodeLowerCase
  ));

  const asyncRipSet = (setName) => callbackToPromise(rip.ripSet, setName);

  if (!targetSet) {
    const errorString = `Cannot find set ${setCode}`;
    winston.error(errorString);
    throw new Error(errorString);
  }

  if (targetSet.isMCISet) {
    const errorString = `Set ${setCode} is an MCI set. Use importMCISet instead`;
    winston.error(errorString);
    throw new Error(errorString);
  }

  const rippedSet = await asyncRipSet(targetSet.name);

  return shared.saveSetAsync(rippedSet);
}

async function execute(setList) {
  if (!setList || !Array.isArray(setList)) {
    throw new Error('invalid parameter');
  }

  if (setList.length <= 0) {
    winston.warn('no sets to process.');
    return;
  }

  let workingClusters = 0;
  let remainingSets = [...setList];

  const nextWorker = () => {
    if (remainingSets.length > 0) {
      const nextSet = remainingSets[0];
      remainingSets = remainingSets.slice(1);

      spawnCluster(nextSet);
    }
  };

  const spawnCluster = (setName) => {
    workingClusters++;

    winston.info(`spawning worker for ${setName}...`);
    const worker = cluster.fork({ setName: setName });
    worker.on('exit', () => {
      workingClusters--;
      nextWorker();
    });
  };

  for (let i = 0; i < processCount; i++) {
    nextWorker();
  }
}

if (setsToDo.length > 1 && cluster.isMaster) {
  winston.info(`Doing sets: ${setsToDo} with a maximum of ${processCount} threads`);

  execute(setsToDo);
} else if (setsToDo.length === 1 && cluster.isMaster) {
  const shared = require('../shared/shared');

  const setName = setsToDo[0];
  winston.info(`single process for set ${setName}`);
  executeSet(shared, setName)
    .then(() => {
      winston.info(`worker done for ${setName}`);
    })
    .catch(err => {
      winston.error(`worker finished with error for set ${setName}`);
      winston.error(err);
    })
    .then(() => {
      if (shared.cache.disconnect) shared.cache.disconnect();
    });
} else {
  const shared = require('../shared/shared');

  const setName = process.env.setName;
  winston.info(`worker for set ${setName}`);
  executeSet(shared, setName)
    .then(() => {
      winston.info(`worker done for ${setName}`);
      if (shared.cache.disconnect) shared.cache.disconnect();
      process.exit(0);
    })
    .catch(err => {
      winston.error(`worker finished with error for set ${setName}`);
      winston.error(err);
      if (shared.cache.disconnect) shared.cache.disconnect();
      process.exit(1);
    });
}
