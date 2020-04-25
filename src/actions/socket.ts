import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// Following https://github.com/react-native-community/push-notification-ios
// - Added these configs: https://d.pr/i/AoUUxy

import { ThunkDispatch } from 'redux-thunk';
import { checkNotifications } from 'react-native-permissions';
import { toastAction } from './info';

import { REDUX_ACTIONS } from '../constants';
import { SOCKET_URL } from './utils';
import st from '../st';
import {
  establishPushDevice,
  establishCableDevice,
  getAdventureStepMessages,
  getAdventureSteps,
  getMyAdventures,
  getAdventuresInvitations,
} from './requests';

type Dispatch = ThunkDispatch<any, any, any>;

// Push notification Android error
// https://github.com/zo0r/react-native-push-notification/issues/495

const WEBSOCKET_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

let ws: any = null;

export const NAMESPACES = {
  MESSAGE: 'messenger:conversation:message',
  ADVENTURE: 'platform:organization:adventure:challenge',
};

// https://docs.vokeapp.com/#cable-device
// The Cable Messaging API allows you to receive events from Voke in real time.
// It is based on Ruby on Rails Action Cable websocket implementation.
export function setupSockets(deviceId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    const { authToken } = getState().auth;
    console.log( "🔌🔌🔌🔌🔌🔌🔌 SETUPSOCKETS > deviceId:", deviceId );
    if (!deviceId || !authToken) return;
    try {
      // Create WS object.
      ws = new WebSocket(`${SOCKET_URL}cable?access_token=${authToken}`);
      if (ws) {
        console.log('🔌 setupSockets > setting up sockets');
        // Socket opened: the connection is ready to send and receive data.
        ws.onopen = (): void => {
          console.log('🔌 setupSockets > socket opened');
          if (ws && ws.send && ws.readyState === WEBSOCKET_STATES.OPEN) {
            try {
              ws.send(
                JSON.stringify({
                  command: 'subscribe',
                  identifier: `{"channel":"DeviceChannel","id":"${deviceId}"}`,
                })
              );
            } catch (e) {
              console.log('error sending websocket object', e);
            }
          } else {
            console.log(
              '🛑 websocket state not open, cannot send: Websocket readyState',
              ws.readyState,
            );
          }
        };
        // Message is received from the server.
        // Example: https://d.pr/i/IvhXzq
        ws.onmessage = e => {
          const data = JSON.parse(e.data) || {};
          const type = data && data.type;

          if (type === 'ping'){ console.log( "."); }
          if (type === 'ping' || type === 'welcome' || !data.message) return;

          const { message, notification } = data.message;
          if (!notification) return;

          console.log('🔌 setupSockets > socket onmessage\n', data);
          // Got a toast message: show it
          if (message['toast?'] && notification.alert) {
            dispatch(toastAction(notification.alert));
          }

          if (notification.category === 'CREATE_MESSAGE_CATEGORY') {
            // When new message posted.
            if (message && message['adventure_message?']) {
              // update unread count on step card.
              const adventureId = (
                getState().data.myAdventures.find(
                  (a: any) => a.conversation.id === message.conversation_id,
                ) || {}
              ).id;
              if (!adventureId) return;
              const currentStep =
                getState().data.adventureSteps[adventureId] || 0;
              dispatch(
                getAdventureStepMessages(
                  message.conversation_id,
                  message.messenger_journey_step_id,
                ),
              );

              // TODO: optimize the next call. It can be expensive?
              // Update adventure steps to mark the current step as completed
              // and unlock the next one.
              dispatch(getAdventureSteps(adventureId));
              // TODO: Review the next action?
              /* dispatch({
                type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
                update: {
                  adventureStepId: message.messenger_journey_step_id,
                  adventureId: adventureId,
                  fieldsToUpdate: {
                    unread_messages: currentStep.unread_messages + 1,
                  },
                },
              }); */
            }
            // dispatch(newMessageAction(message));
          } else if (
            notification.category === 'CREATE_TYPESTATE_CATEGORY' ||
            notification.category === 'DESTROY_TYPESTATE_CATEGORY'
          ) {
            // dispatch(typeStateChangeAction(data.message));
          } else if (
            notification.category === 'JOIN_JOURNEY_CATEGORY'
          ) {
            dispatch(getAdventuresInvitations());
            dispatch(getMyAdventures());
            // dispatch(getJourneyInvites());
            // dispatch(getMyJourneys());
          } else if (
            notification.category === 'COMPLETE_STEP_CATEGORY'
          ) {
            const journeyId = (message.journey || {}).id;
            if (journeyId) {
              // dispatch(getMyJourneys());
              // dispatch(getMyJourneySteps((message.journey || {}).id));
            }
          }
        };

        ws.onerror = (err) => {
          // an error occurred
          console.log( "🛑 socket error\n", err.message);
        };

        ws.onclose = (err) => {
          // connection closed
          console.log('🛑 socket closed\n', err.code, err.reason );
        };
      } else {
        console.log( "🛑 WebSocket Error" );
      }
    } catch (socketErr) {
      // Do nothing with the error
      console.log( "🛑 socketErr:\n" , socketErr );
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
          console.log(
            'websocket state not open, cannot close: Websocket readyState',
            ws.readyState,
          );
        }
      }
    } catch (socketErr) {
      // Do nothing with the error
      console.log('socket error in close', socketErr);
    }
  };
}

// Push token generated by device when notifications open and configured in
// PushNotification.onRegister()
export function gotPushToken(newPushToken: any) {
  return async (dispatch: Dispatch, getState: any) => {
    if (!newPushToken) return;
    const { pushToken, pushDeviceId } = getState().auth;
    let newPushDeviceId = null;

    // TODO: do we really need first condition here?
    if ( !pushToken || newPushToken !== pushToken) {
      // Save new push token in the store.
      dispatch({
        type: REDUX_ACTIONS.SET_PUSH_TOKEN,
        pushToken: token,
      });
      // FIRST: REGISTER DEVICE ON THE SERVER FOR PUSH NOTIFICATIONS.
      // Register new push token on the remote server.
      newPushDeviceId = await dispatch(establishPushDevice(newPushToken));
      // Save returned by the server pushDeviceId in the store.
      dispatch({
        type: REDUX_ACTIONS.SET_PUSH_DEVICE_ID,
        deviceId: newPushDeviceId,
      });
      // await dispatch(establishCableDevice(newPushDevice.id));
    }

    if ( !newPushDeviceId ) {
      newPushDeviceId = pushDeviceId;
    }

    if (newPushDeviceId) {
      // THEN: REGISTER DEVICE ON THE SERVER FOR WEBSOCKETS.
      await dispatch(establishCableDevice(newPushDeviceId));
    }
  };
}

export function handleNotifications(
  state: string,
  notification: { data?: any },
) {
  return async (dispatch: Dispatch, getState: any) => {
    let data = notification.data;
    // const {
    //   activeConversationId,
    //   unReadBadgeCount,
    //   conversations,
    // } = getState().messages;

    // Get the namespace and link differently for ios and android
    let namespace;
    let link;
    if (!st.isAndroid) {
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
          // const cId = getCID(link);
          // if (!cId) return;
          // const conversationId = activeConversationId;
          //   if (conversationId && cId === conversationId) {
          //     dispatch(getConversation(cId));
          //   } else {
          //     dispatch(getConversations());
          //   }
          // } else if (namespace.includes(NAMESPACES.ADVENTURE)) {
          //   dispatch(getMe());
          // }
        }
      } else if (state === 'background') {
        // Notifications.setBadge(unReadBadgeCount + 1);
      } else if (state === 'open' && namespace && link) {
        if (
          link.includes('messenger_journeys') &&
          link.includes('messenger_journey_steps')
        ) {
          // const jId = getJID(link);
          // const sId = getSID(link);
          // dispatch(getMyJourney(jId)).then(r => {
          //   dispatch(getMyJourneyStep(jId, sId)).then(res => {
          //     dispatch(navigateResetHome());
          //     dispatch(
          //       navigatePush('voke.VideoContentWrap', {
          //         item: r,
          //         type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
          //         navToStep: res,
          //       }),
          //     );
          //   });
          // });
        } else if (link.includes('messenger_journeys')) {
          // const onlyJId = getOnlyJID(link);
          // dispatch(getMyJourney(onlyJId)).then(r => {
          //   dispatch(navigateResetHome());
          //   dispatch(
          //     navigatePush('voke.VideoContentWrap', {
          //       item: r,
          //       type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
          //     }),
          //   );
          // });
        } else if (namespace.includes(NAMESPACES.MESSAGE)) {
          // // const cId = getCID(link);
          // if (!cId) return;
          // Check if conversation exists, just use it, otherwise get it
          // const conversationExists = conversations.find(c => c.id === cId);
          // After getting the conversation, reset to the message screen
          // const navToConv = c =>
          //   dispatch(
          //     navigateResetMessage({
          //       conversation: c,
          //       forceUpdate: true,
          //     }),
          //   );
          // if (conversationExists) {
          //   navToConv(conversationExists);
          // } else {
          //   dispatch(getConversation(cId)).then(results => {
          //     if (!results || !results.conversation) {
          //       return;
          //     }
          //     navToConv(results.conversation);
          //   });
          // }
        } else if (namespace.includes(NAMESPACES.ADVENTURE)) {
          // dispatch(getMe());
        }
      }
    }
  };
}

export function establishDevice(): Promise<void> {
  return async (dispatch: Dispatch, getState: any) => {
    console.log( "👺EXPORT FUNCTION ESTABLISHDEVICE" );
    // Shared configs for both Android and iOS.
    let configs: any = {
      // (optional) Called when Token is generated (iOS and Android)
      // Push token generated by device when notifications open and configured.
      onRegister(token: { token: any }) {
        console.log( "function establishDevice > PushNotification.onRegister(newPushToken)" , newPushToken );
        // Update redux with the push notification permission value
        let newPushToken = token;
        dispatch({
          type: REDUX_ACTIONS.PUSH_PERMISSION,
          permission: 'granted',
        });
        if (!st.isAndroid) {
          newPushToken = token.token;
        }
        dispatch(gotPushToken(newPushToken));
      },
    };

    if (st.isAndroid) {
      // Android only configs
      configs = {
        ...configs,
        onNotification(state: string, notification: { data: any }) {
          dispatch(handleNotifications(state, notification));
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

          notification.finish(PushNotificationIOS.FetchResult.NoData);
          // https://github.com/react-native-community/push-notification-ios#update-appdelegateh

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
export function permissionsAndSockets( askPermission = false) {
  console.log( "👺permissionsAndSockets" );
  return async (dispatch: Dispatch, getState: any) => {
    let pushToken = getState().auth.pushToken;

    // Check notifications permission status and get notifications settings.
    // https://d.pr/bbVk5I
    checkNotifications().then(({ status }: { status: PermissionStatus }) => {
      // Save current premissions status in
      // store.info.pushNotificationPermission
      dispatch({
        type: REDUX_ACTIONS.PUSH_PERMISSION,
        permission: status, // 'unavailable' | 'denied' | 'blocked' | 'granted'
      });

      // if (status === 'blocked') {
        // User selected: DON'T ALLOW notifications.
        // console.log( "👺PUSH_PERMISSION = blocked" );
        // console.log( "👺BEFORE establishCableDevice" );
        // dispatch(establishCableDevice());
        // console.log( "👺AFTER establishCableDevice" );
      if ( status === 'granted' || (status === 'denied' && askPermission) ) {
        // User  selected: ALLOW notifications.
        console.log( "👺PUSH_PERMISSION = granted" );
        console.log( "👺BEFORE establishDevice" );
        dispatch(establishDevice());
        console.log( "👺AFTER establishDevice" );

      // } else if (status === 'denied') {
        // console.log( "👺PUSH_PERMISSION = denied" );
      // } else if (status === 'unavailable') {
      //  console.log( "👺PUSH_PERMISSION = unavailable" );
      } else {
        // User selected: DON'T ALLOW notifications.
        // blocked
        console.log( "👺PUSH_PERMISSION = ELSE" );
        console.log( "👺BEFORE establishCableDevice" );
        dispatch(establishCableDevice());
        console.log( "👺AFTER establishCableDevice" );
      }

      /* if (status === 'granted') {
        console.log( "👺BEFORE establishDevice" );
        dispatch(establishDevice());
        console.log( "👺AFTER establishDevice" );
      } else {
        console.log( "👺BEFORE establishCableDevice" );
        dispatch(establishCableDevice());
        console.log( "👺AFTER establishCableDevice" );
      } */
    });
  };
}

/* export function enablePushNotifications(forceIfUndetermined = false) {
  return async (dispatch: Dispatch, getState: any) => {
    let token = getState().auth.pushToken;
    checkNotifications().then(({ status }: { status: PermissionStatus }) => {
      dispatch({
        type: REDUX_ACTIONS.PUSH_PERMISSION,
        permission: status,
      });
      if (status === 'unavailable' && !token) {
        if (forceIfUndetermined) {
          dispatch(establishDevice());
        } else {
          // dispatch({
          //   type: SET_OVERLAY,
          //   value: 'pushPermissions',
          // });
        }
      } else if (status !== 'granted') {
        // go to settings
        //  dispatch(openSettingsAction());
      } else {
        // if it comes back as Authorized then establish the device
        dispatch(establishDevice());
      }
    });
  };
} */

