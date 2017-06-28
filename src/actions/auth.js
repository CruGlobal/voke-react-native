import { Alert, Platform, ToastAndroid } from 'react-native';
import { LOGIN, LOGOUT } from '../constants';
// import { resetLoginAction, resetHomeAction } from './navigation';

export function loginAction(token, user = {}) {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      token,
      user,
    });
    // dispatch(resetHomeAction());
  };
}

export function logoutAction() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    // dispatch(resetLoginAction());
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
