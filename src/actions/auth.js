import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import { REDUX_ACTIONS, isAndroid } from '../constants';

import { getTimeZone, getCountry, getLocales } from 'react-native-localize';
import { CommonActions } from '@react-navigation/native';

import ROUTES from './routes';
import request from './utils';
import AsyncStorage from '@react-native-community/async-storage';
import { getDevices, revokeAuthToken } from './requests';
import { isArray } from '../utils';
import { checkForPermissionsAndSetupSockets } from './socket';


// results = await dispatch(
//       request({
//         ...ROUTES.UPDATE_DEVICE,
//         pathParams: { cableId },
//         data: device,
//       }),
//     );

export function loginAction(user) {
  console.log( "loginAction:" ); console.log( {user} );
  return async dispatch => {
    dispatch({ type: REDUX_ACTIONS.LOGIN, user });
  };
}

export function startupAction() {
  return async dispatch => {
    await dispatch(checkForPermissionsAndSetupSockets());
  };
}

export function logoutAction(user, token, isDelete = false) {
  console.log( "🚶‍♂️🚪 logoutAction \n\n", {user}, "\n", {token}, "\n", {isDelete} );
  return async (dispatch, getState) => {
    if (token && !isDelete) {
      const devices = await dispatch(getDevices());

      if (devices && isArray(devices.devices)) {
        const deviceIds = devices.devices.map(d => d.id);
        if (deviceIds.length > 0) {
          dispatch(
            revokeAuthToken({
              device_ids: deviceIds,
              token: null,
            }),
          );
        }
      }
    }
    // Set redux store into empty state.
    await dispatch({ type: REDUX_ACTIONS.LOGOUT, user, token });
    console.log('done!');
    // Clear data in the local storage if user logout.
    AsyncStorage.clear();
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

export function userLogin(username, password) {
  console.log( "function userLogin:" ,{username,password});
  return async (dispatch, getState) => {
    const data = {
      username,
      password,
    };

    const auth = getState().auth;
    if ( auth.user.id ) {
      data.anonymous_user_id = auth.user.id;
    }

    console.log( "userLogin data:" ); console.log( data );

    // try {
    const loginResults = await dispatch(request({ ...ROUTES.LOGIN, data }));

    console.log( "loginResults:" ); console.log( {loginResults} );
    /* if (!loginResults.errors && loginResults.access_token.access_token) {
      await dispatch(loginAction(results.access_token, results));
      if (createWithAvatarData) {
        await dispatch(updateMe(createWithAvatarData));
      }
    } */
     /*  await dispatch(loginAction(results.access_token, results));
      console.log( "🚪🚶‍♂️ login \n\n", {loginResults} ); */
   /*  } catch (error) {
      reject(error);
    } */

  };
}

/*
BEN
export function login(username, password) {
  return async (dispatch, getState) => {};
} */

export function passwordReset(username) {
  return async (dispatch, getState) => {
    try {
      // TODO: Finish this password reset functionality.
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
    const result = await dispatch(request({ ...ROUTES.GET_ME }));
    console.log(result);
    return result;
  };
}

export function createAccount(user, createWithAvatarData) {
  return async (dispatch, getState) => {
    const data = {
      me: {
        ...user,
        timezone_name: getTimeZone(),
        anonymous: true,
        country_code: getCountry(),
        language: {
          language_code: getLocales(),
        },
      },
    };
    const newUser =
      (await dispatch(request({ ...ROUTES.CREATE_ACCOUNT, data }))) || {};
    console.log( "👤 createAccount \n\n", {newUser} );
    if (!newUser.errors && newUser.access_token.access_token) {
      await dispatch(loginAction(newUser));
      if (createWithAvatarData) {
        await dispatch(updateMe(createWithAvatarData));
      }
    }
  };
}

/**
 * Update user's data.
 * @param {object} data - user data to update.
 */
export function updateMe(data) {
  return async (dispatch, getState) => {
    const userId = getState().auth.user.id;
    if (!userId) {
      return;
    }
    if (data.avatar) {
      data = {
        name: 'me[avatar]',
        filename: data.avatar.fileName,
        type: 'image/jpeg',
        data: RNFetchBlob.wrap(data.avatar.uri.uri.replace('file://', '')),
      };
    }
    const result = await dispatch(
      request({ ...ROUTES.UPDATE_ME, pathParams: { userId }, data }),
    );
    return result;
  };
}
