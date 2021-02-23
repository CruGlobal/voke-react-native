jest.mock('react-native-permissions', () => {
  const mock = require('react-native-permissions/mock');
  return mock;
});

const {
  RESULTS,
} = require('../node_modules/react-native-permissions/dist/commonjs/results.js');
const {
  PERMISSIONS,
} = require('../node_modules/react-native-permissions/dist/commonjs/permissions.js');

export { PERMISSIONS, RESULTS };

export async function check() {
  jest.fn();
}
