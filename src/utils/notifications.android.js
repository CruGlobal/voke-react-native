import Firebase from 'react-native-firebase';

let tokenRefresh = null;
let notificationDisplayedListener = null;
let notificationListener = null;
let notificationOpenedListener = null;

async function init(config) {
  const token = await Firebase.messaging().getToken();
  if (config.onRegister) {
    config.onRegister(token);
  }

  tokenRefresh = Firebase.messaging().onTokenRefresh(fcmToken => {
    if (config.onRegister) {
      config.onRegister(fcmToken);
    }
  });

  notificationDisplayedListener = Firebase.notifications().onNotificationDisplayed(
    notification => {
      // if (config.onNotification) config.onNotification('open', notification);
    },
  );
  notificationListener = Firebase.notifications().onNotification(
    notification => {
      // if (config.onNotification) config.onNotification('open', notification);
    },
  );
  notificationOpenedListener = Firebase.notifications().onNotificationOpened(
    notificationOpen => {
      // Get the action triggered by the notification being opened
      // const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      LOG('android notification', notification);
      if (config.onNotification) {
        config.onNotification('foreground', notification);
      }
    },
  );
  const initialNotification = await getInitialNotification();
  if (initialNotification && config.onNotification) {
    config.onNotification('foreground', initialNotification);
  }
}

async function setup(config) {
  const enabled = await Firebase.messaging().hasPermission();
  if (!enabled) {
    try {
      await Firebase.messaging().requestPermission();
      init(config);
    } catch (error) {
      // User has rejected permissions
    }
  } else {
    init(config);
  }
}

function setBadge(num) {
  // Nothing
}

async function getInitialNotification() {
  const notificationOpen = await Firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    return notificationOpen.notification;
  }
  return null;
}

function clear() {
  if (tokenRefresh) tokenRefresh();
  if (notificationDisplayedListener) notificationDisplayedListener();
  if (notificationListener) notificationListener();
  if (notificationOpenedListener) notificationOpenedListener();
}

export default {
  setup,
  clear,
  setBadge,
  getInitialNotification,
};
