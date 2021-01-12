import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DeviceInfo from 'react-native-device-info';
// Following https://github.com/react-native-community/push-notification-ios
// - Added these configs: https://d.pr/i/AoUUxy

import { ThunkDispatch } from 'redux-thunk';
import { checkNotifications, openSettings } from 'react-native-permissions';
import { REDUX_ACTIONS } from 'utils/constants';

import * as RootNavigation from '../RootNavigation';
import st from 'utils/st';

import { establishPushDevice, establishCableDevice } from './requests';

type Dispatch = ThunkDispatch<any, any, any>;

// Push notification Android error
// https://github.com/zo0r/react-native-push-notification/issues/495

const WEBSOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

// let ws: any = null;

export const NAMESPACES = {
  MESSAGE: 'messenger:conversation:message',
  ADVENTURE: 'platform:organization:adventure:challenge',
};

// Extract predefined list of param from the link provided.
const getLinkParams = (link: string) => {
  const components = link.split('/');
  // Object with possible keys.
  const params = {
    messenger_journeys: '',
    messenger_journey_steps: '',
    messenger_journey_reports: '',
    conversations: '',
    messages: '',
  };
  let currParm: keyof typeof params | '' = '';
  // Extract components of the link provided.
  components.forEach(str => {
    if (str in params) {
      currParm = str as typeof currParm;
    } else if (currParm && str !== '') {
      params[currParm] = str;
    }
  });
  // Remove keys with empty values.
  const result = Object.entries(params).reduce(
    (a: Record<string, unknown>, [k, v]) =>
      v == null || v === '' ? a : ((a[k] = v), a),
    {},
  );

  return result;
};

const getCID = l =>
  l.substring(l.indexOf('conversations/') + 14, l.indexOf('/messages'));

const getJID = l =>
  l.substring(
    l.indexOf('messenger_journeys/') + 19,
    l.indexOf('/messenger_journey_steps'),
  );

const getOnlyJID = l =>
  l.substring(l.indexOf('messenger_journeys/') + 19, l.length);

const getSID = l =>
  l.substring(l.indexOf('messenger_journey_steps/') + 24, l.length);

export function setAppIconBadgeNumber(newValue: number) {
  // https://github.com/zo0r/react-native-push-notification#set-application-badge-icon
  // Works natively in iOS.
  // Uses the ShortcutBadger on Android, and as such will not work on all Android devices.
  PushNotification.setApplicationIconBadgeNumber(newValue);
}

// Push Notifications token generated by Apple/Google.
// Notifications are open and configured. Send this token to our backend,
// so the server knows were to deliver notifications.
function gotPushToken(newPushToken: any) {
  return async (dispatch: Dispatch, getState: any) => {
    if (!newPushToken) return;
    const { pushToken } = getState().auth;
    const deviceId = getState().auth.device.id;
    let newPushDeviceId = null;

    // Save new push token in the store.
    dispatch({
      type: REDUX_ACTIONS.SET_PUSH_TOKEN,
      pushToken: newPushToken,
      description:
        'Called from gotPushToken. Push Token Changes. Will send it to our backend.',
    });
    // FIRST: REGISTER DEVICE ON THE SERVER FOR PUSH NOTIFICATIONS.
    // Register new push token on our server.
    newPushDeviceId = await dispatch(establishPushDevice(newPushToken));

    dispatch({
      type: REDUX_ACTIONS.SET_PUSH_DEVICE_ID,
      deviceId: newPushDeviceId,
      description:
        'Called from gotPushToken. Push device ID Changes. Will send it to our backend.',
    });

    // THEN: SETUP WEBSOCKETS CONNECTION.
    await dispatch(establishCableDevice(newPushDeviceId));
  };
}

function handleNotifications(state: string, notification: { data?: any }) {
  return async (dispatch: Dispatch, getState: any) => {
    const { data } = notification;

    // Get the namespace and link differently for ios and android
    let namespace;
    let link;
    if (!st.isAndroid) {
      // iOS
      if (data && data.data && data.data.namespace) {
        namespace = data.data.namespace;
        link = data.data.link;
      }
    } else if (notification) {
      if (notification?.link) {
        link = notification.link;
      }
      if (notification?.namespace) {
        namespace = notification.namespace;
      }
    }

    if (state === 'open' && namespace && link) {
      const linkParams = getLinkParams(link);
      if ('messenger_journeys' in linkParams) {
        const adventureId = linkParams.messenger_journeys;
        if ('messenger_journey_steps' in linkParams) {
          const stepId = linkParams.messenger_journey_steps;
          try {
            RootNavigation.navigate('AdventureStepScreen', {
              stepId,
              adventureId,
            });
          } catch (error) {
            RootNavigation.reset({
              index: 0,
              routes: [{ name: 'LoggedInApp' }],
            });
          }
        } else if ('messenger_journey_reports' in linkParams) {
          // TODO: maybe use reportID to scroll the screen to this report?
          // const reportId = linkParams.messenger_journey_reports;
          try {
            RootNavigation.navigate('AdventureManage', {
              adventureId,
            });
          } catch (error) {
            RootNavigation.reset({
              index: 0,
              routes: [{ name: 'LoggedInApp' }],
            });
          }
        } else {
          try {
            RootNavigation.navigate('AdventureActive', {
              adventureId,
            });
          } catch (error) {
            RootNavigation.reset({
              index: 0,
              routes: [{ name: 'LoggedInApp' }],
            });
          }
        }
      }
    }
  };
}

export const checkInitialNotification = async () => {
  const initialNotification = await PushNotificationIOS.getInitialNotification();
  const data = initialNotification?.getData();
  if (data) {
    handleNotifications('open', { data });
  }
};

function establishDevice(): Promise<void> {
  return async (dispatch: Dispatch, getState: any) => {
    // Shared configs for both Android and iOS.
    let configs: any = {
      // Called when Token is generated (iOS and Android)
      // Push token generated by Apple/Google Service when notifications open
      // and configured to receive notifications.
      onRegister(token: { token: any }) {
        // Update redux with the push notification permission value
        const newPushToken = token?.token;
        dispatch({
          type: REDUX_ACTIONS.PUSH_PERMISSION,
          permission: 'granted',
          description:
            'Called from PushNotification > onRegister (received new token): ' +
            newPushToken,
        });

        // Once we have a new token send it to our backend,
        // so the server knows where to send notifications.
        return dispatch(gotPushToken(newPushToken));
      },
    };

    if (st.isAndroid) {
      // Android only configs
      configs = {
        ...configs,
        onNotification(notification: { data: any }) {
          dispatch(handleNotifications('open', notification));
        },
      };
    } else {
      // iOS only configs
      configs = {
        ...configs,
        // (required) Called when a remote or local notification is opened or received
        onNotification(notification: {
          foreground?: any;
          userInteraction?: any;
          finish?: any;
          data?: any;
        }) {
          let state;
          if (
            notification &&
            notification.foreground &&
            !notification.userInteraction
          ) {
            state = 'foreground';
          } else if (
            notification &&
            !notification.foreground &&
            !notification.userInteraction
          ) {
            state = 'background';
          } else {
            state = 'open';
          }
          dispatch(handleNotifications(state, notification));

          // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
          // https://github.com/zo0r/react-native-push-notification#usage
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        // ANDROID ONLY: GCM Sender ID
        // (optional - not required for local notifications,
        // but is need to receive remote push notifications)
        // senderID: CONSTANTS.GCM_SENDER_ID,

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
      };
    }
    PushNotification.configure(configs);
  };
}

type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
export function permissionsAndNotifications(askPermission = false) {
  return async (dispatch: Dispatch, getState: any) => {
    // Check notifications permission status and get notifications settings.
    // https://d.pr/bbVk5I
    checkNotifications().then(({ status }: { status: PermissionStatus }) => {
      // Save current premissions status in
      // store.info.pushNotificationPermission
      dispatch({
        type: REDUX_ACTIONS.PUSH_PERMISSION,
        permission: status, // 'unavailable' | 'denied' | 'blocked' | 'granted'
        description: 'Called from checkNotifications()',
      });

      // Blocked before but now clicked to allow notifications.
      // If permission denied once it's not requestable anymore.
      // Send the user to the settings.
      if (status === 'blocked' && askPermission) {
        openSettings().catch(
          // TODO: process this case somehow?
          () => console.warn('cannot open settings'),
        );

        // Assume user activate notifications.
        // If not app will detect it next time it opened.
        // Save new premissions status in
        // store.info.pushNotificationPermission
        dispatch({
          type: REDUX_ACTIONS.PUSH_PERMISSION,
          permission: 'granted', // 'unavailable' | 'denied' | 'blocked' | 'granted'
          description: 'Called from checkNotifications()',
        });
      }

      if (status === 'granted' || (status === 'denied' && askPermission)) {
        // User  selected: ALLOW notifications.
        // 1. Register Apple/Google device on server
        // 2. Create a WebSocket cable.
        DeviceInfo.isEmulator().then(isEmulator => {
          // if (isEmulator && false) { // -- use when testing push notifications in Emulator.
          if (isEmulator) {
            // Notifications won't work in simulator.
            return dispatch(establishCableDevice());
          } else {
            return dispatch(establishDevice());
          }
        });
        // return dispatch(establishDevice());
      } else {
        // User selected: DON'T ALLOW notifications.
        // blocked
        // Create a WebSocket cable.
        return dispatch(establishCableDevice());
      }
    });
  };
}

/*
HOW NOTIFICATIONS WORK:
The typical flow for subscribing a device
for receiving push notification in real time is:
1. register the device at the vendor's servers (e.g. FCM),
2. publishing the received token to your own push management servers.
*/
