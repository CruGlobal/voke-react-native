import RNFetchBlob from 'react-native-fetch-blob';
import { Linking, AppState, ToastAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Firebase from 'react-native-firebase';
import * as RNOmniture from 'react-native-omniture';
import NetInfo from '@react-native-community/netinfo';

import {
  LOGIN,
  LOGOUT,
  SET_USER,
  SET_PUSH_TOKEN,
  NO_BACKGROUND_ACTION,
  PUSH_PERMISSION,
  RESET_FIRST_TIME,
  SET_TOAST,
} from '../constants';
import { getJourneyInvites, getMyJourneys } from './journeys';
import callApi, { REQUESTS } from './api';
import {
  establishDevice,
  closeSocketAction,
  getDevices,
  checkAndRunSockets,
  establishCableDevice,
} from './socket';
import {
  getAllOrganizations,
  getFeaturedOrganizations,
  getMyOrganizations,
} from './channels';
import { API_URL } from '../api/utils';
import { isArray, locale } from '../utils/common';
import theme from '../theme';
import Permissions from '../utils/permissions';
import { logInAnalytics } from './analytics';
import i18n from '../i18n';
import { navigateResetMessage, navigateBack } from './nav';

let appStateChangeFn;

let hasStartedUp = false;
let firebaseLinkHandler;

export function startupAction() {
  return (dispatch, getState) => {
    if (hasStartedUp) return;

    // if its not the users first time in the app, send openVoke so that they get a welcome message
    const isFirstTime = getState().auth.isFirstTime;
    if (isFirstTime) {
      dispatch({ type: RESET_FIRST_TIME });
    } else {
      dispatch(setOpenVoke());
    }

    // Check whether they have push permissions or not and set up sockets with the appropriate devices.
    dispatch(checkPushPermissions());
    hasStartedUp = true;
    if (appStateChangeFn) {
      AppState.removeEventListener('change', appStateChangeFn);
    } else {
      appStateChangeFn = appStateChange.bind(null, dispatch, getState);
    }
    AppState.addEventListener('change', appStateChangeFn);
    Firebase.analytics().setAnalyticsCollectionEnabled(true);
    dispatch(setupFirebaseLinks());
    firebaseLinkHandler = Firebase.links().onLink(link => {
      dispatch(handleFirebaseLink(link));
    });
  };
}

export function setupFirebaseLinks() {
  return async dispatch => {
    // Firebase dynamic links
    let initialLink;
    try {
      initialLink = await Firebase.links().getInitialLink();
    } catch (e) {
      LOG('error getting Firebase initial link');
    }
    if (initialLink) {
      dispatch(handleFirebaseLink(initialLink));
    }
  };
}

export function handleFirebaseLink(link) {
  return () => {
    LOG('handling link', link);
  };
}

export function cleanupAction() {
  return () => {
    hasStartedUp = false;
    AppState.removeEventListener('change', appStateChangeFn);
  };
}

let appCloseTime;

function appStateChange(dispatch, getState, nextAppState) {
  const { token } = getState().auth;
  // Sometimes this runs when logging out and causes a network error
  // Only run it when there is a valid token
  if (!token) {
    return;
  }

  if (nextAppState === 'active') {
    // Tracking
    RNOmniture.collectLifecycleData(getState().analytics);

    NetInfo.fetch().then(netInfoState => {
      if (!netInfoState.isConnected) {
        Alert.alert(
          'Oops! It doesnt look like you are connected to the internet.',
        );
        return;
      }

      const now = Date.now();
      const BACKGROUND_REFRESH_TIME = 1000 * 3600 * 24; // 24 hours
      if (now - appCloseTime > BACKGROUND_REFRESH_TIME) {
        dispatch(getAllOrganizations());
        dispatch(getMyOrganizations());
        dispatch(getFeaturedOrganizations());
        dispatch(setOpenVoke());
        dispatch(getJourneyInvites());
        dispatch(getMyJourneys());
      }
      dispatch(checkAndRunSockets());
    });
  } else if (nextAppState === 'background' || nextAppState === 'inactive') {
    dispatch(closeSocketAction());
    appCloseTime = Date.now();
  }
}

export function checkPushPermissions() {
  return dispatch => {
    Permissions.checkPush().then(response => {
      dispatch({ type: PUSH_PERMISSION, permission: response });
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      if (response === 'authorized') {
        dispatch(establishDevice());
      } else {
        dispatch(establishCableDevice());
      }
    });
  };
}

export function loginAction(token, allData = {}) {
  return dispatch =>
    new Promise(async resolve => {
      dispatch({
        type: LOGIN,
        token,
        data: allData,
      });

      // Analytics
      dispatch(logInAnalytics());
      const mePerson = await dispatch(getMe());
      RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);
      resolve();
    });
}

export function setUserAction(user) {
  return dispatch =>
    new Promise(resolve => {
      dispatch({
        type: SET_USER,
        user,
      });
      resolve();
      // dispatch(resetHomeAction());
    });
}

export function registerPushToken(token) {
  return dispatch =>
    new Promise(resolve => {
      dispatch({
        type: SET_PUSH_TOKEN,
        pushToken: token,
      });
      resolve();
    });
}

export function logoutAction(isDelete = false) {
  return (dispatch, getState) =>
    new Promise(resolve => {
      const token = getState().auth.token;
      if (token && !isDelete) {
        dispatch(getDevices()).then(results => {
          if (results && isArray(results.devices)) {
            // Pass the token into this function because the LOGOUT action will clear it out
            const deviceIds = results.devices.map(d => d.id);
            if (deviceIds.length > 0) {
              dispatch(
                callApi(
                  REQUESTS.REVOKE_TOKEN,
                  {
                    access_token: token,
                  },
                  {
                    device_ids: deviceIds,
                    token: null,
                  },
                ),
              );
            }
          }
        });
      }
      dispatch(cleanupAction());
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
    });
}

export function createAccountAction(
  email,
  password,
  isAnonymous = false,
  params = {},
) {
  return dispatch =>
    new Promise((resolve, reject) => {
      let data = {
        me: {
          ...params,
          timezone_name: DeviceInfo.getTimezone(),
          country_code: DeviceInfo.getDeviceCountry(),
          language: {
            language_code: locale,
          },
        },
      };
      if (email) data.email = email;
      if (password) data.password = password;

      if (isAnonymous) {
        data = {
          me: {
            ...params,
            timezone_name: DeviceInfo.getTimezone(),
            anonymous: true,
            country_code: DeviceInfo.getDeviceCountry(),
            language: {
              language_code: locale,
            },
          },
        };
      }
      dispatch(callApi(REQUESTS.ME, {}, data))
        .then(results => {
          if (!results.errors) {
            // LOG('create account success', results);
            dispatch(
              loginAction(
                results.access_token.access_token,
                results.access_token,
              ),
            );
            // dispatch(messagesAction());
            // Do something with the results
          } else {
            LOG('Failed to create account', results.errors);
            reject(results);
            return;
          }
          resolve(results);
        })
        .catch(error => {
          LOG('error creating account', error);
          reject(error);
        });
    });
}

export function toastAction(text, length) {
  return dispatch => {
    if (theme.isAndroid) {
      const toastLength =
        length === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
      ToastAndroid.show(text, toastLength);
    } else {
      dispatch({
        type: SET_TOAST,
        props: { text, timeout: length === 'long' ? 8000 : undefined },
      });
    }
  };
}

export function forgotPasswordAction(email) {
  return dispatch =>
    new Promise((resolve, reject) => {
      const data = {
        me: {
          email,
        },
      };
      dispatch(callApi(REQUESTS.FORGOT_PASSWORD, {}, data))
        .then(resolve)
        .catch(reject);
    });
}

export function deleteAccount() {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch(callApi(REQUESTS.DELETE_ACCOUNT))
        .then(resolve)
        .catch(reject);
    });
}

export function anonLogin(username, password, anonId) {
  return dispatch =>
    new Promise(async (resolve, reject) => {
      let data = {
        username,
        password,
      };
      if (anonId) {
        data.anonymous_user_id = anonId;
      }
      try {
        const results = await dispatch(callApi(REQUESTS.OAUTH, {}, data));
        await dispatch(loginAction(results.access_token, results));
        await dispatch(getMe());
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
}

export function facebookLoginAction(accessToken, anonId) {
  // LOG('access token for fb', accessToken);
  return dispatch => {
    let data = { assertion: accessToken };
    if (anonId) {
      data.anonymous_user_id = anonId;
    }
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, data))
      .then(results => {
        dispatch(loginAction(results.access_token, results));
        // dispatch(messagesAction());
        // Do something with the results
        return results;
      })
      .catch(error => {
        LOG('error logging in', error);
      });
  };
}

export function getMe() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_ME))
      .then(results => {
        dispatch(setUserAction(results));
        return results;
      })
      .catch(() => {
        // LOG('error getting me', error);
      });
  };
}

export function updateMe(data) {
  return dispatch => {
    if (data.avatar) {
      return dispatch(updateMeImage(data.avatar));
    }
    let newData = { ...data };
    newData.timezone_name = DeviceInfo.getTimezone();
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, newData))
      .then(results => {
        dispatch(getMe());
        return results;
      })
      .catch(error => {
        LOG('error updating me', error);
        return Promise.reject(error);
      });
  };
}

export function updateMeImage(avatar) {
  return dispatch => {
    if (!avatar.fileName) {
      LOG('Must have a filename for updating an avatar');
      return Promise.reject();
    }

    // Need image upload data in this format for the RNFetchBlob request
    const data = {
      name: 'me[avatar]',
      filename: avatar.fileName,
      type: 'image/jpeg',
      data: RNFetchBlob.wrap(avatar.uri.replace('file://', '')),
    };
    LOG('data', data);

    return dispatch(callApi(REQUESTS.UPDATE_ME_IMAGE, {}, data))
      .then(results => {
        LOG('update me image successful', results);
        dispatch(getMe());
        return results;
      })
      .catch(error => {
        LOG('error updating me image', error);
      });
  };
}

export function blockMessenger(data) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/block`,
    };
    return dispatch(callApi(REQUESTS.BLOCK_MESSENGER, query));
  };
}

export function unblockMessenger(data) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/unblock`,
    };
    return dispatch(callApi(REQUESTS.UNBLOCK_MESSENGER, query));
  };
}

export function reportUserAction(report, messenger) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${messenger}/reports`,
    };
    const data = {
      report: {
        comment: report,
      },
    };
    return dispatch(callApi(REQUESTS.REPORT_MESSENGER, query, data));
  };
}

export function openSettingsAction() {
  return () => {
    if (!theme.isAndroid) {
      const APP_SETTINGS_URL = 'app-settings:';
      Linking.canOpenURL(APP_SETTINGS_URL)
        .then(isSupported => {
          if (isSupported) {
            return Linking.openURL(APP_SETTINGS_URL);
          }
        })
        .catch(err => {
          LOG('error opening app settings url', err);
        });
    } else {
      // Android link to settings not needed
    }
  };
}

export function setNoBackgroundAction(value) {
  return dispatch => {
    dispatch({ type: NO_BACKGROUND_ACTION, value });
  };
}

export function setOpenVoke() {
  return dispatch => {
    return dispatch(
      callApi(
        REQUESTS.POST_OPEN_VOKE,
        {},
        {
          version: DeviceInfo.getReadableVersion(),
        },
      ),
    );
  };
}

export function confirmAlert(title, message, onPress, text, onCancel) {
  return () => {
    Alert.alert(title, message, [
      {
        text: i18n.t('cancel'),
        onPress: onCancel,
        style: 'cancel',
      },
      { text: text || i18n.t('ok'), onPress },
    ]);
  };
}

export function shareVideo(video, onSelectVideo, conversation) {
  return dispatch => {
    dispatch(
      confirmAlert(
        i18n.t('videos:addToChat'),
        i18n.t('videos:areYouSureAdd', {
          name: video.name.substr(0, 25).trim(),
        }),
        () => {
          onSelectVideo(video.id);
          // Navigate back after selecting the video
          if (conversation) {
            dispatch(navigateResetMessage({ conversation }));
          } else {
            dispatch(navigateBack());
          }
        },
        i18n.t('add'),
      ),
    );
  };
}
