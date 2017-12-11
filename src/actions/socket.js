import { Platform, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';

import { API_URL } from '../api/utils';
import { registerPushToken } from './auth';
import { SOCKET_URL } from '../api/utils';
import { newMessageAction, typeStateChangeAction, getConversation, getConversations } from './messages';
import { navigatePush, navigateResetMessage, navigateResetHome, navigateResetTo } from './nav';
import callApi, { REQUESTS } from './api';
import CONSTANTS from '../constants';
import { isEquivalentObject, isString } from '../utils/common';

// Push notification Android error
// https://github.com/zo0r/react-native-push-notification/issues/495

const WEBSOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

let ws = null;

export function checkAndRunSockets() {
  return (dispatch, getState) => {
    if (ws && ws.readyState && ws.readyState === WEBSOCKET_STATES.OPEN) return;
    if (getState().auth.cableId) {
      dispatch(setupSocketAction(getState().auth.cableId));
    } else if (getState().auth.pushToken) {
      dispatch(establishCableDevice(getState().auth.pushToken));
    } else {
      dispatch(establishCableDevice(null));
    }
  };
}

export function setupSocketAction(cableId) {
  return (dispatch, getState) => {
    if (!cableId) return;

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
            if (ws.readyState === WEBSOCKET_STATES.OPEN) {
              try {
                // LOG('socket sending');
                ws.send(JSON.stringify(obj));
              } catch (e) {
                LOG('error sending websocket object', e);
              }
            } else {
              LOG('websocket state not open, cannot send: Websocket readyState', ws.readyState);
            }
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
        if (ws.readyState === WEBSOCKET_STATES.OPEN) {
          ws.close(undefined, 'client closed');
          ws = null;
          // LOG('Closing the socket connection');
        } else {
          LOG('websocket state not open, cannot close: Websocket readyState', ws.readyState);
        }
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

export function gotDeviceToken(token) {
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
    } else if (token && auth.pushToken && token === auth.pushToken) {
      // Don't run the setup socket or push device if the token is the same
      // as before
      LOG('dont estable any socket or push devices');
    } else {
      dispatch(establishCableDevice(null));
    }
  };
}


export function handleNotifications(state, notification) {
  return (dispatch, getState) => {
    let data = notification.data;
    // LOG(JSON.stringify(notification));

    // Get the namespace and link differently for ios and android
    let namespace;
    let link;
    if (Platform.OS === 'ios') {
      if (data && data.data && data.data.namespace) {
        namespace = data.data.namespace;
        link = data.data.link;
      }
    } else if (Platform.OS === 'android') {
      if (data && data.namespace) {
        namespace = data.namespace;
        if (data.link) {
          link = data.link;
        } else if (data.notification && data.notification.click_action) {
          link = data.notification.click_action;
        }
      }
    }

    LOG('notification', state, data, link);

    if (state === 'foreground') {
      LOG('Foreground notification', data);
      // If the user receives a push notification while in the app and sockets
      // are not connected, grab the new conversation info
      if (!ws || (ws && ws.readyState !== WEBSOCKET_STATES.OPEN)) {
        LOG('socket is closed');
        if (namespace && link && namespace.includes('messenger:conversation:message')) {
          const cId = link.substring(link.indexOf('conversations/') + 14, link.indexOf('/messages'));
          if (!cId) return;

          // const activeScreen = getState().auth.activeScreen;
          // const conversationId = getState().messages.activeConversationId;
          // LOG('activeScreen, conversationId, cId', activeScreen, conversationId, cId);

          // if (activeScreen === 'voke.Message' && cId === conversationId) {
          //   dispatch(getConversation(cId));
          // } else {
          //   dispatch(getConversations());
          // }
          const conversationId = getState().messages.activeConversationId;
          if (conversationId && cId === conversationId) {
            dispatch(getConversation(cId));
          } else {
            dispatch(getConversations());
          }
        }
      }
    }
    if (state === 'background') {
      PushNotification.setApplicationIconBadgeNumber(2);

      LOG('Background notification', data);
    }
    if (state === 'open') {

      LOG('message came in with namespace and link', namespace, link);

      if (namespace && link && namespace.includes('messenger:conversation:message')) {
        const cId = link.substring(link.indexOf('conversations/') + 14, link.indexOf('/messages'));
        if (!cId) return;
        dispatch(getConversation(cId)).then((results) => {
          if (!results || !results.conversation ) {
            return;
          }
          dispatch(navigateResetMessage({
            conversation: results.conversation,
          }));
        });
      }
    //   // NotificationsIOS.removeAllDeliveredNotifications();
    // } else {
    //   LOG('handle notification else');
    //   // NotificationsIOS.setBadgesCount(2);
    //
    }
  };
}

export function establishDevice() {
  return (dispatch, getState) => {

    // LOG('hjere');
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        LOG('in push notification register');
        dispatch(gotDeviceToken(token.token));
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        let state;
        if (notification && notification.foreground && !notification.userInteraction) {
          state = 'foreground';
        } else if (notification && !notification.foreground && !notification.userInteraction) {
          state= 'background';
        } else {
          state ='open';
        }
        LOG('onNotification state', state);
        dispatch(handleNotifications(state, notification));
      },
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: CONSTANTS.GCM_SENDER_ID,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
      requestPermissions: true,
    });
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
          kind: Platform.OS === 'android' ? 'android_react' : 'apple',
        },
      };
      return dispatch(callApi(REQUESTS.CREATE_PUSH_DEVICE, {}, data)).then((results) => {
        LOG('Create Push Device Results: ', JSON.stringify(results));
      });
    }
  };
}
