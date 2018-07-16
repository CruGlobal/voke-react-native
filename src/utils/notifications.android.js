import Firebase from 'react-native-firebase';

let tokenRefresh = null;
let notificationDisplayedListener = null;
let notificationListener = null;
let notificationOpenedListener = null;
let messageListener = null;

async function init(config) {
  const token = await Firebase.messaging().getToken();
  LOG('Got token on android', token);
  if (config.onRegister) {
    config.onRegister(token);
  }

  tokenRefresh = Firebase.messaging().onTokenRefresh(fcmToken => {
    if (config.onRegister) {
      config.onRegister(fcmToken);
      LOG('TOKEN REFRESH', fcmToken);
    }
  });

  notificationDisplayedListener = Firebase.notifications().onNotificationDisplayed(
    notification => {
      LOG('notification displayed', notification);
      // if (config.onNotification) config.onNotification('open', notification);
    },
  );
  notificationListener = Firebase.notifications().onNotification(
    notification => {
      // if (config.onNotification) config.onNotification('open', notification);
      LOG('ON notification', notification);
    },
  );
  messageListener = Firebase.messaging().onMessage(message => {
    LOG('MESSAGE', message);
  });
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
  if (messageListener) messageListener();
}

export default {
  setup,
  clear,
  setBadge,
  getInitialNotification,
};
