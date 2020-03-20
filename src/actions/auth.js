import { Alert } from 'react-native';
import { REDUX_ACTIONS, isAndroid } from '../constants';
import ROUTES from './routes';
import request from './utils';
import auth from '@react-native-firebase/auth';
import { firebaseErrorAlert } from '../utils/native';

export function loginAction(user) {
  return async dispatch => {
    dispatch({ type: REDUX_ACTIONS.LOGIN, user });
  };
}

export function logoutAction(user, token) {
  return async dispatch => {
    // if (auth().currentUser) {
    //   auth().signOut();
    // }

    dispatch({ type: REDUX_ACTIONS.LOGOUT, user, token });
  };
}

export function hasSeenSubscriptionModal(bool) {
  return async dispatch => {
    dispatch({ type: REDUX_ACTIONS.HAS_SEEN_SUBSCRIPTION_MODAL, bool });
  };
}

// export function facebookLogin() {
//   if (auth().currentUser) {
//     auth().signOut();
//   }
//   return async (dispatch) => {
//     try {
//       const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
//       if (result.isCancelled) {
//         // alert('Canceled');
//         dispatch(LOGIN_LOADING(false));
//       }
//       // get the access token
//       const data = await AccessToken.getCurrentAccessToken();

//       if (!data) {
//         // alert('Something Went Wrong!');
//         dispatch(LOGIN_LOADING(false));
//       }
//       // create a new firebase credential with the token
//       const credential = auth.FacebookAuthProvider.credential(data.accessToken);

//       const user = await auth().signInWithCredential(credential);
//       if (user) {
//         dispatch(loginAction(user));
//       }
//     } catch (error) {
//       console.log('error', error);
//       firebaseErrorAlert(error, 'Login Error');
//     }
//   };
// }

export function login(username, password) {
  return async (dispatch, getState) => {
    try {
      const user = await auth().signInWithEmailAndPassword(username, password);
      if (user) {
        dispatch(loginAction(user));
      }
    } catch (error) {
      console.log('error', error);
      firebaseErrorAlert(error, 'Login Error');
    }
  };
}

export function register(username, password) {
  auth().signOut();
  return async (dispatch, getState) => {
    try {
      const user = await auth().createUserWithEmailAndPassword(
        username,
        password,
      );
      if (user) {
        dispatch(loginAction(user));
      }
    } catch (error) {
      firebaseErrorAlert(error, 'Login Error');
    }
  };
}

export function passwordReset(username) {
  return async (dispatch, getState) => {
    try {
      const user = await auth().sendPasswordResetEmail(username);
      Alert.alert(
        'Check Your Email',
        'Please check your email for a link to reset your password.',
      );
    } catch (error) {
      Alert.alert(
        'Password Reset Error',
        'Please enter a valid email address above and then tap this button to receive an email to reset your password.',
      );
    }
  };
}

export function getMe() {
  return async (dispatch, getState) => {
    const result = await dispatch(request({ ...ROUTES.USERS_ACCOUNT_GET }));
    if (result.length !== 0) {
      dispatch({ type: REDUX_ACTIONS.SET_USER, user: result[0] });
    }
    return result;
  };
}

export function createMe(user) {
  return async (dispatch, getState) => {
    const data = {
      status: 'inactive',
      receipt: null,
      platfrom: isAndroid ? 'android' : 'apple',
    };
    const result = await dispatch(
      request({ ...ROUTES.USERS_ACCOUNT_POST, data }),
    );
    dispatch(getMe());
  };
}

export function updateMe(data) {
  return async (dispatch, getState) => {
    const userId = getState().userData.id;
    if (!userId) {
      return;
    }
    const result = await dispatch(
      request({ ...ROUTES.USERS_ACCOUNT_ID_PUT, pathParams: { userId }, data }),
    );
    return result;
  };
}
