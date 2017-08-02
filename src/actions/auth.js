import { Alert, Platform, ToastAndroid, AsyncStorage } from 'react-native';
import { LOGIN, LOGOUT } from '../constants';
import callApi, { REQUESTS } from './api';
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

export function swapi() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.PLANETS, {})).then((results) => {
      // Do something with the results
      return results;
    });
  };
}

export function swapi2() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.STARSHIPS, {})).then((results) => {
      // Do something with the results
      return results;
    });
  };
}
