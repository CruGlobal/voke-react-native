import RNFetchBlob from 'react-native-fetch-blob';
import { Linking, Platform, AppState, ToastAndroid, AsyncStorage, Alert } from 'react-native';
// import { Navigation } from 'react-native-navigation';

import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN } from '../constants';
import callApi, { REQUESTS } from './api';
import { establishDevice, setupSocketAction, closeSocketAction, destroyDevice, getDevices } from './socket';
import { getConversations } from './messages';
import { API_URL } from '../api/utils';
import Orientation from 'react-native-orientation';


// Setup app state change listeners
let appStateChangeFn;
let currentAppState = AppState.currentState || '';

export function startupAction(navigator) {
  return (dispatch, getState) => {
    dispatch(establishDevice(navigator));
    appStateChangeFn = appStateChange.bind(null, dispatch, getState, navigator);
    AppState.addEventListener('change', appStateChangeFn);
    Orientation.lockToPortrait();
  };
}

export function cleanupAction() {
  return () => {
    // LOG('removing appState listener');
    AppState.removeEventListener('change', appStateChangeFn);
  };
}

let backgroundTimeout;
const BACKGROUND_TIMEOUT = 3000;

// TODO: It would be nice to somehow do this in the background and not block the UI when coming back into the app
function appStateChange(dispatch, getState, navigator, nextAppState) {
  const { cableId, token } = getState().auth;

  // Sometimes this runs when logging out and causes a network error
  // Only run it when there is a valid token
  if (!token) {
    return;
  }

  // LOG('appStateChange', nextAppState, currentAppState, cableId);
  if (nextAppState === 'active' && (currentAppState === 'inactive' || currentAppState === 'background')) {
    LOG('App has come to the foreground!');
    
    // Put the ACTIVE actions in a short timeout so they don't run when the app switches quickly
    clearTimeout(backgroundTimeout);
    
    backgroundTimeout = setTimeout(() => {
      // Restart sockets
      if (cableId) {
        dispatch(setupSocketAction(cableId));
      } else {
        dispatch(establishDevice(navigator));
      }
    }, BACKGROUND_TIMEOUT);
    
  } else if (nextAppState === 'background' && (currentAppState === 'inactive' || currentAppState === 'active')) {
    LOG('App is going into the background');
    
    // Put the BACKGROUND actions in a short timeout so they don't run when the app switches quickly
    clearTimeout(backgroundTimeout);
    backgroundTimeout = setTimeout(() => {
      // Close sockets
      dispatch(closeSocketAction());
    }, BACKGROUND_TIMEOUT);
  }
  currentAppState = nextAppState;
}




export function loginAction(token, user = {}) {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({
        type: LOGIN,
        token,
        user,
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
      dispatch(getDevices()).then((results) => {
        LOG('devices results', results);
        // Pass the token into this function because the LOGOUT action will clear it out
        results.devices.forEach((m) => {
          dispatch(destroyDevice(m.id, token));
        });
      });
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
    })
  );
}

export function createAccountAction(email, password) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.ME, {}, {
      // Some data can be set in the REQUESTS object,
      // so we don't need it in here
      email,
      password,
    })).then((results) => {
      if (!results.errors) {
        LOG('create account success', results);
        dispatch(loginAction(results.access_token.access_token));
        // dispatch(messagesAction());
        // Do something with the results
        return results;
      }
      else LOG('Failed to create account', results.errors);
      return results;
    }).catch((error) => {
      LOG('error creating account', error);
    });
  };
}

export function toastAction(text) {
  return () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    } else {
      Alert.alert(' ', text);
    }
  };
}

export function forgotPasswordAction(email) {
  return (dispatch) => (
    new Promise((resolve, reject) => {
      const data = { me: email };
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
        dispatch(loginAction(results.access_token)).then(() => {
          dispatch(getMe());
        });
        resolve(results);
        return results;
      }).catch(reject);
    })
  );
}

export function facebookLoginAction(accessToken) {
  LOG('access token for fb', accessToken);
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      assertion: accessToken,
    })).then((results) => {
      LOG('auth success', results);
      dispatch(loginAction(results.access_token));
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
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, data)).then((results) => {
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
    return dispatch(callApi(REQUESTS.CREATE_MOBILE_VERIFICATION, {}, data)).then((results) => {
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
