import RNFetchBlob from 'react-native-fetch-blob';
import { Linking, Platform, AppState, ToastAndroid, AsyncStorage, Alert } from 'react-native';

import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN } from '../constants';
import callApi, { REQUESTS } from './api';
import { establishDevice, setupSocketAction, closeSocketAction, destroyDevice, getDevices } from './socket';
import { getConversations } from './messages';
import { API_URL } from '../api/utils';


// Setup app state change listeners
let appStateChangeFn;
let currentAppState = AppState.currentState;
export function startupAction(navigator) {
  return (dispatch, getState) => {
    dispatch(establishDevice(navigator));
    appStateChangeFn = appStateChange.bind(null, dispatch, getState);
    AppState.addEventListener('change', appStateChangeFn);
  };
}

export function cleanupAction() {
  return () => {
    // LOG('removing appState listener');
    AppState.removeEventListener('change', appStateChangeFn);
  };
}

function appStateChange(dispatch, getState, nextAppState) {
  const cableId = getState().auth.cableId;
  // LOG('appStateChange', nextAppState, currentAppState, cableId);
  if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
    LOG('App has come to the foreground!');
    // Restart sockets
    if (cableId) {
      dispatch(setupSocketAction(cableId));
    } else {
      dispatch(establishDevice());
    }
    // Get the latest conversations whenever the user comes back into the app
    dispatch(getConversations());
  } else if (currentAppState.match(/active/) && nextAppState === 'background') {
    LOG('App is going into the background');
    // Close sockets
    dispatch(closeSocketAction());
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
        // Pass the token into this function because the LOGOUT action will clear it out
        results.devices.forEach((m) => {
          dispatch(destroyDevice(m.id, token));
        });
        dispatch({ type: LOGOUT });
      });
      resolve();
      AsyncStorage.clear();
      LOG('TODO: Reset to login page');
      // dispatch(navigateResetLogin());
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
    // TODO: Implement an iOS notification
    if (Platform.OS === 'android') {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    } else {
      Alert.alert(text);
    }
  };
}

export function forgotPasswordAction(email) {
  let data = {
    me: email,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FORGOT_PASSWORD, {}, data));
  };
}

export function anonLogin(username, password) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.OAUTH, {}, {
      username: username,
      password: password,
    })).then((results) => {
      LOG('auth success', results);
      dispatch(loginAction(results.access_token)).then(() => {
        dispatch(getMe());
      });
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      LOG('error logging in', error);
    });
  };
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
    return dispatch(callApi(REQUESTS.GET_ME, {}, {})).then((results) => {
      LOG('get me successful', results);
      dispatch(setUserAction(results));
      return results;
    }).catch((error) => {
      LOG('error getting me', error);
    });
  };
}

export function updateMe(data) {
  return (dispatch) => {
    if (data.avatar) {
      return dispatch(updateMeImage(data.avatar));
    }
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, data)).then((results) => {
      LOG('update me successful', results);
      dispatch(getMe());
      return results;
    }).catch((error) => {
      LOG('error updating me', error);
    });
  };
}

export function updateMeImage(avatar) {
  return (dispatch) => {
    if (!avatar.fileName) {
      LOG('Must have a filename for updating an avatar');
      return;
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
    }).catch((error) => {
      LOG('error sending verification for mobile number', error);
    });
  };
}

export function verifyMobile(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VERIFY_MOBILE, {}, data)).then((results) => {
      LOG('Mobile successfully verified', results);
      return results;
    }).catch((error) => {
      LOG('error verifying mobile', error);
    });
  };
}

export function blockMessenger(data) {
  let query = {
    endpoint: `${API_URL}/messengers/${data}/block`,
  };
  LOG('this is my data here', data);
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.BLOCK_MESSENGER, query)).then((results) => {
      LOG('Successfully blocked user', results);
      return results;
    }).catch((error) => {
      LOG('error blocking user', error);
    });
  };
}

export function unblockMessenger(data) {
  let query = {
    endpoint: `${API_URL}/messengers/${data}/unblock`,
  };
  LOG('this is my data here', data);
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.UNBLOCK_MESSENGER, query)).then((results) => {
      LOG('Successfully blocked user', results);
      return results;
    }).catch((error) => {
      LOG('error blocking user', error);
    });
  };
}

export function reportUserAction(report, messenger) {
  let query = {
    endpoint: `${API_URL}/messengers/${messenger}/reports`,
  };
  let data = {
    report: {
      comment: report,
    },
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.REPORT_MESSENGER, query, data)).then((results) => {
      LOG('Successfully reported user', results);
      return results;
    }).catch((error) => {
      LOG('error reporting user', error);
    });
  };
}


export function openSettingsAction() {
  return () => {
    if (Platform.OS === 'ios') {
      Linking.canOpenURL('app-settings:').then((isSupported) => {
        isSupported && Linking.openURL('app-settings:');
      }, (err) => LOG('opening url', err));
    } else {
      // link to android
    }
  };
}
