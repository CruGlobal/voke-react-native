import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// Following https://github.com/react-native-community/push-notification-ios
// - Added these configs: https://d.pr/i/AoUUxy

import { ThunkDispatch } from 'redux-thunk';
import { checkNotifications, openSettings } from 'react-native-permissions';
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

// let ws: any = null;

export const NAMESPACES = {
  MESSAGE: 'messenger:conversation:message',
  ADVENTURE: 'platform:organization:adventure:challenge',
};

// https://docs.vokeapp.com/#cable-device
// The Cable Messaging API allows you to receive events from Voke in real time.
// It is based on Ruby on Rails Action Cable websocket implementation.
export const createWebSocketMiddleware =  ({ dispatch, getState }) => {
  let ws: any = null;

  return next => action => {
    // Open WebSockets on STARTUP redux action.
    if (action.type === 'STARTUP') {
      const { authToken } = getState().auth;
      const deviceId = getState().auth.device.id;

      if (deviceId && authToken) {
        try {
          // Create WS object.
          ws = new WebSocket(`${SOCKET_URL}cable?access_token=${authToken}`);
          if (ws) {
            console.log('🔌 setupSockets > setting up sockets', ws);
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
                } finally {
                  // TODO: Update data.
                  console.log('TODO PULL FRESH DATA FROM THE SERVER.')
                }
              } else {
                console.log(
                  '🛑 websocket state not open, cannot send: Websocket readyState',
                  ws.readyState,
                );
              }
            };
            // Message received from the server.
            // Example: https://d.pr/i/IvhXzq
            ws.onmessage = e => {
              const data = JSON.parse(e.data) || {};
              const type = data && data.type;

              if (type === 'ping'){ console.log( "."); }
              if (type === 'ping' || type === 'welcome' || !data.message) return;
              console.log( "🐸 data.message:", data.message );

              const { message, notification } = data.message;
              if (!notification) return;

              console.log('🔌 setupSockets > socket onmessage\n', data);
              // Got a toast message: show it
              // There are 2 types of WS notifications that have the toast? field:
              // -- Journey: dispatched when a friend joins the journey
              //    or when the journey gets completed
              // -- Step: dispatched when a friend answers or completes the step
              if (message['toast?'] && notification.alert) {
                // dispatch(toastAction(notification.alert));
                dispatch(toastAction(notification.alert));
              }

              if (notification.category === 'CREATE_MESSAGE_CATEGORY') {
                // When new message posted by another user.
                if (message && message['adventure_message?']) {
                  // If updated message in one of the Adventures.
                  // Update unread count on the Adventure step card.
                  const adventureId = (
                    getState().data.myAdventures.find(
                      (adv: any) => adv.conversation.id === message.conversation_id,
                    ) || {}
                  ).id;
                  console.log( "😰 adv.conversation.id to update:", adventureId );
                  console.log( "🐸 message:", message );
                  if (!adventureId) return;
                  /* const currentStep =
                    getState().data.adventureSteps[adventureId] || 0; */
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
              } else if (
                notification.category === 'CREATE_INTERACTION_CATEGORY'
                // Ofthen used with 'message ✅read' status.
              ) {

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
      }

    }

    if (action.type === 'OPEN_SOCKETS') {
      console.log( "🐸 ws :", ws  );

      // Do a try/catch just to stop any errors
      try {
        if ( !ws || !ws.send || ws.readyState !== WEBSOCKET_STATES.OPEN) {
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
  }
}


export function openSocketAction(deviceId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    await dispatch({ type: REDUX_ACTIONS.OPEN_SOCKETS });
  };
}

/*
NOT NEEDED FOR NOW, BUT LEAVE IT HERE.
export function closeSocketAction() {
  return () => {
    // Do a try/catch just to stop any errors
    try {
      if (ws) {
        ws.close(undefined, 'client closed');
        ws = null; //  to avoid multiply ws objects and eventHandligs;
      }
    } catch (socketErr) {
      // Do nothing with the error
      console.log('socket error in close', socketErr);
    }
  };
}
 */