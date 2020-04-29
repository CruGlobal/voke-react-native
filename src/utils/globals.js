
const ENABLE_LOGS = true;
const ENABLE_WARN = false;

function getArgs(a, stringify = false) {
  const args = Array.from(a);
  if (stringify && args[0] && args[0] == '[object Object]') {
    args[0] = JSON.stringify(args[0]);
  }
  if (stringify && args[1] && args[1] == '[object Object]') {
    args[1] = JSON.stringify(args[1]);
  }
  return args;
}

global.LOG = function() {
  if (__DEV__) {
    const args = getArgs(arguments);
    if (ENABLE_LOGS) {
      console.log.apply(console, args);
    }
  }
};

global.WARN = function() {
  if (__DEV__) {
    const args = getArgs(arguments, true);
    if (ENABLE_WARN) {
      console.warn.apply(console, args);
    }
  }
};