import request from './utils';
import ROUTES from './routes';
import { REDUX_ACTIONS } from '../constants';
import { ThunkDispatch } from 'redux-thunk';
import { DataKeys } from '../reducers/data';
import deviceInfoModule from 'react-native-device-info';
import { Platform } from 'react-native';
import st from '../st';
import { isEquivalentObject, exists } from '../utils';
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

export function getMyAdventures() {
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_MY_ADVENTURES }),
    );
    const myAdventures = results.journeys;
    dispatch(setData('myAdventures', myAdventures));
    return results;
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
  return async (dispatch: Dispatch, getState: any) => {
    const results: any = await dispatch(
      request({ ...ROUTES.GET_ADVENTURE_INVITATIONS }),
    );
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
    const result = await dispatch(
      request({
        ...ROUTES.CREATE_ADVENTURE_STEP_MESSAGE,
        pathParams: {
          adventureConversationId: params.adventure.conversation.id,
        },
        data,
      }),
    );
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

export function destroyDevice(cableId: any) {
  return async (dispatch: Dispatch, getState: any) => {
    let results: any;
    results = await dispatch(
      request({
        ...ROUTES.DESTROY_DEVICE,
        pathParams: { cableId },
      }),
    );

    return results;
  };
}

export function updateDevice(device: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const cableId = getState().auth.cableId;
    let results: any;
    results = await dispatch(
      request({
        ...ROUTES.UPDATE_DEVICE,
        pathParams: { cableId },
        data: device,
      }),
    );

    if (results.id) {
      dispatch(setupSockets(results.id));
    }
    dispatch(setAuthData('deviceInformation', results));

    return results;
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

export function createDevice(data: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const results = await dispatch(
      request({
        ...ROUTES.CREATE_DEVICE,
        data,
      }),
    );
    dispatch(setAuthData('deviceInformation', results));
    return results;
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

export function establishCableDevice(pushDeviceId?: any) {
  return async (dispatch: Dispatch, getState: any) => {
    const auth = getState().auth;
    const currentDeviceInfo = {
      version: 1,
      local_id: deviceInfoModule.getDeviceId(),
      local_version: deviceInfoModule.getVersion(),
      family: deviceInfoModule.getBrand(),
      name: deviceInfoModule.getModel(),
      os: `${Platform.OS} ${deviceInfoModule.getSystemVersion()}`,
    };
    const isEquivalent = isEquivalentObject(
      auth.deviceInformation,
      currentDeviceInfo,
    );
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
        const newDevice: any = await dispatch(createDevice(data));
        if (newDevice.id) {
          dispatch(setupSockets(newDevice.id));
        }
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
        const newDevice: any = await dispatch(createDevice(data));
        if (newDevice.id) {
          dispatch(setupSockets(newDevice.id));
        }
      }
    } else {
      dispatch(setupSockets(auth.cableId));
    }
  };
}

export function establishPushDevice() {
  return async (dispatch: Dispatch, getState: any) => {
    const auth = getState().auth;

    const currentDeviceInfo = {
      version: 1,
      local_id: deviceInfoModule.getDeviceId(),
      local_version: deviceInfoModule.getVersion(),
      family: deviceInfoModule.getBrand(),
      name: deviceInfoModule.getModel(),
      os: `${Platform.OS} ${deviceInfoModule.getSystemVersion()}`,
    };

    if (auth.pushToken) {
      let data = {
        device: {
          ...currentDeviceInfo,
          key: auth.pushToken,
          kind: st.isAndroid ? 'fcm' : 'apple',
        },
      };
      const newDevice: any = await dispatch(createDevice(data));
      return newDevice;
    }
  };
}

export function registerPushToken(token: any) {
  return async (dispatch: Dispatch, getState: any) => {
    dispatch({
      type: REDUX_ACTIONS.SET_PUSH_TOKEN,
      pushToken: token,
    });
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
