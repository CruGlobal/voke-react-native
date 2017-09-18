import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';

import { API_URL } from '../api/utils';
import { registerPushToken } from './auth';
import { SOCKET_URL } from '../api/utils';
import { newMessageAction, typeStateChangeAction } from './messages';
import callApi, { REQUESTS } from './api';
import CONSTANTS from '../constants';
import { isEquivalentObject } from '../utils/common';

let ws = null;

export function setupSocketAction(cableId) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
      LOG('could not start sockets because there is no access_token');
      return;
    }
    ws = new WebSocket(`${SOCKET_URL}cable?access_token=${token}`);

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
      LOG('socket message received: data', data);
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

    ws.onerror = (e) => {
      // an error occurred
      LOG('socket message error', e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      // LOG('socket closed', e.code, e.reason);
    };
  };
}

export function closeSocketAction() {
  return () => {
    if (ws) {
      ws.close(undefined, 'client closed');
      ws = null;
      LOG('Closing the socket connection');
    }
  };
}

export function destroyDevice(cableId, token) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
      access_token: token,
    };
    return dispatch(callApi(REQUESTS.DESTROY_DEVICE, query)).then((results) => {
      LOG('Destroyed device', results);
      return results;
    });
  };
}

export function updateDevice(device) {
  return (dispatch, getState) => {
    LOG('UPDATING DEVICE');
    const cableId = getState().auth.cableId;
    let query = {
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

export function establishDevice() {
  return (dispatch, getState) => {
    const auth = getState().auth;
    //
    // return dispatch(callApi(REQUESTS.GET_DEVICES, {}, {})).then((results) => {
    //   LOG('GOT DEVICES: ',JSON.stringify(results));
    //   results.devices.forEach((m) => {
    //     dispatch(destroyDevice(m.id));
    //   })
    // });
    // dispatch(establishCableDevice(null));

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        LOG('RECEIVED PUSH TOKEN:', token);

        if ((token.token && !auth.pushToken) || (token.token !== auth.pushToken) ) {
          dispatch(registerPushToken(token.token)).then(() => {
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
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        LOG('NOTIFICATION:', notification);
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
          kind: Platform.OS === 'android' ? 'android' : 'apple',
        },
      };
      return dispatch(callApi(REQUESTS.CREATE_PUSH_DEVICE, {}, data)).then((results) => {
        LOG('Create Push Device Results: ', JSON.stringify(results));
      });
    }
  };
}
