const ENABLE_LOGS = false;

global.LOG = function() {
  // const args = Array.prototype.slice.call(arguments); // ES5
  const args = Array.from(arguments); // ES6
  if (__DEV__ && ENABLE_LOGS) {
    console.warn.apply(console, args);
  }
};
