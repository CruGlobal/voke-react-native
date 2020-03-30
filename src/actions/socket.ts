import { REDUX_ACTIONS } from '../constants';
import { SOCKET_URL } from './utils';
import Notifications from 'react-native-push-notification';

import { ThunkDispatch } from 'redux-thunk';
import { checkNotifications } from 'react-native-permissions';

import { toastAction } from './info';
import st from '../st';
import {
  registerPushToken,
  establishPushDevice,
  establishCableDevice,
  getAdventureStepMessages,
} from './requests';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

type Dispatch = ThunkDispatch<any, any, any>;

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

export function setupSockets(cableId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    if (!cableId) return;
    const authToken = getState().auth.authToken;
    if (!authToken) {
      return;
    }
    try {
      ws = new WebSocket(`${SOCKET_URL}cable?access_token=${authToken}`);
      if (ws) {
        console.log('setting up sockets');
        ws.onopen = () => {
          console.log('socket opened');
          const obj = {
            command: 'subscribe',
            identifier: `{"channel":"DeviceChannel","id":"${cableId}"}`,
          };
          if (ws && ws.send) {
            if (ws.readyState === WEBSOCKET_STATES.OPEN) {
              try {
                ws.send(JSON.stringify(obj));
              } catch (e) {
                console.log('error sending websocket object', e);
              }
            } else {
              console.log(
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
            // console.log('socket welcome');
          } else if (data.message) {
            const message = data.message.message;
            const notification = data.message.notification;
            console.log(data);
            // If we're supposed to toast, show it
            if (message['toast?'] && notification.alert) {
              dispatch(toastAction(notification.alert));
            }

            if (
              notification &&
              notification.category === 'CREATE_MESSAGE_CATEGORY'
            ) {
              if (message && message[`adventure_message?`]) {
                // update unready count on step card.
                const adventureId = (
                  getState().data.myAdventures.find(
                    (a: any) => a.conversation.id === message.conversation_id,
                  ) || {}
                ).id;
                const currentStep = getState().data.adventureSteps[adventureId];
                dispatch(
                  getAdventureStepMessages(
                    message.conversation_id,
                    message.messenger_journey_step_id,
                  ),
                );

                dispatch({
                  type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
                  update: {
                    adventureStepId: message.messenger_journey_step_id,
                    adventureId: adventureId,
                    fieldsToUpdate: {
                      unread_messages: currentStep.unread_messages + 1,
                    },
                  },
                });
              }
              // dispatch(newMessageAction(message));
            } else if (
              notification &&
              (notification.category === 'CREATE_TYPESTATE_CATEGORY' ||
                notification.category === 'DESTROY_TYPESTATE_CATEGORY')
            ) {
              // dispatch(typeStateChangeAction(data.message));
            } else if (
              notification &&
              notification.category === 'JOIN_JOURNEY_CATEGORY'
            ) {
              // dispatch(getJourneyInvites());
              // dispatch(getMyJourneys());
            } else if (
              notification &&
              notification.category === 'COMPLETE_STEP_CATEGORY'
            ) {
              const journeyId = (message.journey || {}).id;
              if (journeyId) {
                // dispatch(getMyJourneys());
                // dispatch(getMyJourneySteps((message.journey || {}).id));
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

export function gotDeviceToken(token: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const auth = getState().auth;

    if ((token && !auth.pushToken) || token !== auth.pushToken) {
      await dispatch(registerPushToken(token));
      const newPushDevice: any = await dispatch(establishPushDevice());
      await dispatch({
        type: REDUX_ACTIONS.SET_PUSH_DEVICE_ID,
        deviceId: newPushDevice.id,
      });
      await dispatch(establishCableDevice(newPushDevice.id));
    } else if (token && token === auth.pushToken && auth.pushDeviceId) {
      dispatch(establishCableDevice(auth.pushDeviceId));
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

export function establishDevice() {
  return async (dispatch: Dispatch, getState: any) => {
    let configs: any = {
      onRegister(token: { token: any }) {
        // Update redux with the push notification permission value
        let newToken = token;
        dispatch({
          type: REDUX_ACTIONS.PUSH_PERMISSION,
          permission: 'authorized',
        });
        if (!st.isAndroid) {
          newToken = token.token;
        }
        dispatch(gotDeviceToken(newToken));
      },
    };

    if (st.isAndroid) {
      // Android configs
      configs = {
        ...configs,
        onNotification(state: string, notification: { data: any }) {
          dispatch(handleNotifications(state, notification));
        },
      };
    } else {
      // iOS configs
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

    Notifications.configure(configs);
  };
}

type PermissionStatus = 'unavailable' | 'denied' | 'blocked' | 'granted';
export function enablePushNotifications(forceIfUndetermined = false) {
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
}

export function checkForPermissionsAndSetupSockets() {
  return async (dispatch: Dispatch, getState: any) => {
    checkNotifications().then(({ status }: { status: PermissionStatus }) => {
      dispatch({
        type: REDUX_ACTIONS.PUSH_PERMISSION,
        permission: status,
      });
      if (status === 'granted') {
        dispatch(establishDevice());
      } else {
        dispatch(establishCableDevice());
      }
    });
  };
}
