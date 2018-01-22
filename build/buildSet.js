/*jslint node: true */
"use strict";

require('dotenv').config()

const C = require('../shared/C');
const shared = require('../shared/shared');
const rip = require('./rip');
const winston = require('winston');

const excludeSets = C.SETS_NOT_ON_GATHERER.concat(shared.getMCISetCodes());
const setsToDo = shared
  .getSetsToDo()
  .filter(set => !excludeSets.includes(set));

winston.info(`Doing sets: ${setsToDo}`);

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

function asyncRipSet(setName) {
  return callbackToPromise(rip.ripSet, setName);
}

function asyncSaveSet(setData) {
  return callbackToPromise(shared.saveSet, setData);
}

async function executeSet(setCode) {
  const setCodeLowerCase = setCode.toLowerCase();
  const targetSet = C.SETS.find(set => (
    set.name.toLowerCase() === setCodeLowerCase ||
    set.code.toLowerCase() === setCodeLowerCase
  ));

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

  return asyncSaveSet(rippedSet);
}

async function execute(setList) {
  if (!setList || !Array.isArray(setList)) {
    throw new Error('invalid parameter');
  }

  if (setList.length <= 0) {
    winston.warn('no sets to process.');
    return;
  }

  for (let i = 0; i < setList.length; i++) {
    const setCode = setList[i];
    try {
      const result = await executeSet(setCode);
      winston.info(`done with ${setCode}.`);
    } catch (e) {
      winston.error(`something went wrong with set ${setCode}.`, e);
    }
  }
}

execute(setsToDo);
