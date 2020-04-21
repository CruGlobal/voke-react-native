import request from './utils';
import ROUTES from './routes';
import { REDUX_ACTIONS } from '../constants';
import { ThunkDispatch } from 'redux-thunk';
import { DataKeys } from '../reducers/data';
import deviceInfoModule from 'react-native-device-info';
import { Platform } from 'react-native';
import st from '../st';
import { isEqualObject, exists } from '../utils';
import { setupSockets } from './socket';
import { AuthDataKeys } from '../reducers/auth';

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
      request({ ...ROUTES.GET_AVAILABLE_ADVENTURES }),
    );
    const adventures = results.organization_journeys;
    dispatch(setData('availableAdventures', adventures));
    return results;
  };
}

/**
 * Get active adventures.
 */
export function getMyAdventures() {
  // var t0 = performance.now()
  return async (dispatch: Dispatch, getState: any) => {
    await dispatch(
      request({ ...ROUTES.GET_MY_ADVENTURES }),
    ).then(
      data => {
        // eslint-disable-next-line no-console
        // var t1 = performance.now()
        // console.log('🧗‍♂️ adventures in ' + (t1 - t0) + " milliseconds. \n", data);
        const myAdventures = data.journeys;
        // Update my adventures in store.
        return dispatch(setData('myAdventures', myAdventures));
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 getMyAdventures error', error);
        throw error;
      },
    );
  };
}

export function getMyAdventure(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result: any = await dispatch(
      request({
        ...ROUTES.GET_MY_ADVENTURE,
        pathParams: { adventureId },
      }),
    );
    return result;
  };
}

export function getAdventuresInvitations() {
  // var t0 = performance.now()
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_ADVENTURE_INVITATIONS }),
    );
    // var t1 = performance.now()
    // console.log('🎫 invitations in ' + (t1 - t0) + " milliseconds. \n", results);
    const adventureInvitations = results.journey_invites;
    dispatch(setData('adventureInvitations', adventureInvitations));
    return results;
  };
}

export function acceptAdventureInvitation(adventureCode: string) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.ACCEPT_ADVENTURE_INVITATION,
        data: { code: adventureCode },
      }),
    );
    await dispatch(getMyAdventures());
    return results;
  };
}

export function getAdventureSteps(adventureId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.GET_ADVENTURE_STEPS,
        pathParams: { adventureId },
      }),
    );
    const adventureSteps = results.steps;
    dispatch({
      type: REDUX_ACTIONS.GET_ADVENTURE_STEPS,
      result: { adventureId, adventureSteps },
    });
    return results;
  };
}

export function getAdventureStepMessages(
  adventureConversationId: any,
  adventureStepId: any,
) {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({
        ...ROUTES.GET_ADVENTURE_STEP_MESSAGES,
        pathParams: { adventureConversationId },
        params: { messenger_journey_step_id: adventureStepId },
      }),
    );
    const adventureStepMessages = results.messages;
    dispatch({
      type: REDUX_ACTIONS.GET_ADVENTURE_STEP_MESSAGES,
      result: { adventureStepId, adventureStepMessages },
    });
    return results;
  };
}

export function startAdventure(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const result = await dispatch(request({ ...ROUTES.START_ADVENTURE, data }));
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
      request({ ...ROUTES.SEND_ADVENTURE_INVITATION, data }),
    );
    dispatch({
      type: REDUX_ACTIONS.SEND_ADVENTURE_INVITATION,
      result,
    });
    return result;
  };
}
// Create new message in Adventure chat.
export function createAdventureStepMessage(params: {
  value: any;
  adventure: any;
  step: any;
  kind: any;
  internalMessageId?: any;
}) {
  return async (dispatch: Dispatch, getState: any) => {
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
      data.message.messenger_journey_step_id =
        params.step.metadata.messenger_journey_step_id;
      data.message.messenger_journey_step_option_id = params.value;
      data.message.kind = 'answer';
    }
    if (params.internalMessageId) {
      data.message.message_reference_id = params.internalMessageId;
    }

    // SEND MESSAGE TO THE SERVER.
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
      }),
    );

    // SAVE RESPONSE FROM THE SERVER TO THE STORE.
    dispatch({
      type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
      result: { adventureStepId: params.step.id, newMessage: result },
    });
    // dispatch(getAdventureSteps(params.adventure.id));
    if (params.kind === 'question') {
      // this is the answer to the main question, so update the status to complete
      const adventureSteps = getState().data.adventureSteps[
        params.adventure.id
      ];
      const currentIndex = adventureSteps.findIndex(
        (s: any) => s.id === params.step.id,
      );
      const stepsLength = adventureSteps.length;
      let shouldUpdateNext = false;
      if (stepsLength - 1 !== currentIndex) {
        shouldUpdateNext = true;
      }
      let newFieldToUpdate = {};
      let nextFieldToUpdate = {};
      if (
        params.adventure.kind !== 'multiple' &&
        params.adventure.kind !== 'duo'
      ) {
        newFieldToUpdate = { status: 'completed' };
        if (shouldUpdateNext) {
          nextFieldToUpdate = { status: 'active' };
        }
      }
      if (params.adventure.kind === 'duo') {
        newFieldToUpdate = { 'completed_by_messenger?': true };
        if (false) {
          // TODO
          newFieldToUpdate = {
            'completed_by_messenger?': true,
            status: 'completed',
          };
          nextFieldToUpdate = { status: 'active' };
        }
      }
      if (params.adventure.kind === 'multiple') {
        newFieldToUpdate = {
          'completed_by_messenger?': true,
          status: 'completed',
        };
        if (shouldUpdateNext) {
          nextFieldToUpdate = { status: 'active' };
        }
      }
      dispatch({
        type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
        update: {
          adventureStepId: params.step.id,
          adventureId: params.adventure.id,
          fieldsToUpdate: newFieldToUpdate,
        },
      });
      if (shouldUpdateNext && nextFieldToUpdate) {
        dispatch({
          type: REDUX_ACTIONS.UPDATE_ADVENTURE_STEP,
          update: {
            adventureStepId: adventureSteps[currentIndex + 1].id,
            adventureId: params.adventure.id,
            fieldsToUpdate: nextFieldToUpdate,
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
      }),
    );

    return results;
  };
}

export function updateDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const deviceId = getState().auth.device.id;
    let results: any;
    returnedDevice = await dispatch(
      request({
        ...ROUTES.UPDATE_DEVICE,
        pathParams: { deviceId },
        data: newDeviceData,
      }),
    );

    // dispatch(setAuthData('device', results));
    // Update info in store.auth.device.
    dispatch({
      type: REDUX_ACTIONS.SET_DEVICE,
      device: returnedDevice,
    });

    /* if (returnedDevice.id) {
      dispatch(setupSockets(returnedDevice.id));
    }
 */
    return returnedDevice;
  };
}

export function getDevices() {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await dispatch(
      request({
        ...ROUTES.GET_DEVICES,
      }),
    );
    return results;
  };
}


// Register new device on the server for receiving push notifications.
// https://docs.vokeapp.com/#me-devices-create-device
export function createDevice(newDeviceData: any) {
  return async (dispatch: Dispatch, getState: any) => {
    console.log( "function createDevice:",  newDeviceData);

    await dispatch(
      request({
        ...ROUTES.CREATE_DEVICE,
        data: newDeviceData,
      }),
    );

    /* const returnedDeviceData = await dispatch(
      request({
        ...ROUTES.CREATE_DEVICE,
        data: newDeviceData,
      }),
    );
    console.log( "CREATE_DEVICE results:" ); console.log( returnedDevice );

    // Update info in store.auth.device.
    dispatch({
      type: REDUX_ACTIONS.SET_DEVICE,
      device: returnedDeviceData,
    });
    return returnedDeviceData; */

    // Fetch user data from the server.
    return dispatch(request({
        ...ROUTES.CREATE_DEVICE,
        data: newDeviceData,
      })).then(
      returnedDeviceData => {
        // eslint-disable-next-line no-console
        console.log('📱 createDevice > returnedDeviceData:\n', returnedDeviceData);
       // Update info in store.auth.device.
        dispatch({
          type: REDUX_ACTIONS.SET_DEVICE,
          device: returnedDeviceData,
        });
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
    console.log( "🧵🧵🧵🧵🧵establishCableDevice:" , pushDeviceId );
    const savedDeviceInfo = getState().auth.device;
    let deviceId = null;
    const currentDeviceId = getState().auth.device.id;
    const currentDeviceData = {
      id: currentDeviceId,
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

    console.log( "📱‼️ deviceInfoChanged:" , deviceInfoChanged(), savedDeviceInfo, currentDeviceData );
    console.log( "pushDeviceId:",pushDeviceId );

    // If device info or push device id changed:
    // pushDeviceId - if provided, need to update device.
    if (pushDeviceId || deviceInfoChanged || (!deviceInfoChanged && !currentDeviceId)) {
      const newDeviceData = {
        device: {
          ...currentDeviceData,
          // TODO: do I needed these?
          key: pushDeviceId || null,
          kind: 'cable',
          // Possible variations:
          // key: pushDeviceId for websokets,
          // kind: 'cable' for websokets.
          // ----------------------------
          // key: pushToken for notifications.
          // kind: 'fcm'/'apple' for push notifications.
        },
      };

      if (currentDeviceId) {
        console.log( "UPDATE DEVICE data:" , newDeviceData );
        // UPDATE existing cable with new device data.
        returnedDeviceData = await dispatch(updateDevice(newDeviceData));
      } else {
        console.log( "CREATE DEVICE data:" , newDeviceData );
        // CREATE new cable with new device data.
        returnedDeviceData = await dispatch(createDevice(newDeviceData));
      }

      console.log( "!!!!!!! returnedDeviceData:" ); console.log( returnedDeviceData );
    }

    if (returnedDeviceData.id) {
      deviceId = returnedDeviceData.id;
    } else {
      deviceId = currentDeviceId;
    }
    console.log( ">>>>>>>>>>>>>Setup web sockets.:", deviceId );
    // Setup web sockets.
    dispatch(setupSockets(deviceId));
  };
}

// Register device token on the remote server.
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
        // key: pushDeviceId for websokets,
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
    console.log(notificationId, 'ASDFASDF');
    if (!notificationId) return;

    const results: any = await dispatch(
      request({
        ...ROUTES.GET_NOTIFICATIONS,
        pathParams: { notificationId },
        params: { ...params },
      }),
    );
    console.log('NOTIFICATIONS', results);
    dispatch({
      type: REDUX_ACTIONS.UPDATE_NOTIFICATION_PAGINATION,
      result: { results, params },
    });

    return results;
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
        }),
      );
    } else {
      results = await dispatch(
        request({
          ...ROUTES.UNFAVORITE_VIDEO,
          pathParams: { videoId: video.id },
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
