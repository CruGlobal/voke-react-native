import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import lodash from 'lodash';
// Following https://github.com/react-native-community/push-notification-ios
// - Added these configs: https://d.pr/i/AoUUxy

import { ThunkDispatch } from 'redux-thunk';
import { checkNotifications, openSettings } from 'react-native-permissions';
import { Vibration } from 'react-native';

import { REDUX_ACTIONS } from '../constants';
import st from '../st';

import { SOCKET_URL } from './utils';
import { toastAction } from './info';
import {
  getAdventureStepMessages,
  getAdventureSteps,
  getMyAdventures,
  getAdventuresInvitations,
  getNotifications,
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

// let ws: any = null;

export const NAMESPACES = {
  MESSAGE: 'messenger:conversation:message',
  ADVENTURE: 'platform:organization:adventure:challenge',
};

// https://docs.vokeapp.com/#cable-device
// The Cable Messaging API allows you to receive events from Voke in real time.
// It is based on Ruby on Rails Action Cable websocket implementation.
export const createWebSocketMiddleware = ({ dispatch, getState }) => {
  // let ws: any = null;

  return next => action => {
    // Open WebSockets on STARTUP redux action.
    if (action.type === 'STARTUP' || action.type === 'SET_DEVICE') {
      // Check if we have websockets already defined and running in the memory.
      // Otherwise it will create new ws object on every file save while in dev.
      if (
        global.ws &&
        global.ws.send &&
        global.ws.readyState === WEBSOCKET_STATES.OPEN
      ) {
        return;
      }

      const { authToken } = getState().auth;
      const deviceId = getState().auth.device.id;

      if (deviceId && authToken) {
        try {
          // Create WS object.
          global.ws = new WebSocket(
            `${SOCKET_URL}cable?access_token=${authToken}`,
          );
          if (global.ws) {
            console.log('🔌 setupSockets > setting up sockets', global.ws);
            // Socket opened: the connection is ready to send and receive data.
            global.ws.onopen = (): void => {
              console.log('🔌 setupSockets > socket opened');
              if (
                global.ws &&
                global.ws.send &&
                global.ws.readyState === WEBSOCKET_STATES.OPEN
              ) {
                try {
                  global.ws.send(
                    JSON.stringify({
                      command: 'subscribe',
                      identifier: `{"channel":"DeviceChannel","id":"${deviceId}"}`,
                    }),
                  );
                } catch (e) {
                  console.log('error sending websocket object', e);
                } finally {
                  // Update data every time sockets reopenned.
                  // Don't do it here. We have wake-up action for that.
                  /*  dispatch(getAdventuresInvitations());
                  dispatch(getMyAdventures()); */

                  // Get notifications every time sockets connections reestablished.
                  dispatch(getNotifications());
                }
              } else {
                console.log(
                  '🛑 websocket state not open, cannot send: Websocket readyState',
                  global.ws.readyState,
                );
              }
            };
            // Message received from the server.
            // Example: https://d.pr/i/IvhXzq
            global.ws.onmessage = e => {
              const data = JSON.parse(e.data) || {};
              const type = data && data.type;

              if (type === 'ping') {
                console.log('.');
              }
              if (type === 'ping' || type === 'welcome' || !data.message)
                return;

              const { message, notification } = data.message;
              if (!notification) return;
              if (message.action === 'read') return; // Ignore 'read' interactions.

              console.log('🔌 setupSockets > socket onmessage');
              console.log('💬 notification / message:', notification, message);
              // Got a toast message: show it
              // There are 2 types of WS notifications that have the toast? field:
              // -- Journey: dispatched when a friend joins the journey
              //    or when the journey gets completed
              // -- Step: dispatched when a friend answers or completes the step
              if (message['toast?'] && notification.alert) {
                const currentScreen = getState().info?.currentScreen?.screen;
                const adventureStepId = getState().info?.currentScreen?.data
                  ?.adventureStepId;
                const { videoIsPlaying } = getState().info;
                let showToast = true;

                // Don't show toasts for new messages
                // in the current chat/conversation,
                // or when any video is playing.
                if (
                  videoIsPlaying ||
                  (currentScreen === 'AdventureStepScreen' &&
                    adventureStepId === message.messenger_journey_step_id)
                ) {
                  showToast = false;
                }

                if (showToast) {
                  dispatch(toastAction(notification.alert));
                }
              }

              if (notification.category === 'CREATE_MESSAGE_CATEGORY') {
                // When new message posted by another user.
                if (message && message['adventure_message?']) {
                  // If updated message in one of the Adventures.
                  // Update unread count on the Adventure step card.
                  const adventureId = (
                    lodash.find(
                      getState().data.myAdventures?.byId,
                      // TODO try to optimize
                      function (adv) {
                        return adv.conversation.id === message.conversation_id;
                      },
                    ) || {}
                  ).id;

                  if (message.kind === 'text' && adventureId !== undefined) {
                    // If simple text: save new message in the store
                    // without requesting update from the server via API.
                    // BUT only if we have conversation array ready
                    // for that message ( adventureId !== undefined ).
                    dispatch({
                      type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
                      message,
                      adventureId,
                      description: 'From sockets > onmessage()',
                    });

                    if (message.kind === 'text' && message?.content) {
                      dispatch(vibrateAction());
                    }
                  } else {
                    dispatch(getMyAdventures('Sockets - New Message'));
                    // If not just a text: update messages in conversation
                    // via extra call to API.
                    dispatch(
                      getAdventureStepMessages(
                        message.conversation_id,
                        message.messenger_journey_step_id,
                      ),
                    );
                  }

                  // TODO: optimize the next call. It can be expensive?
                  // Update adventure steps to mark the current step as completed
                  // and unlock the next one.
                  // (Need short timeout to not conflict with Mark As Read functionality)
                  if (adventureId !== undefined) {
                    setTimeout(
                      () => dispatch(getAdventureSteps(adventureId)),
                      500,
                    );
                  }
                } else {
                  if (message?.messenger_journey_step_id === null) {
                    // New notification for 'Notifications' tab.
                    // Update notifications.
                    dispatch(getNotifications());
                  }
                }
              } else if (
                notification.category === 'CREATE_TYPESTATE_CATEGORY' ||
                notification.category === 'DESTROY_TYPESTATE_CATEGORY'
              ) {
                // dispatch(typeStateChangeAction(data.message));
              } else if (notification.category === 'JOIN_JOURNEY_CATEGORY') {
                // FRIEND JOINED OUR ADVENTURE.
                dispatch(getAdventuresInvitations());
                dispatch(getMyAdventures('Sockets'));
                dispatch(getNotifications());
              } else if (notification.category === 'COMPLETE_STEP_CATEGORY') {
                const journeyId = (message.journey || {}).id;
                if (journeyId) {
                  // dispatch(getMyJourneys());
                  // dispatch(getMyJourneySteps((message.journey || {}).id));
                }
              } else if (
                notification.category === 'CREATE_INTERACTION_CATEGORY'
                // Ofthen used with 'message ✅read' status.
              ) {
              }
            };

            global.ws.onerror = error => {
              // an error occurred
              console.log('🛑 socket error\n', error.message);
              // throw error;
              // Try to restart:
              /* dispatch({
                type: REDUX_ACTIONS.STARTUP,
              }); */
            };

            global.ws.onclose = error => {
              // connection closed
              console.log('🛑 socket closed\n', error.code, error.reason);
            };
          } else {
            console.log('🛑 WebSocket Error');
            throw 'WebSocket Error';
          }
        } catch (socketErr) {
          // Do nothing with the error
          console.log('🛑 socketErr:\n', socketErr);
          // Try to restart:
          /* dispatch({
            type: REDUX_ACTIONS.STARTUP,
          }); */
        }
      }
    }

    if (action.type === 'OPEN_SOCKETS') {
      // Do a try/catch just to stop any errors
      try {
        if (
          !global.ws ||
          !global.ws.send ||
          global.ws.readyState !== WEBSOCKET_STATES.OPEN
        ) {
          // If can't open connection then reinstall websockets connection.
          dispatch({
            type: REDUX_ACTIONS.STARTUP,
          });
        } else {
          console.log('sockets are ok');
        }
      } catch (socketErr) {
        console.log('socket error in open action', socketErr);
      }
    }

    return next(action);
  };
};

export function openSocketAction(deviceId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    await dispatch({ type: REDUX_ACTIONS.OPEN_SOCKETS });
  };
}

/*
Close the sockets when app goes into background.
Need that so backend knows when to send push notifications instead of cabel.
*/
export function closeSocketAction() {
  return () => {
    // Do a try/catch just to stop any errors
    try {
      if (global.ws) {
        global.ws.close(undefined, 'client closed');
        global.ws = null; //  to avoid multiply ws objects and eventHandligs;
        console.log('sockets closed', global.ws);
      }
    } catch (socketErr) {
      // Do nothing with the error
      console.log('socket error in close', socketErr);
    }
  };
}

export function vibrateAction() {
  return () => {
    // Vibrate when receiving a new message
    Vibration.vibrate(100);
  };
}
