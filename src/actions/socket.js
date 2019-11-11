import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { API_URL } from '../api/utils';
import {
  registerPushToken,
  openSettingsAction,
  getMe,
  toastAction,
} from './auth';
import { SOCKET_URL } from '../api/utils';
import {
  newMessageAction,
  typeStateChangeAction,
  getConversation,
  getConversations,
} from './messages';
import { navigateResetMessage, navigatePush, navigateResetHome } from './nav';
import {
  getMyJourney,
  getMyJourneyStep,
  getJourneyInvites,
  getMyJourneys,
  getMyJourneySteps,
} from './journeys';
import callApi, { REQUESTS } from './api';
import { SET_OVERLAY, PUSH_PERMISSION } from '../constants';
import { isEquivalentObject } from '../utils/common';
import theme from '../theme';
import Permissions from '../utils/permissions';
import Notifications from '../utils/notifications';
import { VIDEO_CONTENT_TYPES } from '../containers/VideoContentWrap';

// Push notification Android error
// https://github.com/zo0r/react-native-push-notification/issues/495

const WEBSOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

let ws = null;

export const NAMESPACES = {
  MESSAGE: 'messenger:conversation:message',
  ADVENTURE: 'platform:organization:adventure:challenge',
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

export function checkAndRunSockets() {
  return (dispatch, getState) => {
    if (ws && ws.readyState === WEBSOCKET_STATES.OPEN) return;
    if (getState().auth.cableId) {
      dispatch(setupSocketAction(getState().auth.cableId));
    } else if (getState().auth.pushId) {
      dispatch(establishCableDevice(getState().auth.pushId));
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
      return;
    }
    // Do a try/catch just to stop any errors
    try {
      ws = new WebSocket(`${SOCKET_URL}cable?access_token=${token}`);

      if (ws) {
        // LOG('setting up sockets');
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
              LOG(
                'websocket state not open, cannot send: Websocket readyState',
                ws.readyState,
              );
            }
          }
        };

        ws.onmessage = e => {
          const data = JSON.parse(e.data) || {};
          const type = data && data.type;
          if (type === 'ping') return;
          if (type === 'welcome') {
            // LOG('socket welcome');
          } else if (data.message) {
            const message = data.message.message;
            const notification = data.message.notification;

            // If we're supposed to toast, show it
            if (data.message['toast?'] && notification.alert) {
              dispatch(toastAction(notification.alert));
            }

            if (
              notification &&
              notification.category === 'CREATE_MESSAGE_CATEGORY'
            ) {
              if (message && message[`adventure_message?`]) {
                dispatch(getMyJourneys());
              }
              dispatch(newMessageAction(message));
            } else if (
              notification &&
              (notification.category === 'CREATE_TYPESTATE_CATEGORY' ||
                notification.category === 'DESTROY_TYPESTATE_CATEGORY')
            ) {
              dispatch(typeStateChangeAction(data.message));
            } else if (
              notification &&
              (notification.category === 'CREATE_CHALLENGE_CATEGORY' ||
                notification.category === 'CREATE_ADVENTURE_CATEGORY')
            ) {
              dispatch(getMe());
            } else if (
              notification &&
              notification.category === 'JOIN_JOURNEY_CATEGORY'
            ) {
              dispatch(getJourneyInvites());
              dispatch(getMyJourneys());
            } else if (
              notification &&
              notification.category === 'COMPLETE_STEP_CATEGORY'
            ) {
              const journeyId = (message.journey || {}).id;
              if (journeyId) {
                dispatch(getMyJourneys());
                dispatch(getMyJourneySteps((message.journey || {}).id));
              }
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
          LOG(
            'websocket state not open, cannot close: Websocket readyState',
            ws.readyState,
          );
        }
      }
    } catch (socketErr) {
      // Do nothing with the error
      LOG('socket error in close', socketErr);
    }
  };
}

export function destroyDevice(cableId, token) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
      access_token: token,
    };
    return dispatch(callApi(REQUESTS.DESTROY_DEVICE, query)).catch(err => {
      LOG('error destroying device', cableId, err);
    });
  };
}

export function updateDevice(device) {
  return (dispatch, getState) => {
    const cableId = getState().auth.cableId;
    const query = {
      endpoint: `${API_URL}/me/devices/${cableId}`,
    };
    return dispatch(callApi(REQUESTS.UPDATE_DEVICE, query, device)).then(
      results => {
        dispatch(setupSocketAction(results.id));
      },
    );
  };
}

export function getDevices() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_DEVICES));
  };
}

export function gotDeviceToken(token) {
  return (dispatch, getState) => {
    const auth = getState().auth;

    if ((token && !auth.pushToken) || token !== auth.pushToken) {
      dispatch(registerPushToken(token)).then(() => {
        dispatch(establishPushDevice()).then(() => {
          const updatedPushId = getState().auth.pushId;
          dispatch(establishCableDevice(updatedPushId));
        });
      });
    } else if (token && token === auth.pushToken && auth.pushId) {
      dispatch(establishCableDevice(auth.pushId));
    }
  };
}

export function handleNotifications(state, notification) {
  return (dispatch, getState) => {
    let data = notification.data;
    const {
      activeConversationId,
      unReadBadgeCount,
      conversations,
    } = getState().messages;

    // Get the namespace and link differently for ios and android
    let namespace;
    let link;
    if (!theme.isAndroid) {
      // iOS
      if (data && data.data && data.data.namespace) {
        namespace = data.data.namespace;
        link = data.data.link;
      }
    } else if (data) {
      if (data.link) {
        link = data.link;
      }
      if (data.namespace) {
        namespace = data.namespace;
      }
    }

    if (state === 'foreground' && namespace && link) {
      // Foreground
      // If the user receives a push notification while in the app and sockets
      // are not connected, grab the new conversation info
      if (!ws || (ws && ws.readyState !== WEBSOCKET_STATES.OPEN)) {
        // LOG('got foreground notification and socket is closed');
        if (namespace.includes(NAMESPACES.MESSAGE)) {
          const cId = getCID(link);
          if (!cId) return;

          const conversationId = activeConversationId;
          if (conversationId && cId === conversationId) {
            dispatch(getConversation(cId));
          } else {
            dispatch(getConversations());
          }
        } else if (namespace.includes(NAMESPACES.ADVENTURE)) {
          dispatch(getMe());
        }
      }
    } else if (state === 'background') {
      Notifications.setBadge(unReadBadgeCount + 1);
    } else if (state === 'open' && namespace && link) {
      if (
        link.includes('messenger_journeys') &&
        link.includes('messenger_journey_steps')
      ) {
        const jId = getJID(link);
        const sId = getSID(link);
        dispatch(getMyJourney(jId)).then(r => {
          dispatch(getMyJourneyStep(jId, sId)).then(res => {
            dispatch(navigateResetHome());
            dispatch(
              navigatePush('voke.VideoContentWrap', {
                item: r,
                type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
                navToStep: res,
              }),
            );
          });
        });
      } else if (link.includes('messenger_journeys')) {
        const onlyJId = getOnlyJID(link);
        dispatch(getMyJourney(onlyJId)).then(r => {
          dispatch(navigateResetHome());
          dispatch(
            navigatePush('voke.VideoContentWrap', {
              item: r,
              type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
            }),
          );
        });
      } else if (namespace.includes(NAMESPACES.MESSAGE)) {
        const cId = getCID(link);
        if (!cId) return;

        // Check if conversation exists, just use it, otherwise get it
        const conversationExists = conversations.find(c => c.id === cId);
        // After getting the conversation, reset to the message screen
        const navToConv = c =>
          dispatch(
            navigateResetMessage({
              conversation: c,
              forceUpdate: true,
            }),
          );
        if (conversationExists) {
          navToConv(conversationExists);
        } else {
          dispatch(getConversation(cId)).then(results => {
            if (!results || !results.conversation) {
              return;
            }
            navToConv(results.conversation);
          });
        }
      } else if (namespace.includes(NAMESPACES.ADVENTURE)) {
        dispatch(getMe());
      }
    }
  };
}

export function establishDevice() {
  return dispatch => {
    let configs = {
      onRegister(token) {
        // Update redux with the push notification permission value
        let newToken = token;

        if (!theme.isAndroid) {
          newToken = token.token;
        }

        dispatch(gotDeviceToken(newToken));
      },
    };

    if (theme.isAndroid) {
      // Android configs
      configs = {
        ...configs,
        onNotification(state, notification) {
          dispatch(handleNotifications(state, notification));
        },
      };
    } else {
      // iOS configs
      configs = {
        ...configs,
        // (required) Called when a remote or local notification is opened or received
        onNotification(notification) {
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
        },
        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
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

    Notifications.setup(configs);
  };
}

export function establishCableDevice(pushDeviceId) {
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

    if (pushDeviceId) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: pushDeviceId,
          kind: 'cable',
        },
      };
      if (auth.cableId) {
        // UPDATE THE CABLE DEVICE WITH DATA
        dispatch(updateDevice(data));
      } else {
        // CREATE THE CABLE DEVICE WITH DATA
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then(
          results => {
            dispatch(setupSocketAction(results.id));
          },
        );
      }
    } else if (!isEquivalent || (isEquivalent && !auth.cableId)) {
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
        return dispatch(callApi(REQUESTS.CREATE_DEVICE, {}, data)).then(
          results => {
            dispatch(setupSocketAction(results.id));
          },
        );
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
          kind: theme.isAndroid ? 'fcm' : 'apple',
        },
      };
      return dispatch(callApi(REQUESTS.CREATE_PUSH_DEVICE, {}, data));
    }
  };
}

export function enablePushNotifications(forceIfUndetermined = false) {
  return (dispatch, getState) => {
    let token = getState().auth.pushToken;
    Permissions.checkPush().then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      dispatch({ type: PUSH_PERMISSION, permission: response });
      if (response === 'undetermined' && !token) {
        if (forceIfUndetermined) {
          dispatch(establishDevice());
        } else {
          dispatch({ type: SET_OVERLAY, value: 'pushPermissions' });
        }
      } else if (response !== 'authorized') {
        // go to settings
        dispatch(openSettingsAction());
      } else {
        // if it comes back as Authorized then establish the device
        dispatch(establishDevice());
      }
    });
  };
}

export function determinePushOverlay(type = 'pushPermissions') {
  return (dispatch, getState) => {
    const permission = getState().auth.pushPermission;
    if (permission === 'authorized') return;
    dispatch({ type: SET_OVERLAY, value: type });
  };
}
