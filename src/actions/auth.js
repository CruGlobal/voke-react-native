import { Alert, Platform, ToastAndroid, AsyncStorage } from 'react-native';
import { LOGIN, LOGOUT, SET_USER } from '../constants';
import callApi, { REQUESTS } from './api';
import { establishDevice } from './socket';
// import { navigateResetLogin } from './navigation_new';
// import { resetLoginAction, resetHomeAction } from './navigation';
import PushNotification from 'react-native-push-notification';

export function startupAction(navigator) {
  return (dispatch) => {
    dispatch(establishDevice(navigator));
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.warn( 'TOKEN:', token );
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.warn( 'NOTIFICATION:', notification );
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: "YOUR GCM SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
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

export function logoutAction() {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
      console.warn('TODO: Reset to login page');
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
      console.warn('create account success', results);
      dispatch(loginAction(results.access_token.access_token));
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      console.warn('error creating account', error);
    });
  };
}

export function toastAction(text) {
  return () => {
    // TODO: Implement an iOS notification
    if (Platform.OS === 'android') {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    } else {
      Alert.alert('', text);
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
      // Some data can be set in the REQUESTS object,
      // so we don't need it in here
      username: username,
      password: password,
    })).then((results) => {
      console.warn('auth success', results);
      dispatch(loginAction(results.access_token)).then(()=>{
        dispatch(getMe());
      });
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      console.warn('error logging in', error);
    });
  };
}

export function getMe() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_ME, {}, {})).then((results) => {
      console.warn('get me successful', results);
      dispatch(setUserAction(results));
      return results;
    }).catch((error) => {
      console.warn('error getting me', error);
    });
  };
}

export function updateMe(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, data)).then((results) => {
      console.warn('update me successful', results);
      dispatch(getMe());
      return results;
    }).catch((error) => {
      console.warn('error updating me', error);
    });
  };
}

export function createMobileVerification(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_MOBILE_VERIFICATION, {}, data)).then((results) => {
      console.warn('Verify mobile request successfully sent', results);
      return results;
    }).catch((error) => {
      console.warn('error sending verification for mobile number', error);
    });
  };
}

export function verifyMobile(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VERIFY_MOBILE, {}, data)).then((results) => {
      console.warn('Mobile successfully verified', results);
      return results;
    }).catch((error) => {
      console.warn('error verifying mobile', error);
    });
  };
}
