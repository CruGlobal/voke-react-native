import PushNotification from 'react-native-push-notification';

async function setup(config) {
  PushNotification.configure(config);
  return Promise.resolve();
}

function setBadge(num) {
  PushNotification.setApplicationIconBadgeNumber(num);
}

async function getInitialNotification() {
  return Promise.resolve(null);
}

function clear() {}

export default {
  setup,
  clear,
  setBadge,
  getInitialNotification,
};
