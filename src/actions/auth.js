import { Alert, Platform, ToastAndroid, AsyncStorage } from 'react-native';
import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN } from '../constants';
import callApi, { REQUESTS } from './api';
import { establishDevice, destroyDevice, getDevices } from './socket';
import { API_URL } from '../api/utils';

// import { navigateResetLogin } from './navigation_new';
// import { resetLoginAction, resetHomeAction } from './navigation';
// import PushNotification from 'react-native-push-notification';

export function startupAction(navigator) {
  return (dispatch) => {
    dispatch(establishDevice(navigator));
  };

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
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch(getDevices()).then((results)=> {
        results.devices.forEach((m)=>{
          dispatch(destroyDevice(m.id));
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
      // Alert.alert('', text);
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
      dispatch(loginAction(results.access_token)).then(()=>{
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
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, data)).then((results) => {
      LOG('update me successful', results);
      dispatch(getMe());
      return results;
    }).catch((error) => {
      LOG('error updating me', error);
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
