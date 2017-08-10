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
      code: 'ZMrpmn0',
      client: {
        id: 'db6274e05ca47b4eee31b25525eae8a02a1b7e1f0c09f653352782fb8cefcaf4',
        secret: 'e0c2d30d486fa2254284d978d148036213ec41998b2aa6bcb9986b8833547a21',
      },
    })).then((results) => {
      console.warn('results', results);
      dispatch(loginAction(results.access_token.access_token));
      dispatch(messagesAction());
      // Do something with the results
      return results;
    });
  };
}
