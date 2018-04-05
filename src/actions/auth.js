import RNFetchBlob from 'react-native-fetch-blob';
import { Linking, Platform, AppState, ToastAndroid, AsyncStorage, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
// import FilesystemStorage from 'redux-persist-filesystem-storage';

import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN, UPDATE_TOKENS, NO_BACKGROUND_ACTION } from '../constants';
import callApi, { REQUESTS } from './api';
import { establishDevice, setupSocketAction, closeSocketAction, destroyDevice, getDevices, checkAndRunSockets } from './socket';
import { getConversations, getMessages } from './messages';
import { API_URL } from '../api/utils';
import { isArray } from '../utils/common';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';


// Setup app state change listeners
let appStateChangeFn;
let currentAppState = AppState.currentState || '';

let hasStartedUp = false;

export function startupAction() {
  return (dispatch, getState) => {
    Orientation.lockToPortrait();
    // PushNotification.setApplicationIconBadgeNumber(0);
    if (hasStartedUp) return;

    hasStartedUp = true;
    dispatch(establishDevice());
    if (appStateChangeFn) {
      AppState.removeEventListener('change', appStateChangeFn);
    } else {
      appStateChangeFn = appStateChange.bind(null, dispatch, getState);
    }
    AppState.addEventListener('change', appStateChangeFn);
  };
}

export function cleanupAction() {
  return (dispatch, getState) => {
    hasStartedUp = false;
    LOG('removing appState listener');
    AppState.removeEventListener('change', appStateChangeFn);
  };
}

let backgroundTimeout;
const BACKGROUND_TIMEOUT = 1500;
let appCloseTime;

// TODO: It would be nice to somehow do this in the background and not block the UI when coming back into the app
function appStateChange(dispatch, getState, nextAppState) {
  const { cableId, token, noBackgroundAction } = getState().auth;
  LOG(nextAppState);
  // Sometimes this runs when logging out and causes a network error
  // Only run it when there is a valid token
  if (!token) {
    return;
  }

  // LOG('appStateChange', nextAppState, currentAppState, cableId);
  if (nextAppState === 'active') {
    LOG('App has come to the foreground!');

    // Put the ACTIVE actions in a short timeout so they don't run when the app switches quickly
    const now = Date.now();
    // const BACKGROUND_REFRESH_TIME = 5 * 60 * 1000; // 5 minutes
    const BACKGROUND_REFRESH_TIME = 3 * 1000; // 3 seconds
    if (now - appCloseTime > BACKGROUND_REFRESH_TIME) {
      dispatch(getConversations());
    }
    const currentConvId = getState().messages.activeConversationId;
    if (currentConvId) {
      dispatch(getMessages(currentConvId));
    }

    dispatch(checkAndRunSockets());

    // Clear out home screen badge when user comes back into the app
    PushNotification.setApplicationIconBadgeNumber(0);

  } else if (nextAppState === 'background' || nextAppState === 'inactive') {
    LOG('App is going into the background');

    dispatch(closeSocketAction());
    appCloseTime = Date.now();
  }
  currentAppState = nextAppState;
}



export function loginAction(token, allData = {}) {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({
        type: LOGIN,
        token,
        data: allData,
      });
      resolve();
      // dispatch(resetHomeAction());
    })
  );
}

export function setUserAction(user) {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({
        type: SET_USER,
        user,
      });
      resolve();
      // dispatch(resetHomeAction());
    })
  );
}

export function registerPushToken(token) {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({
        type: SET_PUSH_TOKEN,
        pushToken: token,
      });
      resolve();
      // dispatch(resetHomeAction());
    })
  );
}

export function logoutAction() {
  return (dispatch, getState) => (
    new Promise((resolve) => {
      const token = getState().auth.token;
      if (token) {
        dispatch(getDevices()).then((results) => {
          LOG('get devices results', results);
          if (results && isArray(results.devices)) {
            // Pass the token into this function because the LOGOUT action will clear it out
            const deviceIds = results.devices.map((d) => d.id);
            if (deviceIds.length > 0) {
              dispatch(callApi(REQUESTS.REVOKE_TOKEN, {
                access_token: token,
              }, {
                device_ids: deviceIds,
                token: null,
              }));
            }
          }
        });
      }
      dispatch(cleanupAction());
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
      dispatch(clearAndroid());
    })
  );
}

export function createAccountAction(email, password) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      dispatch(callApi(REQUESTS.ME, {}, {
        // Some data can be set in the REQUESTS object,
        // so we don't need it in here
        email,
        password,
        timezone_name: DeviceInfo.getTimezone(),
      })).then((results) => {
        if (!results.errors) {
          LOG('create account success', results);
          dispatch(loginAction(results.access_token.access_token, results.access_token));
          // dispatch(messagesAction());
          // Do something with the results
        } else {
          LOG('Failed to create account', results.errors);
          reject(results);
          return;
        }
        resolve(results);
      }).catch((error) => {
        LOG('error creating account', error);
        reject(error);
      });
    })
  );
}

export function toastAction(text, length) {
  return () => {
    if (Platform.OS === 'android') {
      const toastLength = length === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
      ToastAndroid.show(text, toastLength);
    } else {
      Alert.alert(' ', text);
    }
  };
}

export function forgotPasswordAction(email) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      const data = {
        me: {
          email,
        },
      };
      dispatch(callApi(REQUESTS.FORGOT_PASSWORD, {}, data)).then(resolve).catch(reject);
    })
  );
}

export function anonLogin(username, password) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      dispatch(callApi(REQUESTS.OAUTH, {}, {
        username: username,
        password: password,
      })).then((results) => {
        dispatch(loginAction(results.access_token, results)).then(() => {
          dispatch(getMe());
        });
        resolve(results);
        return results;
      }).catch(reject);
    })
  );
}

export function facebookLoginAction(accessToken) {
  // LOG('access token for fb', accessToken);
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      assertion: accessToken,
    })).then((results) => {
      dispatch(loginAction(results.access_token, results));
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      LOG('error logging in', error);
    });
  };
}

export function getMe() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_ME)).then((results) => {
      // LOG('user results', results);
      dispatch(setUserAction(results));
      return results;
    }).catch(() => {
      // LOG('error getting me', error);
    });
  };
}

export function updateMe(data) {
  return (dispatch) => {
    if (data.avatar) {
      return dispatch(updateMeImage(data.avatar));
    }
    let newData = {...data};
    newData.timezone_name = DeviceInfo.getTimezone();
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, newData)).then((results) => {
      dispatch(getMe());
      return results;
    }).catch(() => {
      // LOG('error updating me', error);
    });
  };
}

export function updateMeImage(avatar) {
  return (dispatch) => {
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

    return dispatch(callApi(REQUESTS.UPDATE_ME_IMAGE, {}, data)).then((results) => {
      LOG('update me image successful', results);
      dispatch(getMe());
      return results;
    }).catch((error) => {
      LOG('error updating me image', error);
    });
  };
}

export function createMobileVerification(data) {
  return (dispatch) => {
    let newData = {...data};
    newData.mobile.country_code = DeviceInfo.getDeviceCountry();
    return dispatch(callApi(REQUESTS.CREATE_MOBILE_VERIFICATION, {}, newData)).then((results) => {
      LOG('Verify mobile request successfully sent', results);
      return results;
    });
  };
}

export function verifyMobile(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VERIFY_MOBILE, {}, data)).then((results) => {
      LOG('Mobile successfully verified', results);
      return results;
    });
  };
}

export function blockMessenger(data) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/block`,
    };
    return dispatch(callApi(REQUESTS.BLOCK_MESSENGER, query));
  };
}

export function unblockMessenger(data) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/unblock`,
    };
    return dispatch(callApi(REQUESTS.UNBLOCK_MESSENGER, query));
  };
}

export function reportUserAction(report, messenger) {
  return (dispatch) => {
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
    if (Platform.OS === 'ios') {
      const APP_SETTINGS_URL = 'app-settings:';
      Linking.canOpenURL(APP_SETTINGS_URL).then((isSupported) => {
        if (isSupported) {
          return Linking.openURL(APP_SETTINGS_URL);
        }
      }).catch((err) => {
        LOG('error opening app settings url', err);
      });
    } else {
      // Android link to settings not needed
    }
  };
}

export function setNoBackgroundAction(value) {
  return (dispatch) => {
    dispatch({ type: NO_BACKGROUND_ACTION, value });
  };
}

export function clearAndroid() {
  return () => {
    // For Android, clear out the file system storage on logout so it doesn't get cached incorrectly
    // if (Platform.OS === 'android') {
    //   FilesystemStorage.getAllKeys((err, keys = []) => {
    //     if (isArray(keys)) {
    //       keys.forEach((k) => FilesystemStorage.removeItem(k, (err) => {
    //         LOG('err', err);
    //       }));
    //     }
    //   });
    // }
  };
}
