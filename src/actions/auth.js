import { Alert, Platform, ToastAndroid, AsyncStorage } from 'react-native';
import { LOGIN, LOGOUT } from '../constants';
import callApi, { REQUESTS } from './api';
import { messagesAction } from './messages';
// import { resetLoginAction, resetHomeAction } from './navigation';

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

export function logoutAction() {
  return (dispatch) => (
    new Promise((resolve) => {
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
    })
  );
}

export function createAccountAction(user, password) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.ME, {}, {
      // Some data can be set in the REQUESTS object,
      // so we don't need it in here
      email: 'ben@ben.com',
      password: 'password',
    })).then((results) => {
      console.warn('create account success', results);
      // dispatch(loginAction(results.access_token));
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
      return results;
    }).catch((error) => {
      console.warn('error getting me', error);
    });
  };
}
