
const ENABLE_LOGS = true;

global.LOG = function() {
  // const args = Array.prototype.slice.call(arguments); // ES5
  const args = Array.from(arguments); // ES6
  if (__DEV__ && ENABLE_LOGS) {
    console.warn.apply(console, args);
  }
  if (__DEV__ && console.tron) {
    // console.tron.log(args);
    console.tron.display({
      name: 'Console',
      value: args,
      preview: typeof args[0] === 'string' ? args[0] : 'no preview',
    });
  }
};
