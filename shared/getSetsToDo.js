const C = require('C');
const winston = require('winston');
var unique = require('array-unique');

function getSetsToDo(startAt) {
  startAt = startAt || 2;
  if (process.argv.length < (startAt + 1)) {
    winston.error("Usage: node %s <set code|'allsets'>", process.argv[1]);
    process.exit(1);
  }

  const setsNotToDo = [];
  let setsToDo = [];

  process.argv.slice(startAt).forEach((arg) => {
    if (arg === 'allsets') {
      setsToDo = C.SETS.map(function(SET) { return SET.code; });
    } else if (arg === 'nongatherersets') {
      setsToDo = C.SETS_NOT_ON_GATHERER.slice();
    } else if (arg === 'mcisets') {
      setsToDo = exports.getMCISetCodes();
    } else if (arg === 'sincelastprintingreset') {
      var seenLastPrintingResetSet = false;
      C.SETS.forEach(function (SET) {
        if (SET.code === C.LAST_PRINTINGS_RESET)
          seenLastPrintingResetSet = true;
        else if(seenLastPrintingResetSet)
          setsToDo.push(SET.code);
      });
    } else if (arg.toLowerCase().startsWith('startat')) {
      setsToDo = C.SETS.map(function(SET) { return SET.code; });
      setsToDo = setsToDo.slice(setsToDo.indexOf(arg.substring('startat'.length)));
    } else if (arg.toLowerCase().startsWith('not')) {
      setsNotToDo.push(arg);
      setsNotToDo.push(arg.substring(3));
    } else {
      setsToDo.push(arg);
    }
  });

  setsToDo = setsToDo.filter(set => !setsNotToDo.includes(set));
  return unique(setsToDo).sort();
}

module.exports = getSetsToDo;
