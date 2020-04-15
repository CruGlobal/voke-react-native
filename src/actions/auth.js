import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import { getTimeZone, getCountry, getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { REDUX_ACTIONS } from '../constants';
import ROUTES from './routes';
import request from './utils';
import { getDevices, revokeAuthToken, setUser } from './requests';
import { isArray } from '../utils';
import { checkForPermissionsAndSetupSockets } from './socket';

export function loginAction(authToken) {
  // const authToken = authData.access_token;
  return async dispatch => {
    dispatch({ type: REDUX_ACTIONS.LOGIN, authToken });
  };
}

export function startupAction() {
  return async dispatch => {
    await dispatch(checkForPermissionsAndSetupSockets());
  };
}

export function logoutAction(user, token, isDelete = false) {
  console.log('🚶‍♂️🚪 logoutAction \n\n', { user }, '\n', { token }, '\n', {
    isDelete,
  });
  return async (dispatch, getState) => {
    try {
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
      // Clear data in the local storage if user logout.
      AsyncStorage.clear();
    } catch (error) {
      console.log('🛑 Logout error', error);
      throw error;
    }
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

/**
 * Update store.auth.user branch with user data fetched from the server.
 */
export function getMe() {
  console.log( "🤷‍♂ function getMe" );
  return async (dispatch, getState) => {
    /* 
    // Fetch user data from the server.
    const userData = await dispatch(request({ ...ROUTES.GET_ME }));
    // TODO: add data validation here.
    // Update redux store with data received.
    return dispatch({
        type: REDUX_ACTIONS.SET_USER,
        user: userData,
    });
 */

    // Fetch user data from the server.
    return dispatch(request({ ...ROUTES.GET_ME })).then(
      userData => {
        // eslint-disable-next-line no-console
        console.log('👤 getMe > Updated user data:\n', userData);
        // Update redux store with data received.
        return dispatch(setUser(userData));
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('👤 getMe > Fetch error', error);
        throw error;
      },
    );
  };
}

export function userLogin(username, password) {
  return async (dispatch, getState) => {
    // try {
    const data = {
      username,
      password,
    };

    // Important! It tells the server to merge anonymous_user_id
    // with provided login details.
    const auth = getState().auth;
    if ( auth.user.id ) {
      data.anonymous_user_id = auth.user.id;
    }

    console.log( "function userLogin > data:" ); console.log( data );



    return dispatch(request({ ...ROUTES.LOGIN, data })).then(
      authData => {
        // eslint-disable-next-line no-console
        console.log('🚪🚶‍♂️loginResults:\n', authData);
        // Received login response do Logout/reset state.
        logoutAction();
        // Update user data in the state with ones received.
        dispatch( loginAction(authData.access_token) );
        // await dispatch(getMe());
        // After all download user details from server.
        return dispatch(getMe());
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('Login error', error);
        throw error;
      },
    );


   /*  } catch (error) {
      console.log('Login error', error);
      // Some error action.
      // throw new Error(error);
      throw error;
    } */
  };
}


export function createAccount(user) {
  console.log( "Auth > createAccount\n", {user}  );
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

    return dispatch(request({ ...ROUTES.CREATE_ACCOUNT, data })).then(
      userData => {
        // eslint-disable-next-line no-console
        console.log( "👤 createAccount \n\n", userData );
        // Received login response do Logout/reset state.
        // logoutAction();
        // Update user data in the state with ones received.
        return dispatch(setUser(userData))

        // await dispatch(getMe());
        // After all download user details from server.
        // return dispatch(getMe());
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 Create account error', error);
        throw error;
      },
    );
  };
}

/**
 * Update user's data on the server
 * and then download it back to refresh a local store.
 *
 * @param {object} data - user data to update.
 */
export function updateMe(data) {
  console.log( "🔄 auth > updateMe()", {data} );
  return async (dispatch, getState) => {
    const userId = getState().auth.user.id;
    if (!userId) {
      return;
    }
    // Additional transformations if updating with new avatar.
    if (data.avatar) {
      data = {
        name: 'me[avatar]',
        filename: data.avatar.fileName,
        type: 'image/jpeg',
        data: RNFetchBlob.wrap(data.avatar.uri.uri.replace('file://', '')),
      };
    }

    // await dispatch( request({ ...ROUTES.UPDATE_ME_IMAGE, pathParams: { userId }, data })  );
    return dispatch( request({ ...ROUTES.UPDATE_ME, pathParams: { userId }, data })  ).then(
      userData => {
        console.log( "User update result:\n", userData );
        // dispatch(getMe());
        // Update redux store with data received.
        console.log( "🏁beofre setUser!" );
        return dispatch(setUser(userData))
      },
      error => {
        console.log('🛑 Error while updating the user.', error);
        throw error;
      }
    );
    // TODO: Add some validation here?
    /* if ( uploadResults.error || uploadResults.errors ) {
      console.log( 'ERRORS' );
    } else {
      console.log( "uploadResults:" ); console.log( uploadResults );
      // return dispatch(getMe());
    } */
    // return dispatch(getMe());
  };
}
