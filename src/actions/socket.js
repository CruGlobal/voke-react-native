import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import PushNotification from 'react-native-push-notification';
import NotificationsIOS, { NotificationsAndroid } from 'react-native-notifications';

import { API_URL } from '../api/utils';
import { registerPushToken } from './auth';
import { SOCKET_URL } from '../api/utils';
import { newMessageAction, typeStateChangeAction, getConversation } from './messages';
import { navigatePush, navigateResetHome } from './navigation_new';
import callApi, { REQUESTS } from './api';
import CONSTANTS from '../constants';
import { isEquivalentObject, isString } from '../utils/common';

// Push notification Android error
// https://github.com/zo0r/react-native-push-notification/issues/495


let ws = null;

export function setupSocketAction(cableId) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
      LOG('could not start sockets because there is no access_token');
      return;
    }

    // Do a try/catch just to stop any errors
    try {
      ws = new WebSocket(`${SOCKET_URL}cable?access_token=${token}`);

      if (ws) {
        ws.onopen = () => {
          // connection opened
          // LOG('socket opened');

          const obj = {
            command: 'subscribe',
            identifier: `{"channel":"DeviceChannel","id":"${cableId}"}`,
          };
          if (ws && ws.send) {
            ws.send(JSON.stringify(obj));
            // LOG('socket message sent');
          }
        };

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data) || {};
          const type = data && data.type;
          if (type === 'ping') return;
          // LOG('socket message received: data', data);
          if (type === 'welcome') {
            // LOG('socket welcome');
          } else if (data.message) {
            const message = data.message.message;
            const notification = data.message.notification;
            if (notification && notification.category === 'CREATE_MESSAGE_CATEGORY') {
              dispatch(newMessageAction(message));
            } else if (notification && (notification.category === 'CREATE_TYPESTATE_CATEGORY' || notification.category === 'DESTROY_TYPESTATE_CATEGORY')) {
              dispatch(typeStateChangeAction(data.message));
            }
          }
        };

        // ws.onerror = (err) => {
        //   // an error occurred
        //   LOG('socket message error', err.message);
        // };

        // ws.onclose = (err) => {
        //   // connection closed
        //   LOG('socket closed', err.code, err.reason);
        // };
      }
    } catch (socketErr) {
      // Do nothing with the error
      LOG('socket error in setup', socketErr);
    }

  };
}

export function closeSocketAction() {
  return () => {
    // Do a try/catch just to stop any errors
    try {
      if (ws && ws.close) {
        ws.close(undefined, 'client closed');
        ws = null;
        // LOG('Closing the socket connection');
      }
    } catch (socketErr) {
      // Do nothing with the error
      LOG('socket error in close', socketErr);
    }
  };
}

export function destroyDevice(cableId, token) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
      access_token: token,
    };
    return dispatch(callApi(REQUESTS.DESTROY_DEVICE, query)).catch((err) => {
      LOG('error destroying device', cableId);
    });
  };
}

export function updateDevice(device) {
  return (dispatch, getState) => {
    LOG('UPDATING DEVICE');
    const cableId = getState().auth.cableId;
    const query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
    };
    return dispatch(callApi(REQUESTS.UPDATE_DEVICE, query, device)).then((results) => {
      dispatch(setupSocketAction(results.id));
    });
  };
}

export function getDevices() {
  return (dispatch) => {
    LOG('GETTING DEVICES');
    return dispatch(callApi(REQUESTS.GET_DEVICES));
  };
}

export function gotDeviceToken(navigator, token) {
  return (dispatch, getState) => {
    LOG('RECEIVED PUSH TOKEN:', token);
    const auth = getState().auth;

    if ((token && !auth.pushToken) || (token !== auth.pushToken) ) {
      dispatch(registerPushToken(token)).then(() => {
        dispatch(establishPushDevice()).then(() => {
          const updatedPushId = getState().auth.pushId;
          dispatch(establishCableDevice(updatedPushId));
        });
      });
    } else if (!token || !auth.pushToken) {
      dispatch(establishCableDevice(null));
    } else if (!token && auth.pushToken) {
      dispatch(establishCableDevice(null));
    } else if (auth.cableId) {
      dispatch(setupSocketAction(auth.cableId));
    } else {
      dispatch(establishCableDevice(null));
    }

    notificationForeground = (n) => dispatch(handleNotifications(navigator, 'foreground', n));
    notificationBackground = (n) => dispatch(handleNotifications(navigator, 'background', n));
    notificationOpen = (n) => dispatch(handleNotifications(navigator, 'open', n));

    if (Platform.OS === 'android') {
      // On Android, we allow for only one (global) listener per each event type.
      NotificationsAndroid.setNotificationReceivedListener(notificationBackground);
      NotificationsAndroid.setNotificationOpenedListener(notificationOpen);
    } else {
      // NotificationsIOS.localNotification({
    //   alertBody: 'Local notificiation!',
    //   fireDate: new Date(Date.now() + (5 * 1000)),
    //   alertTitle: 'Local Notification Title',
    // });
      NotificationsIOS.addEventListener('notificationReceivedForeground', notificationForeground);
      NotificationsIOS.addEventListener('notificationReceivedBackground', notificationBackground);
      NotificationsIOS.addEventListener('notificationOpened', notificationOpen);
      NotificationsIOS.consumeBackgroundQueue();
    }
  };
}

let notificationForeground;
let notificationBackground;
let notificationOpen;

export function closeNotificationListeners() {
  return () => {
    if (Platform.OS === 'ios') {
      NotificationsIOS.removeEventListener('notificationReceivedForeground', notificationForeground);
      NotificationsIOS.removeEventListener('notificationReceivedBackground', notificationBackground);
      NotificationsIOS.removeEventListener('notificationOpened', notificationOpen);
    }
  };
}

export function handleNotifications(navigator, state, notification) {
  return (dispatch, getState) => {
    LOG('handle notification', state, notification);
    let data = notification.getData();
    LOG('notification', state, data);
    if (state === 'background') {
      // NotificationsIOS.setBadgesCount(2);
      LOG('Background notification', data);
    }
    if (state === 'open') {
      if (data && data.data && data.data.namespace && data.data.namespace.includes('messenger:conversation:message')) {
        const link = data.data.link;
        const cId = link.substring(link.indexOf('conversations/') + 14, link.indexOf('/messages'));
        LOG('cId', cId);
        dispatch(getConversation(cId)).then((results)=> {
          // dispatch(navigateResetHome(navigator));
          dispatch(navigatePush(navigator, 'voke.Message', {conversation: results.conversation}));
        });
      }
      // NotificationsIOS.removeAllDeliveredNotifications();
    } else {
      LOG('handle notification else');
      // NotificationsIOS.setBadgesCount(2);

    }
  };
}

export function establishDevice(navigator) {
  return (dispatch, getState) => {
    //
    // return dispatch(callApi(REQUESTS.GET_DEVICES, {}, {})).then((results) => {
    //   LOG('GOT DEVICES: ',JSON.stringify(results));
    //   results.devices.forEach((m) => {
    //     dispatch(destroyDevice(m.id, getState().auth.token));
    //   })
    // });
    // dispatch(establishCableDevice(null));
    // return;
    // PushNotification.localNotificationSchedule({
    //   message: 'My Notification Message', // (required)
    //   date: new Date(Date.now() + (5 * 1000)), // in 60 secs
    // });

    if (Platform.OS === 'android') {
      NotificationsAndroid.refreshToken();
      // On Android, we allow for only one (global) listener per each event type.
      NotificationsAndroid.setRegistrationTokenUpdateListener((token) => {
        dispatch(gotDeviceToken(navigator, token));
      });
    } else {
      const onPushRegistered = function(token) {
        dispatch(gotDeviceToken(navigator, token));
        NotificationsIOS.removeEventListener('remoteNotificationsRegistered', onPushRegistered);
      };

      const onPushRegistrationFailed = function(error) {
        LOG('token error!', error);
        dispatch(establishCableDevice(null));
        NotificationsIOS.removeEventListener('remoteNotificationsRegistrationFailed', onPushRegistrationFailed);
      };

      NotificationsIOS.addEventListener('remoteNotificationsRegistered', onPushRegistered);
      NotificationsIOS.addEventListener('remoteNotificationsRegistrationFailed', onPushRegistrationFailed);
      NotificationsIOS.requestPermissions();
    }





  //   PushNotification.configure({
  //     // (optional) Called when Token is generated (iOS and Android)
  //     onRegister: function(token) {
  //
  //     },
  //
  //     // (required) Called when a remote or local notification is opened or received
  //     onNotification: function(notification) {
  //       LOG('NOTIFICATION From App:', notification);
  //       if (!notification || !notification.foreground || !notification.message) { return; }
  //       const message = notification.message;
  //       // const message = isString(notification.message) ? JSON.parse(notification.message) : notification.message;
  //       LOG('NOTIFICATION MESSAGE:', message);
  //       if (message.message && message.message.conversation_id) {
  //         dispatch(navigateResetHome(navigator));
  //         dispatch(navigatePush(navigator, 'voke.Message', { conversation: {
  //           id: message.message.conversation_id,
  //           messengers: [],
  //         }}));
  //       }
  //     },
  //
  //     // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  //     senderID: CONSTANTS.GCM_SENDER_ID,
  //
  //     // IOS ONLY (optional): default: all - Permissions to register.
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     // Should the initial notification be popped automatically
  //     // default: true
  //     popInitialNotification: true,
  //     /**
  //       * (optional) default: true
  //       * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //       * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //       */
  //     requestPermissions: true,
  //   });
  };
}

export function establishCableDevice(token) {
  return (dispatch, getState) => {
    const auth = getState().auth;
    const currentDeviceInfo = {
      version: 1,
      local_id: DeviceInfo.getUniqueID(),
      local_version: DeviceInfo.getVersion(),
      family: DeviceInfo.getBrand(),
      name: DeviceInfo.getModel(),
      os: `${Platform.OS} ${DeviceInfo.getSystemVersion()}`,
    };

    const isEquivalent = isEquivalentObject(auth.device, currentDeviceInfo);

    if (token) {
      LOG('token exists in establishCableDevice');
      let data = {
        device: {
          ...currentDeviceInfo,
          key: token,
          kind: 'cable',
        },
      };
      if (auth.cableId) {
        LOG('cableID exists in establishCableDevice', auth.cableId);
        // UPDATE THE CABLE DEVICE WITH DATA
        dispatch(updateDevice(data));
      } else {
        LOG('cableID does not exists in establishCableDevice');
        // CREATE THE CABLE DEVICE WITH DATA
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then((results) => {
          LOG('Creating Cable Device Results: ', JSON.stringify(results));
          dispatch(setupSocketAction(results.id));
        });
      }
    } else if (!isEquivalent || (isEquivalent && !auth.cableId) ) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: null,
          kind: 'cable',
        },
      };
      if (auth.cableId) {
        // UPDATE THE CABLE DEVICE WITH DATA
        dispatch(updateDevice(data));
      } else {
        // CREATE THE CABLE DEVICE WITH DATA
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then((results) => {
          LOG('Creating Cable Device Results: ', JSON.stringify(results));
          dispatch(setupSocketAction(results.id));
        });
      }
    } else {
      dispatch(setupSocketAction(auth.cableId));
    }
  };
}

export function establishPushDevice() {
  return (dispatch, getState) => {
    const auth = getState().auth;

    const currentDeviceInfo = {
      version: 1,
      local_id: DeviceInfo.getUniqueID(),
      local_version: DeviceInfo.getVersion(),
      family: DeviceInfo.getBrand(),
      name: DeviceInfo.getModel(),
      os: `${Platform.OS} ${DeviceInfo.getSystemVersion()}`,
    };

    if (auth.pushToken) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: auth.pushToken,
          kind: Platform.OS === 'android' ? 'android' : 'apple',
        },
      };
      return dispatch(callApi(REQUESTS.CREATE_PUSH_DEVICE, {}, data)).then((results) => {
        LOG('Create Push Device Results: ', JSON.stringify(results));
      });
    }
  };
}
