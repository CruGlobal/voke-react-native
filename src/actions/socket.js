import { Platform } from 'react-native';
import { API_URL } from '../api/utils';
import { registerPushToken } from './auth';
import { SOCKET_URL } from '../api/utils';
import { newMessageAction, typeStateChangeAction } from './messages';
import callApi, { REQUESTS } from './api';
import { isEquivalentObject } from '../utils/common';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';

let ws = null;

export function setupSocketAction(cableId) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
      console.warn('could not start sockets because there is no access_token');
      return;
    }
    ws = new WebSocket(`${SOCKET_URL}cable?access_token=${token}`);

    ws.onopen = () => {
      // connection opened
      // console.warn('socket opened');

      const obj = {
        command: 'subscribe',
        identifier: `{"channel":"DeviceChannel","id":"${cableId}"}`,
      };
      ws.send(JSON.stringify(obj));
      // console.warn('socket message sent');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data) || {};
      const type = data && data.type;
      if (type === 'ping') return;
      // console.warn('socket message received: data', data);
      if (type === 'welcome') {
        // console.warn('socket welcome');
      } else if (data.message) {
        const message = data.message.message;
        const notification = data.message.notification;
        if (notification && notification.category === 'CREATE_MESSAGE_CATEGORY') {
          dispatch(newMessageAction(message));
        }
        if (notification && (notification.category === 'CREATE_TYPESTATE_CATEGORY' || notification.category === 'DESTROY_TYPESTATE_CATEGORY')) {
          dispatch(typeStateChangeAction(data.message));
        }
      }
    };

    ws.onerror = (e) => {
      // an error occurred
      console.warn('socket message error', e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      // console.warn('socket closed', e.code, e.reason);
    };
  };
}

// TODO: if the app goes into the background, close sockets
export function closeSocketAction() {
  return () => {
    if (ws) {
      ws.close(undefined, 'client closed');
      ws = null;
    }
  };
}

export function destroyDevice(cableId) {
  let query = {
    endpoint: `${API_URL}/me/devices/${cableId}`,
  }
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.DESTROY_DEVICE, query)).then((results)=> {
      console.warn('Destroyed device', results);
    });
  };
}

export function updateDevice(device) {
  return (dispatch, getState) => {
    console.warn('UPDATING DEVICE');
    const cableId = getState().auth.cableId;
    let query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
    };
    return dispatch(callApi(REQUESTS.UPDATE_DEVICE, query, device)).then((results)=>{
      dispatch(setupSocketAction(results.id));
    });
  };
}

export function establishDevice() {
  return (dispatch, getState) => {
    const auth = getState().auth;
    let pushT = null;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.warn( 'TOKEN:', token );
        pushT = token.token;
        if (pushT !== auth.pushToken) {
          dispatch(registerPushToken(token.token)).then(()=>{
            dispatch(establishPushDevice());
          });
        }
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.warn( 'NOTIFICATION:', notification );
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: "YOUR GCM SENDER ID",

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

    // Do compare devices and either update or create, or just call setupSocketAction
    const currentDeviceInfo = {
      version: 1,
      local_id: DeviceInfo.getUniqueID(),
      local_version: DeviceInfo.getVersion(),
      family: DeviceInfo.getBrand(),
      name: DeviceInfo.getModel(),
      os: `${Platform.OS} ${DeviceInfo.getSystemVersion()}`,
    };
    const isEquivalent = isEquivalentObject(auth.device, currentDeviceInfo);
    if (!isEquivalent || (isEquivalent && !auth.cableId) || (pushT !== auth.pushToken)) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: auth.pushToken || null,
          kind: 'cable',
        },
      };
      if (auth.cableId) {
        // do update
        dispatch(updateDevice(data));
      } else {
        // do create
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then((results)=> {
          console.warn('Create Device Results: ',JSON.stringify(results));
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
    console.warn('push token auth',auth.pushToken);
    // Do compare devices and either update or create, or just call setupSocketAction
    const currentDeviceInfo = {
      version: 1,
      local_id: DeviceInfo.getUniqueID(),
      local_version: DeviceInfo.getVersion(),
      family: DeviceInfo.getBrand(),
      name: DeviceInfo.getModel(),
      os: `${Platform.OS} ${DeviceInfo.getSystemVersion()}`,
    };
    const isEquivalent = isEquivalentObject(auth.device, currentDeviceInfo);
    if (!isEquivalent || auth.pushToken) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: auth.pushToken,
          kind: 'apple',
        },
      };
      if (!isEquivalent) {
        // do update
        dispatch(updateDevice(data));
      } else {
        // do create
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then((results)=> {
          console.warn('Create Push Device Results: ',JSON.stringify(results));
        });
      }
    }
  };
}
