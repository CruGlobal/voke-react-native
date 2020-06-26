import request from './utils';
import ROUTES from './routes';
import { REDUX_ACTIONS } from '../constants';
import { ThunkDispatch } from 'redux-thunk';
import { DataKeys } from '../reducers/data';
import deviceInfoModule from 'react-native-device-info';
import { Platform } from 'react-native';
import st from '../st';
import { isEqualObject, exists } from '../utils';
import { AuthDataKeys } from '../reducers/auth';
import { setAppIconBadgeNumber } from './notifications';
import { debounce } from 'lodash';

type Dispatch = ThunkDispatch<any, any, any>;

export function setUser(userData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    // Reducer expects the root object to be user.
    let newUserData = userData;

    // Access token is missing from some of the server replies. Recreate it.
    if (!exists(userData?.access_token?.access_token)) {
      const auth = getState().auth;

      newUserData = {
        ...newUserData,
        access_token: {
          access_token: auth.authToken,
        },
      }
    }

    return dispatch({
      type: REDUX_ACTIONS.SET_USER,
      user: newUserData,
    });
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

export function getAvailableAdventures() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_AVAILABLE_ADVENTURES, description: 'Get Available Adventures' }),
    );
    const adventures = results.organization_journeys;
    dispatch(setData('availableAdventures', adventures));
    return results;
  };
}

/**
 * Get active adventures.
 */
export function getMyAdventures( comment = '' ) {
  return async (dispatch: Dispatch, getState: any) => {
    await dispatch(
      request({ ...ROUTES.GET_MY_ADVENTURES, description: 'Get My Adventures. Called from ' + comment }),
    ).then(
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
    await dispatch(
      request({
        ...ROUTES.GET_MY_ADVENTURE,
        pathParams: { adventureId },
        description: 'Get My Adventure'
      }),
    ).then(
      data => {
        // const myAdventures = data.journeys;
        // Add pending adventure to store.
        dispatch({
          type: REDUX_ACTIONS.UPDATE_ADVENTURE,
          data: data,
          description: 'Update single adventure In Store'
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
    const results: any = await dispatch(
      request({ ...ROUTES.GET_ADVENTURE_INVITATIONS, description: 'Get Adventures Invitations' }),
    );
    const adventureInvitations = results.journey_invites;
    dispatch({
      type: REDUX_ACTIONS.UPDATE_INVITATIONS,
      data: adventureInvitations,
      description: 'Update Invitations In Store'
    });
    return results;
  };
}

export function acceptAdventureInvitation(adventureCode: string) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.ACCEPT_ADVENTURE_INVITATION,
        data: { code: adventureCode },
        description: 'Accept Adventure Invitation'
      }),
    );
    await dispatch(getMyAdventures('Accept Adventure Invitation'));
    return results;
  };
}

// Iterate through adventures to find total number of unread messages.
export function updateTotalUnreadCounter() {
  console.log( "🤖 updateTotalUnreadCounter" );
  return async (dispatch: Dispatch, getState: any) => {
    const myAdventures = getState().data.myAdventures.byId;
    let unreadTotal = 0;
    for (let [key, value] of Object.entries(myAdventures)) {
      unreadTotal += value.conversation.unread_messages;
    }
    // Update app icon counter.
    setAppIconBadgeNumber(unreadTotal);

    return dispatch({
      type: REDUX_ACTIONS.UPDATE_UNREAD_TOTAL,
      data: unreadTotal,
      description: 'Update Unread Total Counter'
    });
  };
}


// We are calling for updated adventure steps after each message,
// that can be expensive so we have to debounce this action.
const getAdventureStepsDebounced = debounce(
    async (dispatch, adventureId) => {
      const results: any = await dispatch(
        request({
          ...ROUTES.GET_ADVENTURE_STEPS,
          pathParams: { adventureId },
          description: 'Get Adventure Steps'
        }),
      );
      const adventureSteps = results.steps;
      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEPS,
        result: { adventureId, adventureSteps },
        description: 'Get Adventure Steps'
      });

      dispatch(getMyAdventure(adventureId));
      dispatch(updateTotalUnreadCounter());

      return results;
    }
  , 2000, { 'leading': true, 'trailing': true }
);

export function getAdventureSteps(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    return await getAdventureStepsDebounced(dispatch, adventureId)
  };
}

export function getAdventureStepMessages(
  adventureConversationId: string,
  adventureStepId: string,
) {
  return async (dispatch: Dispatch, getState: any) => {
    try {

      const results: any = await dispatch(
        request({
          ...ROUTES.GET_ADVENTURE_STEP_MESSAGES,
          pathParams: { adventureConversationId },
          params: adventureStepId ? { messenger_journey_step_id: adventureStepId } : null,
          description: 'Get Adventure Step Messages for conversation id: ' + adventureConversationId
        }),
      );
      const adventureStepMessages = results.messages;
      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP_MESSAGES,
        messages:adventureStepMessages,
      });
      return results;
    } catch (error) {
      console.log( "getAdventureStepMessages error:", error );
    }
  };
}

export function startAdventure(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await dispatch(
      request({
        ...ROUTES.START_ADVENTURE,
        data,
        description: 'Start Adventure'
      }));

    dispatch({
      type: REDUX_ACTIONS.START_ADVENTURE,
      result,
    });
    return result;
  };
}

export function sendAdventureInvitation(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await dispatch(
      request({ ...ROUTES.SEND_ADVENTURE_INVITATION, data, description: 'Send Adventure Invitation' }),
    );
    dispatch({
      type: REDUX_ACTIONS.SEND_ADVENTURE_INVITATION,
      result,
    });
    return result;
  };
}

export function resendAdventureInvitation(inviteId: string) {
  return async dispatch => {
    const result = await dispatch(
      request({
        ...ROUTES.RESEND_ADVENTURE_INVITATION,
        pathParams: { inviteId },
      })
    );

    dispatch({
      type: REDUX_ACTIONS.RESEND_ADVENTURE_INVITATION,
      result,
    });
    return result;
  };
}

export function deleteAdventureInvitation(inviteId: string) {
  return async dispatch => {
    const result = await dispatch(
      request({
        ...ROUTES.DELETE_ADVENTURE_INVITATION,
        pathParams: { inviteId },
      })
    );
    return result;
  };
}

export function deleteAdventure(adventureId: string) {
  return async dispatch => {
    const result = await dispatch(
      request({
        ...ROUTES.DELETE_ADVENTURE,
        pathParams: { adventureId },
      })
    );
    return result;
  };
}


// Create new message in Adventure chat.
export function createAdventureStepMessage(params: {
  value: string;
  adventure: any;
  step: any;
  kind: string;
  internalMessage?: any;
}) {
  return async (dispatch: Dispatch, getState: any) => {
    const { internalMessage, value, kind, adventure, step } = params;
    let data: any = {
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
      data.message.messenger_journey_step_id = internalMessage?.metadata?.messenger_journey_step_id;
      data.message.message_reference_id = internalMessage?.id;
    }

    // SEND MESSAGE TO THE SERVER.
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
        description: 'Create Adventure Step Message'
      }),
    );

    // SAVE RESPONSE FROM THE SERVER TO THE STORE.
    dispatch({
      type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
      message: result,
      description: 'createAdventureStepMessage(): Create Adventure Step Message'
    });

    // Refresh all messages when answering a quiestion to multi challenge.
    if ( data.message.kind === 'answer' ) {
      dispatch(
        getAdventureStepMessages(
          params.adventure.conversation.id,
          params.step.id
        ));
    }
    // Update adventure steps to mark the current step as completed
    // and unlock the next one.
    dispatch(getAdventureSteps(params.adventure.id));

    if (params.kind === 'question') {
      // If this is the answer to the main question
      // update the adventure step status as completed
      // and unlock the next step (status:active).
      const adventureSteps = getState().data.adventureSteps[
        params.adventure.id
      ];
      const currentIndex = adventureSteps.findIndex(
        (s: any) => s.id === params.step.id,
      );
      const stepsLength = adventureSteps.length;
      let shouldUpdateNext = false;
      // If not the last step in the adventure.
      if (stepsLength - 1 !== currentIndex) {
        shouldUpdateNext = true;
      }
      let currentStepFieldsToUpdate = {};
      let nextStepFieldsToUpdate = {};
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
      // If duo adventure
      /* if (params.adventure.kind === 'duo') {
        currentStepFieldsToUpdate = { 'completed_by_messenger?': true };
        if (false) {
          // TODO
          currentStepFieldsToUpdate = {
            'completed_by_messenger?': true,
            status: 'completed',
          };
          nextStepFieldsToUpdate = { status: 'active' };
        }
      } */
      // If duo or group adventure.
      if (
        params.adventure.kind === 'multiple' ||
        params.adventure.kind === 'duo'
      ) {
        currentStepFieldsToUpdate = {
          'completed_by_messenger?': true,
          // status: 'completed', // TODO: change this only if all other answered?
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
            adventureStepId: adventureSteps[currentIndex + 1].id,
            adventureId: params.adventure.id,
            fieldsToUpdate: nextStepFieldsToUpdate,
          },
        });
      }
    }
    return result;
  };
}

export function getVideos(params: any = {}) {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await dispatch(
      request({
        ...ROUTES.GET_VIDEOS,
        params: { ...params },
        description: 'Get Videos'
      }),
    );
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
    results = await dispatch(
      request({
        ...ROUTES.GET_VIDEO_TAGS,
        description: 'Get Video Tags'
      }),
    );

    dispatch(setData('videoTags', results.tags));

    return results;
  };
}

export function destroyDevice(deviceId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await dispatch(
      request({
        ...ROUTES.DESTROY_DEVICE,
        pathParams: { deviceId },
        description: 'Destroy Device'
      }),
    );

    return results;
  };
}

export function updateDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    let results: any;
    const returnedDevice = await dispatch(
      request({
        ...ROUTES.UPDATE_DEVICE,
        pathParams: { deviceId },
        data: newDeviceData,
        description: 'Update device data on our server'
      }),
    );
    // dispatch(setAuthData('device', results));
    // Update info in store.auth.device.
    dispatch({
      type: REDUX_ACTIONS.SET_DEVICE,
      device: returnedDevice,
      description: 'Calling from updateDevice. Save returned from the server device data.'
    });

    return returnedDevice;
  };
}

export function getDevices() {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await dispatch(
      request({
        ...ROUTES.GET_DEVICES,
        description: 'Get Devices'
      }),
    );
    return results;
  };
}


// Register new device on the server for receiving push notifications.
// https://docs.vokeapp.com/#me-devices-create-device
export function createDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {

    // Fetch user data from the server.
    return dispatch(request({
        ...ROUTES.CREATE_DEVICE,
        data: newDeviceData,
        description: 'Create Device'
      })).then(
      returnedDeviceData => {
        // eslint-disable-next-line no-console
       // Update info in store.auth.device if it's a cable device not apple/adnriod.
       if(returnedDeviceData.kind === 'cable'){
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
    const results = await dispatch(
      request({
        ...ROUTES.REVOKE_TOKEN,
        data,
        description: 'Revoke Auth Token'
      }),
    );
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
      local_id: deviceInfoModule.getDeviceId(),
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
    const results: any = await dispatch(
      request({
        ...ROUTES.GET_NOTIFICATIONS,
        pathParams: { notificationId },
        params: { ...params },
        description: 'Get Notifications'
      }),
    );
    dispatch({
      type: REDUX_ACTIONS.UPDATE_NOTIFICATION_PAGINATION,
      result: { results, params },
    });
    return results;
  };
}

export function updateUnReadNotificationsBadge(updatedMessages: any) {
  return async (dispatch: Dispatch, getState: any) => {
    if ( updatedMessages.length < 1 ) return;
    const notificationLatestId = getState().data.notificationLatestId;
    const unreadNotificationsBadge = getState().data.notificationUnreadBadge;
    if ( updatedMessages[0]?.id !== notificationLatestId ) {
      dispatch({
        type: REDUX_ACTIONS.UPDATE_NOTIFICATION_UNREAD_BADGE,
        count: unreadNotificationsBadge + 1,
      });
    }
  };
}

export function markReadNotification(notificationId: string) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.UPDATE_NOTIFICATION_READ,
      notificationId,
    });

    dispatch({
        type: REDUX_ACTIONS.UPDATE_NOTIFICATION_UNREAD_BADGE,
        count: 0,
      });
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

    const results = await dispatch(
      request({
        ...ROUTES.SEND_VIDEO_INVITATION,
        data: createData,
        description: 'Send Video Invitation'
      }),
    );

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
      results = await dispatch(
        request({
          ...ROUTES.FAVORITE_VIDEO,
          pathParams: { videoId: video.id },
          description: 'Toggle Favorite Video: Add'
        }),
      );
    } else {
      results = await dispatch(
        request({
          ...ROUTES.UNFAVORITE_VIDEO,
          pathParams: { videoId: video.id },
          description: 'Toggle Favorite Video: Remove'
        }),
      );
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

    for (let [key, step] of Object.entries(adventureSteps)) {
      const stepUnreadCnt =  step.unread_messages;
      if ( stepUnreadCnt > 0 ) {
        advUnreadCount = advUnreadCount + stepUnreadCnt;
      }
    }
    // Then call debounced update on the server.
    return dispatch({ type: REDUX_ACTIONS.UPDATE_ADVENTURE_UNREADS, adventureId, advUnreadCount });
  };
}

type markMessageAsRead = {
  conversationId: string,
  messageId: string,
  adventureId: string,
  stepId: string,
}

export function markMessageAsRead(params: markMessageAsRead) {
  return async (dispatch: Dispatch, getState: any) => {
    const {adventureId, stepId } = params;

    // Mark message as read in the store for immediate feedback.
    dispatch({ type: REDUX_ACTIONS.MARK_READ, adventureId, stepId });
    dispatch(updateAdventureUnreads(adventureId));

    const { conversationId, messageId } = params;
    const deviceId = getState().auth.device.id;

    // See: https://docs.vokeapp.com/#me-conversations-messages-interactions
    let data: any = {
      interaction: {
        action: "read", // Message read.
        device_id: deviceId,
      }
    };

    // SEND INTERACTION DATA TO THE SERVER.
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_INTERACTION_READ,
        pathParams: {
          conversationId,
          messageId,
        },
        data,
        description: 'Mark message as read on the server.' +  messageId
      }),
    );

    return result;
  };
}

// Send an interaction when the user press play.
export function interactionVideoPlay({adventureId, stepId}) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    // See: https://docs.vokeapp.com/#me-journeys-steps-interactions-create-interaction
    let data: any = {
      interaction: {
        action: "started", // Message read.
        device_id: deviceId,
      }
    };
    // SEND INTERACTION DATA TO THE SERVER.
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_INTERACTION_PLAY,
        pathParams: {
          adventureId,
          stepId,
        },
        data,
      }),
    );
    return result;
  };
}

