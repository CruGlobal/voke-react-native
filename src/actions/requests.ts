import { ThunkDispatch } from 'redux-thunk';
import deviceInfoModule from 'react-native-device-info';
import { Platform } from 'react-native';
import { debounce } from 'lodash';
import { REDUX_ACTIONS } from 'utils/constants';
import st from 'utils/st';
import request from 'actions/utils';
import { isEqualObject, exists } from 'utils';
import { TAdventureSingle, TError, TAdventures, TDataState } from 'utils/types';
import { AsyncAction } from 'reducers';
import { Action } from 'redux';

import { DataKeys } from '../reducers/data';
import { AuthDataKeys } from '../reducers/auth';

import { setAppIconBadgeNumber } from './notifications';
import ROUTES from './routes';

// type Dispatch = ThunkDispatch<any, any, any>;
type Dispatch = ThunkDispatch<TDataState, void, Action>;

export function setUser(userData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    // Reducer expects the root object to be user.
    let newUserData = userData;

    // Access token is missing from some of the server replies. Recreate it.
    if (!exists(userData?.access_token?.access_token)) {
      const { auth } = getState();

      newUserData = {
        ...newUserData,
        access_token: {
          access_token: auth.authToken,
        },
      };
    }

    // Update unread broadcast notifications counter.
    dispatch({
      type: REDUX_ACTIONS.UPDATE_NOTIFICATION_UNREAD_BADGE,
      count: newUserData?.user?.pending_notifications || 0,
    });

    return dispatch({
      type: REDUX_ACTIONS.SET_USER,
      user: newUserData,
    });
  };
}

export function getNotificationsTabUnreads() {
  return async (dispatch, getState) => {
    // Fetch user data from the server.
    return await request({
      ...ROUTES.GET_ME,
      authToken: getState().auth.authToken,
    }).then(
      userData => {
        // eslint-disable-next-line no-console
        const newNotificationsCounter = userData?.pending_notifications || 0;
        // Update unread broadcast notifications counter.
        dispatch({
          type: REDUX_ACTIONS.UPDATE_NOTIFICATION_UNREAD_BADGE,
          count: newNotificationsCounter,
        });

        return newNotificationsCounter;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('👤 getNotificationsTabUnreads > Fetch error', error);
        throw error;
      },
    );
  };
}

export function setData(key: DataKeys, data: any) {
  return {
    type: REDUX_ACTIONS.SET_DATA,
    key,
    data,
  };
}

export function setAuthData(key: AuthDataKeys, data: any) {
  return {
    type: REDUX_ACTIONS.SET_AUTH_DATA,
    key,
    data,
  };
}

interface AdventuresResult {
  organization_journeys: TAdventures;
  _links: {
    first: {
      href: string;
      page_number: number;
    } | null;
    previous: {
      href: string;
      page_number: number;
    } | null;
    self: {
      href: string;
      page_number: number;
    } | null;
    next: null;
    last: {
      href: string;
      page_number: number;
    } | null;
    root: {
      href: string;
      total_pages: number;
      total_count: number;
      limit_value: number;
    };
  };
}

export function getAvailableAdventures(languageCode = 'en'): AsyncAction<void> {
  return async (dispatch, getState): Promise<void> => {
    try {
      const results = await request<AdventuresResult>({
        ...ROUTES.GET_AVAILABLE_ADVENTURES,
        params: { language_code: languageCode.toUpperCase() },
        authToken: getState().auth.authToken,
        description: 'Get Available Adventures',
      });
      if (results?.organization_journeys) {
        const adventures = results?.organization_journeys;
        dispatch(setData('availableAdventures', adventures));
      }
    } catch (error) {
      console.log(
        'Error downloading adventures (language:' + languageCode + '):',
        error,
      );
    }
  };
}

/**
 * Get active adventures.
 */
export function getMyAdventures(comment = '') {
  return async (dispatch: Dispatch, getState: any) => {
    await request({
      ...ROUTES.GET_MY_ADVENTURES,
      description: 'Get My Adventures. Called from ' + comment,
      authToken: getState().auth.authToken,
    }).then(
      data => {
        const myAdventures = data.journeys;
        // Update my adventures in store.
        // return dispatch(setData('myAdventures', myAdventures));
        dispatch({
          type: REDUX_ACTIONS.UPDATE_ADVENTURES,
          data: myAdventures,
          description: 'Update myAdventure In Store. Called from ' + comment,
        });

        return dispatch(updateTotalUnreadCounter());
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 getMyAdventures error', error);
        throw error;
      },
    );
  };
}

// Used only when clicking 'get started' on adventure invite
// for fetching pendign adventure.
// For performance considerations we save it with other adventures in store.
// It's not listed with other adventures as it have status: "pending"
export function getMyAdventure(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    await request({
      ...ROUTES.GET_MY_ADVENTURE,
      pathParams: { adventureId },
      authToken: getState().auth.authToken,
      description: 'Get My Adventure',
    }).then(
      data => {
        // const myAdventures = data.journeys;
        // Add pending adventure to store.
        dispatch({
          type: REDUX_ACTIONS.UPDATE_ADVENTURE,
          data: data,
          description: 'Update single adventure In Store',
        });

        return data;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 getMyAdventure error', error);
        throw error;
      },
    );
  };
}

export function getAdventuresInvitations() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await request({
      ...ROUTES.GET_ADVENTURE_INVITATIONS,
      authToken: getState().auth.authToken,
      description: 'Get Adventures Invitations',
    });
    const adventureInvitations = results.journey_invites;
    dispatch({
      type: REDUX_ACTIONS.UPDATE_INVITATIONS,
      data: adventureInvitations,
      description: 'Update Invitations In Store',
    });
    return results;
  };
}

export function acceptAdventureInvitation(adventureCode: string) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await request({
      ...ROUTES.ACCEPT_ADVENTURE_INVITATION,
      data: { code: adventureCode },
      authToken: getState().auth.authToken,
      description: 'Accept Adventure Invitation',
    });
    await dispatch(getMyAdventures('Accept Adventure Invitation'));
    return results;
  };
}

// Iterate through adventures to find total number of unread messages.
export function updateTotalUnreadCounter() {
  return async (dispatch: Dispatch, getState: any) => {
    const myAdventures = getState().data.myAdventures.byId;
    let unreadTotal = 0;
    for (const [key, value] of Object.entries(myAdventures)) {
      unreadTotal += value.conversation.unread_messages;
    }
    // Update app icon counter.
    setAppIconBadgeNumber(unreadTotal);

    return dispatch({
      type: REDUX_ACTIONS.UPDATE_UNREAD_TOTAL,
      data: unreadTotal,
      description: 'Update Unread Total Counter',
    });
  };
}

// We are calling for updated adventure steps after each message,
// that can be expensive so we have to debounce this action.
const getAdventureStepsDebounced = debounce(
  async (dispatch, getState, adventureId) => {
    const results: any = await request({
      ...ROUTES.GET_ADVENTURE_STEPS,
      pathParams: { adventureId },
      authToken: getState().auth.authToken,
      description: 'Get Adventure Steps',
    });
    const adventureSteps = results.steps;
    dispatch({
      type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEPS,
      result: { adventureId, adventureSteps },
      description: 'Get Adventure Steps',
    });

    dispatch(getMyAdventure(adventureId));
    dispatch(updateTotalUnreadCounter());

    return results;
  },
  2000,
  { leading: true, trailing: true },
);

export function getAdventureSteps(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    return await getAdventureStepsDebounced(dispatch, getState, adventureId);
  };
}

export function getAdventureStepMessages(
  adventureConversationId: string,
  adventureStepId: string,
) {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const results: any = await request({
        ...ROUTES.GET_ADVENTURE_STEP_MESSAGES,
        pathParams: { adventureConversationId },
        params: adventureStepId
          ? { messenger_journey_step_id: adventureStepId }
          : null,
        authToken: getState().auth.authToken,
        description:
          'Get Adventure Step Messages for conversation id: ' +
          adventureConversationId,
      });
      const adventureStepMessages = results.messages;
      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP_MESSAGES,
        messages: adventureStepMessages,
      });
      return results;
    } catch (error) {
      console.log('getAdventureStepMessages error:', error);
    }
  };
}

export function startAdventure(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await request({
      ...ROUTES.START_ADVENTURE,
      data,
      authToken: getState().auth.authToken,
      description: 'Start Adventure',
    });

    dispatch({
      type: REDUX_ACTIONS.START_ADVENTURE,
      result,
    });
    return result;
  };
}

export function sendAdventureInvitation(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await request({
      ...ROUTES.SEND_ADVENTURE_INVITATION,
      data,
      authToken: getState().auth.authToken,
      description: 'Send Adventure Invitation',
    });
    dispatch({
      type: REDUX_ACTIONS.SEND_ADVENTURE_INVITATION,
      result,
      description:
        'Add New Adventure Invitation from requests > sendAdventureInvitation()',
    });
    return result;
  };
}

export function resendAdventureInvitation(inviteId: string) {
  return async (dispatch, getState) => {
    const result = await request({
      ...ROUTES.RESEND_ADVENTURE_INVITATION,
      pathParams: { inviteId },
      authToken: getState().auth.authToken,
    });

    dispatch({
      type: REDUX_ACTIONS.UPDATE_ADVENTURE_INVITATION,
      result,
      description:
        'Update Adventure Invitation from requests > resendAdventureInvitation()',
    });
    return result;
  };
}

export function deleteAdventureInvitation(inviteId: string) {
  return async (dispatch, getState) => {
    const result = await request({
      ...ROUTES.DELETE_ADVENTURE_INVITATION,
      pathParams: { inviteId },
      authToken: getState().auth.authToken,
    });
    return result;
  };
}

export function deleteAdventure(adventureId: string) {
  return async (dispatch, getState) => {
    const result = await request({
      ...ROUTES.DELETE_ADVENTURE,
      pathParams: { adventureId },
      authToken: getState().auth.authToken,
    });

    if (result?.errors) {
      // eslint-disable-next-line no-console
      console.log('🛑 deleteAdventure error', result?.errors);
      throw result?.errors;
    } else {
      // Update adventure status in the store.
      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE,
        data: result,
        description: 'Update deleted adventure in the Store as canceled',
      });

      return result;
    }
  };
}

// Create new message in Adventure chat.
export function createAdventureStepMessage(params: {
  value: string;
  adventure: any;
  step: any;
  kind: string;
  userId: string;
  internalMessage?: any;
}) {
  return async (dispatch: Dispatch, getState: any) => {
    const { internalMessage, value, kind, adventure, step } = params;
    let result = {};
    const data: any = {
      message: {},
    };
    if (params.kind === 'question' || params.kind === 'standard') {
      data.message.content = params.value;
      data.message.messenger_journey_step_id = params.step.id;
    }
    if (
      params.kind === 'multi' ||
      params.kind === 'binary' ||
      params.kind === 'share'
    ) {
      data.message.content = null;
      // Step ID.
      data.message.messenger_journey_step_id =
        params.step.metadata.messenger_journey_step_id;

      data.message.kind = 'answer';
      // ID of the selected answer/choice/option.
      data.message.messenger_journey_step_option_id = params.value;
    }

    // Need to provide parent question ID when answering a secondary/internal question.
    if (params.internalMessage) {
      // If internal message then step ID is different.
      data.message.messenger_journey_step_id =
        internalMessage?.metadata?.messenger_journey_step_id;
      data.message.message_reference_id = internalMessage?.id;
    }
    // params.kind = question - is the main question box
    // params.kind = standard - is a regular chat message

    // CHANGE SOME DATA LOCALLY.
    if (params.kind === 'question' && params?.step?.kind !== 'multi') {
      // If this is the answer to the main question
      // update the adventure step status as completed
      // and unlock the next step (status:active).
      let shouldUpdateNext = false;
      let currentStepFieldsToUpdate = {};
      let nextStepFieldsToUpdate = {};
      const { userId } = params;
      const adventureSteps = getState().data.adventureSteps[
        params.adventure.id
      ];
      const stepsLength = adventureSteps?.allIds.length;
      const currentIndex = adventureSteps?.allIds.findIndex(
        (s: any) => s === params.step.id,
      );
      const nextStepId = adventureSteps?.allIds[currentIndex + 1];
      // If not the last step in the adventure.
      if (stepsLength - 1 !== currentIndex) {
        shouldUpdateNext = true;
      }
      // If solo adventure.
      if (
        params.adventure.kind !== 'multiple' &&
        params.adventure.kind !== 'duo'
      ) {
        currentStepFieldsToUpdate = { status: 'completed' };
        if (shouldUpdateNext) {
          nextStepFieldsToUpdate = { status: 'active' };
        }
      }

      // If duo adventure.
      if (params.adventure.kind === 'duo') {
        const otherUser =
          params.adventure.conversation.messengers.find(
            i => i.id !== userId && i.first_name !== 'VokeBot',
          ) || {};
        let otherUserReplied = false;
        if (otherUser?.id) {
          const currentStepMessages =
            getState().data.adventureStepMessages[
              params.step.metadata.messenger_journey_step_id
            ] || {};
          for (const [key, message] of Object.entries(currentStepMessages)) {
            if (message.messenger_id === otherUser.id) {
              otherUserReplied = true;
              break;
            }
          }
        }
        currentStepFieldsToUpdate = {
          'completed_by_messenger?': true,
        };
        if (otherUserReplied) {
          // In Duo Adventures we are waiting for a friend to answer.
          currentStepFieldsToUpdate.status = 'completed';
          if (shouldUpdateNext) {
            nextStepFieldsToUpdate = { status: 'active' };
          }
        }
      }
      // If group adventure.
      if (params.adventure.kind === 'multiple') {
        currentStepFieldsToUpdate = {
          'completed_by_messenger?': true,
          status: 'completed', // In groups we don't wait others.
        };
        if (shouldUpdateNext) {
          nextStepFieldsToUpdate = { status: 'active' };
        }
      }

      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
        update: {
          adventureStepId: params.step.id,
          adventureId: params.adventure.id,
          fieldsToUpdate: currentStepFieldsToUpdate,
        },
      });

      // If posting message to the question should trigger other changes
      // in the adventure like: reveal other users replies and marking
      // the next step as active.
      if (shouldUpdateNext && nextStepFieldsToUpdate) {
        dispatch({
          type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
          update: {
            adventureStepId: nextStepId,
            adventureId: params.adventure.id,
            fieldsToUpdate: nextStepFieldsToUpdate,
          },
        });
      }
    }

    // If new message is a simple text message:
    // don't wait response from the server before adding new message
    // to the chat array in the store.
    if (params.kind === 'standard') {
      const date = new Date().toISOString();
      // Temporary message id.
      const newId = Math.floor(Date.now() / 1000);
      // Create pseudo structure as we expect it from the server.
      const newMessageData = {
        id: `${newId}`,
        position: 1,
        content: params.value,
        messenger_id: params.userId,
        conversation_id: params.adventure.conversation.id,
        messenger_journey_step_id: params.step.id,
        grouping_journey_step_id: params.step.id,
        kind: 'text',
        direct_message: false,
        item: null,
        reactions: [],
        'adventure_message?': true,
        metadata: {},
        created_at: date,
      };
      // Save message to the store.
      dispatch({
        type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
        message: newMessageData,
        adventureId: params.adventure.id,
        ownMessage: true,
        description:
          'createAdventureStepMessage(): Create Adventure Step Message (A)',
      });

      // Send message to the server in a non-async manner.
      result = await request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
        authToken: getState().auth.authToken,
        description: 'Create Adventure Step Message',
      });
    } else {
      // If not a plain text message: go a slow route -
      // send message to the server in async manner and only then updatie the store.
      // SEND MESSAGE TO THE SERVER.
      result = await request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
        authToken: getState().auth.authToken,
        description: 'Create Adventure Step Message',
      });

      // SAVE RESPONSE FROM THE SERVER TO THE STORE.
      dispatch({
        type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
        message: result,
        adventureId: params.adventure.id,
        ownMessage: true,
        description:
          'createAdventureStepMessage(): Create Adventure Step Message (B)',
      });
    }

    // Refresh all messages when answering a quiestion to multi challenge.
    if (
      data.message.kind === 'answer' ||
      data.message.kind === 'question' ||
      params.kind === 'multi' ||
      params.kind === 'binary' ||
      params.kind === 'share'
    ) {
      dispatch(
        getAdventureStepMessages(
          params.adventure.conversation.id,
          params.step.id,
        ),
      );
    }

    // TODO: Optimization - do the next aciton only if current step wasn't marked
    // as completed already.

    // Update adventure steps to mark the current step as completed
    // and unlock the next one.
    dispatch(getAdventureSteps(params.adventure.id));

    /* dispatch({
      description: 'Create Adventure Step Message',
      type: REDUX_ACTIONS.LOG,
      params,
    }); */
    console.log('⚠️ Create Adventure Step Message:', result);
    return result;
  };
}

export function getVideos(params: any = {}) {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await request({
      ...ROUTES.GET_VIDEOS,
      params: { ...params },
      authToken: getState().auth.authToken,
      description: 'Get Videos',
    });
    dispatch({
      type: REDUX_ACTIONS.UPDATE_VIDEO_PAGINATION,
      result: { results, params },
    });

    return results;
  };
}

export function getVideoTags() {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await request({
      ...ROUTES.GET_VIDEO_TAGS,
      authToken: getState().auth.authToken,
      description: 'Get Video Tags',
    });

    dispatch(setData('videoTags', results.tags));

    return results;
  };
}

export function destroyDevice(deviceId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await request({
      ...ROUTES.DESTROY_DEVICE,
      pathParams: { deviceId },
      authToken: getState().auth.authToken,
      description: 'Destroy Device',
    });

    return results;
  };
}

export function updateDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    let results: any;
    const returnedDevice = await request({
      ...ROUTES.UPDATE_DEVICE,
      pathParams: { deviceId },
      data: newDeviceData,
      authToken: getState().auth.authToken,
      description: 'Update device data on our server',
    });
    // dispatch(setAuthData('device', results));
    // Update info in store.auth.device.
    dispatch({
      type: REDUX_ACTIONS.SET_DEVICE,
      device: returnedDevice,
      description:
        'Calling from updateDevice. Save returned from the server device data.',
    });

    return returnedDevice;
  };
}

export function getDevices() {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await request({
      ...ROUTES.GET_DEVICES,
      authToken: getState().auth.authToken,
      description: 'Get Devices',
    });
    return results;
  };
}

// Register new device on the server for receiving push notifications.
// https://docs.vokeapp.com/#me-devices-create-device
export function createDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    // Fetch user data from the server.
    return await request({
      ...ROUTES.CREATE_DEVICE,
      data: newDeviceData,
      authToken: getState().auth.authToken,
      description: 'Create Device',
    }).then(
      returnedDeviceData => {
        // eslint-disable-next-line no-console
        // Update info in store.auth.device if it's a cable device not apple/adnriod.
        if (returnedDeviceData.kind === 'cable') {
          dispatch({
            type: REDUX_ACTIONS.SET_DEVICE,
            device: returnedDeviceData,
          });
        }
        return returnedDeviceData;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('📱🛑 createDevice > error', error);
        throw error;
      },
    );
  };
}

export function revokeAuthToken(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await request({
      ...ROUTES.REVOKE_TOKEN,
      data,
      authToken: getState().auth.authToken,
      description: 'Revoke Auth Token',
    });
    return results;
  };
}

// Prepare device for sockets.
// https://docs.vokeapp.com/#me-devices
// Devices are an important part of establishing real time connectivity in Voke.
// Devices allow the API to send the user information relative to them.
export function establishCableDevice(pushDeviceId?: string) {
  return async (dispatch: Dispatch, getState: any) => {
    const savedDeviceInfo = getState().auth.device;
    const currentDeviceId = getState().auth.device.id;
    const currentDeviceData = {
      // id: currentDeviceId,
      version: 1,
      local_id: deviceInfoModule.getUniqueId(),
      local_version: deviceInfoModule.getVersion(),
      family: deviceInfoModule.getBrand(),
      name: deviceInfoModule.getModel(),
      os: `${Platform.OS} ${deviceInfoModule.getSystemVersion()}`,
    };
    let returnedDeviceData = {};

    const deviceInfoChanged = (): boolean => {
      return !isEqualObject(savedDeviceInfo, currentDeviceData);
    };

    // If device info or push device id changed:
    // deviceId - if provided, need to update device.
    if (pushDeviceId || deviceInfoChanged() || !currentDeviceId) {
      const newDeviceData = {
        device: {
          ...currentDeviceData,
          // TODO: do I needed these?
          key: pushDeviceId || null,
          kind: 'cable',
          // Possible variations:
          // key: deviceId for websokets,
          // kind: 'cable' for websokets.
          // ----------------------------
          // key: pushToken for notifications.
          // kind: 'fcm'/'apple' for push notifications.
        },
      };

      if (currentDeviceId) {
        // UPDATE existing cable with new device data.
        returnedDeviceData = await dispatch(updateDevice(newDeviceData));
      } else {
        // CREATE new cable with new device data.
        returnedDeviceData = await dispatch(createDevice(newDeviceData));
      }
    }

    if (returnedDeviceData?.id) {
      deviceId = returnedDeviceData.id;
    } else {
      deviceId = currentDeviceId;
    }
  };
}

// Register new push notification token on our server,
// so it knows where to deliver notifications.
export function establishPushDevice(pushToken: string) {
  return async (dispatch: Dispatch, getState: any) => {
    if (!pushToken) return;
    // Compose current device info to be sent to the server.
    const currentDeviceData = {
      version: 1,
      local_id: deviceInfoModule.getDeviceId(),
      local_version: deviceInfoModule.getVersion(),
      family: deviceInfoModule.getBrand(),
      name: deviceInfoModule.getModel(),
      os: `${Platform.OS} ${deviceInfoModule.getSystemVersion()}`,
    };
    const data = {
      device: {
        ...currentDeviceData,
        key: pushToken,
        kind: st.isAndroid ? 'fcm' : 'apple',
        // Possible variations:
        // key: deviceId for websokets,
        // kind: 'cable' for websokets.
        // ----------------------------
        // key: pushToken for notifications.
        // kind: 'fcm'/'apple' for push notifications.
      },
    };
    const newPushDevice: any = await dispatch(createDevice(data));
    return newPushDevice.id;
  };
}

export function getNotifications(params: any = {}) {
  return async (dispatch: Dispatch, getState: any) => {
    const notificationId = getState().auth.user.vokebotConversationId;
    if (!notificationId) return;
    // Request new value for Notifications Unreads counter.
    dispatch(getNotificationsTabUnreads());

    const results: any = await request({
      ...ROUTES.GET_NOTIFICATIONS,
      pathParams: { notificationId },
      params: { ...params },
      authToken: getState().auth.authToken,
      description: 'Get Notifications',
    });
    dispatch({
      type: REDUX_ACTIONS.UPDATE_NOTIFICATION_PAGINATION,
      result: { results, params },
    });
    return results;
  };
}

type markReadNotification = {
  conversationId: string;
  notificationId: string;
};

export function markReadNotification(params: markReadNotification) {
  return async (dispatch: Dispatch, getState: any) => {
    const { notificationId, conversationId } = params;
    const deviceId = getState().auth.device.id;

    // See: https://docs.vokeapp.com/#me-conversations-messages-interactions
    const data: any = {
      interaction: {
        action: 'read', // Message read.
        device_id: deviceId,
      },
    };

    // SEND INTERACTION DATA TO THE SERVER.
    const result = await request({
      ...ROUTES.CREATE_INTERACTION_READ,
      pathParams: {
        conversationId,
        messageId: notificationId,
      },
      data,
      authToken: getState().auth.authToken,
    });

    if (!result?.errors) {
      dispatch({
        type: REDUX_ACTIONS.UPDATE_NOTIFICATION_UNREAD_BADGE,
        count: 0,
      });
    }

    return result;
  };
}

export function sendVideoInvitation(params: any = {}) {
  return async (dispatch: Dispatch, getState: any) => {
    const createData = {
      share: {
        first_name: params.name,
        item_id: params.item_id,
      },
    };

    const results = await request({
      ...ROUTES.SEND_VIDEO_INVITATION,
      data: createData,
      authToken: getState().auth.authToken,
      description: 'Send Video Invitation',
    });

    return results;
  };
}

export function toggleFavoriteVideo(shouldFavorite: boolean, video: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const allVideos = getState().data.allVideos || [];
    const featuredVideos = getState().data.featuredVideos || [];
    const popularVideos = getState().data.popularVideos || [];
    const searchVideos = getState().data.searchVideos || [];
    const favoriteVideos = getState().data.favoriteVideos || [];
    let results: any;
    if (shouldFavorite) {
      results = await request({
        ...ROUTES.FAVORITE_VIDEO,
        pathParams: { videoId: video.id },
        authToken: getState().auth.authToken,
        description: 'Toggle Favorite Video: Add',
      });
    } else {
      results = await request({
        ...ROUTES.UNFAVORITE_VIDEO,
        pathParams: { videoId: video.id },
        authToken: getState().auth.authToken,
        description: 'Toggle Favorite Video: Remove',
      });
    }

    // let hello = async () => { return "Hello" };

    if (shouldFavorite) {
      const newFavoriteVideos = [...favoriteVideos, video];
      await dispatch(setData('favoriteVideos', newFavoriteVideos));
    } else {
      const newUnFavoriteVideos = favoriteVideos.filter(
        (v: any) => v.id !== video.id,
      );
      await dispatch(setData('favoriteVideos', newUnFavoriteVideos));
    }
    if (allVideos.find((v: any) => v.id === video.id)) {
      const newAllVideos = allVideos.map((v: any) => {
        if (v.id === video.id) {
          return { ...v, 'favorite?': shouldFavorite };
        } else return v;
      });
      await dispatch(setData('allVideos', newAllVideos));
    }
    if (featuredVideos.find((v: any) => v.id === video.id)) {
      const newFeaturedVideos = featuredVideos.map((v: any) => {
        if (v.id === video.id) {
          return { ...v, 'favorite?': shouldFavorite };
        } else return v;
      });
      await dispatch(setData('featuredVideos', newFeaturedVideos));
    }
    if (popularVideos.find((v: any) => v.id === video.id)) {
      const newPopularVideos = popularVideos.map((v: any) => {
        if (v.id === video.id) {
          return { ...v, 'favorite?': shouldFavorite };
        } else return v;
      });
      await dispatch(setData('popularVideos', newPopularVideos));
    }
    if (searchVideos.find((v: any) => v.id === video.id)) {
      const newSearchVideos = searchVideos.map((v: any) => {
        if (v.id === video.id) {
          return { ...v, 'favorite?': shouldFavorite };
        } else return v;
      });
      await dispatch(setData('searchVideos', newSearchVideos));
    }

    return results;
  };
}

export function updateAdventureUnreads(adventureId) {
  return async (dispatch: Dispatch, getState: any) => {
    const adventureSteps = getState().data.adventureSteps[adventureId].byId;
    let advUnreadCount = 0;

    for (const [key, step] of Object.entries(adventureSteps)) {
      const stepUnreadCnt = step.unread_messages;
      if (stepUnreadCnt > 0) {
        advUnreadCount = advUnreadCount + stepUnreadCnt;
      }
    }
    // Then call debounced update on the server.
    return dispatch({
      type: REDUX_ACTIONS.UPDATE_ADVENTURE_UNREADS,
      adventureId,
      advUnreadCount,
    });
  };
}

type markMessageAsRead = {
  conversationId: string;
  messageId: string;
  adventureId: string;
  stepId: string;
};

export function markMessageAsRead(params: markMessageAsRead) {
  return async (dispatch: Dispatch, getState: any) => {
    const { adventureId, stepId, conversationId, messageId } = params;

    // Mark message as read in the store for immediate feedback.
    dispatch({ type: REDUX_ACTIONS.MARK_READ, adventureId, stepId });
    dispatch(updateAdventureUnreads(adventureId));
    dispatch(updateTotalUnreadCounter()); // Update App Counter.

    const deviceId = getState().auth.device.id;

    // See: https://docs.vokeapp.com/#me-conversations-messages-interactions
    const data: any = {
      interaction: {
        action: 'read', // Message read.
        device_id: deviceId,
      },
    };

    // SEND INTERACTION DATA TO THE SERVER.
    const result = await request({
      ...ROUTES.CREATE_INTERACTION_READ,
      pathParams: {
        conversationId,
        messageId,
      },
      data,
      authToken: getState().auth.authToken,
      description: 'Mark message as read on the server.' + messageId,
    });

    return result;
  };
}

// Send an interaction when the user press play.
export function interactionAdventureVideoPlay({ adventureId, stepId }) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    // See: https://docs.vokeapp.com/#me-journeys-steps-interactions-create-interaction
    const data: any = {
      interaction: {
        action: 'started', // Message read.
        device_id: deviceId,
      },
    };
    // SEND INTERACTION DATA TO THE SERVER.
    const result = await request({
      ...ROUTES.CREATE_INTERACTION_PLAY_ADVENTURE_VIDEO,
      pathParams: {
        adventureId,
        stepId,
      },
      data,
      authToken: getState().auth.authToken,
    });
    return result;
  };
}

type interactionVideoPlay = {
  videoId: string;
  context: 'resource' | 'journey' | 'step' | 'notifications';
  // Where the interaction is comming from?
};

// Send an interaction when the user press play.
// https://docs.vokeapp.com/#items-interactions-create-item-interaction
export function interactionVideoPlay(params: interactionVideoPlay) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    const data: any = {
      interaction: {
        action: 'started', // Message read.
        device_id: deviceId,
        context: params.context,
      },
    };
    // SEND INTERACTION DATA TO THE SERVER.
    const result = await request({
      ...ROUTES.CREATE_INTERACTION_PLAY_VIDEO,
      pathParams: {
        videoId: params.videoId,
      },
      data,
      authToken: getState().auth.authToken,
    });
    return result;
  };
}

export function updateVideoIsPlayingState(newState) {
  return async (dispatch: Dispatch, getState: any) => {
    return dispatch({
      type: REDUX_ACTIONS.SET_VIDEO_STATE,
      state: newState,
    });
  };
}

export function updateAdventure(newAdventureData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const adventureId = newAdventureData.id;
    // let results: any;
    const data = await request({
      ...ROUTES.UPDATE_ADVENTURE,
      pathParams: { adventureId },
      data: newAdventureData,
      authToken: getState().auth.authToken,
      description: 'Update adventure release date on the server',
    });

    // Update data in the store.
    dispatch({
      type: REDUX_ACTIONS.UPDATE_ADVENTURE,
      data: data,
      description: 'Calling from updateAdventure.',
    });

    return data;
  };
}

export function createComplain({
  messageId,
  adventureId,
  comment,
}: {
  messageId: string;
  adventureId: string;
  comment: string;
}) {
  return async (dispatch: Dispatch, getState: any) => {
    const data = await request({
      ...ROUTES.CREATE_COMPLAIN,
      pathParams: { adventureId },
      data: {
        message_id: messageId,
        comment: comment,
      },
      authToken: getState().auth.authToken,
      description: 'Create complain on the server',
    });
    return data;
  };
}

export function ignoreComplain({ reportId, adventureId }) {
  return async (dispatch: Dispatch, getState: any) => {
    const data = await request({
      ...ROUTES.DELETE_COMPLAIN,
      pathParams: { adventureId, reportId },
      authToken: getState().auth.authToken,
      description: 'Ignore/Delete complain on the server',
    });
    return data;
  };
}

export function approveComplain({ reportId, adventureId }) {
  return async (dispatch: Dispatch, getState: any) => {
    const data = await request({
      ...ROUTES.APPROVE_COMPLAIN,
      pathParams: { adventureId, reportId },
      authToken: getState().auth.authToken,
      description: 'Approve complain on the server',
    });
    return data;
  };
}

export function getComplains({ adventureId }) {
  return async (dispatch: Dispatch, getState: any) => {
    const data = await request({
      ...ROUTES.GET_COMPLAINS,
      pathParams: { adventureId },
      authToken: getState().auth.authToken,
      description:
        'Get complains from the server for adventureId: ' + adventureId,
    });
    return data;
  };
}

export function getAdventureSummary(adventureId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const results: any = await request({
        ...ROUTES.GET_ADVENTURE_SUMMARY,
        pathParams: { adventureId },
        authToken: getState().auth.authToken,
        description:
          'Get Adventure Members by step for adventure id: ' + adventureId,
      });
      return results;
    } catch (error) {
      console.log('getAdventureStepMessages error:', error);
    }
  };
}

export function unlockNextAdventureStep(
  adventureId: string,
): AsyncAction<TAdventureSingle | TError> {
  return async (dispatch, getState) => {
    try {
      const results: Promise<TAdventureSingle | TError> = await request({
        ...ROUTES.UNLOCK_NEXT_ADVENTURE_STEP,
        pathParams: { adventureId },
        authToken: getState().auth.authToken,
        description: 'Unlock next Adventure step. Adventure id: ' + adventureId,
      });
      return results;
    } catch (error) {
      return error;
    }
  };
}

export function deleteMember({ conversationId, messengerId }) {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const results: any = await request({
        ...ROUTES.DELETE_MEMBER,
        // url: `me/conversations/{conversationId}/messengers/{messengerId}/block`,
        pathParams: {
          conversationId,
          messengerId,
        },
        authToken: getState().auth.authToken,
        description: 'Delete member with messengerId: ' + messengerId,
      });
      return results;
    } catch (error) {
      console.log('deleteMember error:', error);
    }
  };
}

interface CreateReactionParams {
  reaction: string;
  messageId: string;
  conversationId: string;
}

export function createReaction(params: CreateReactionParams) {
  return async (dispatch: Dispatch, getState): Promise<any> => {
    const { reaction, messageId, conversationId } = params;

    const data = {
      reaction: reaction,
    };

    // SEND INTERACTION DATA TO THE SERVER.
    const result = await request({
      ...ROUTES.CREATE_REACTION,
      pathParams: {
        conversationId,
        messageId,
      },
      data,
      authToken: getState().auth.authToken,
    });

    // Server returns modified message object.
    if (!result?.errors) {
      // Update message with new reaction in the store.
      dispatch({
        type: REDUX_ACTIONS.UPDATE_MESSAGE,
        message: result,
        description: 'createReaction(): Update message reaction in the store',
      });
    }

    return result;
  };
}
