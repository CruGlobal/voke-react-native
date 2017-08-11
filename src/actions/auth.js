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
  return (dispatch) => (
    new Promise((resolve) => {
      // TODO: Sign in request
      resolve();
      // dispatch(resetHomeAction());
    })
  );
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

export function anonLogin() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.OAUTH, {}, {
      // Some data can be set in the REQUESTS object,
      // so we don't need it in here
      username: 'duane%40muellerschumm.name',
      password: 'onthejourney',
    })).then((results) => {
      console.warn('auth success', results);
      dispatch(loginAction(results.access_token));
      // dispatch(messagesAction());
      // Do something with the results
      return results;
    }).catch((error) => {
      console.warn('error logging in', error);
    });
  };
}
