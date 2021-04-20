import RNFetchBlob from 'rn-fetch-blob';
import { Alert, Platform } from 'react-native';
import { getTimeZone, getCountry, getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import dynamicLinks from '@react-native-fireebase/dynamic-links';
import {
  LoginManager,
  GraphRequestManager,
  GraphRequest,
  AccessToken,
} from 'react-native-fbsdk';
import CONSTANTS, { REDUX_ACTIONS } from 'utils/constants';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import request from 'actions/utils';
import { TAdventureSingle, TDataState } from 'utils/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import i18next from 'i18next';

import ROUTES from './routes';
import {
  revokeAuthToken,
  setUser,
  getMyAdventures,
  getAdventuresInvitations,
  getAdventureStepMessages,
  getNotifications,
  getAdventureSteps,
  getAvailableAdventures,
  setAuthData,
} from './requests';
import { openSocketAction, closeSocketAction } from './socket';
import {
  permissionsAndNotifications,
  setAppIconBadgeNumber,
} from './notifications';

type Dispatch = ThunkDispatch<TDataState, void, Action>;

/**
 * Update user's data on the server
 * and then download it back to refresh a local store.
 *
 * @param {object} data - user data to update.
 */
export function updateMe(data) {
  console.log('🔄 auth > updateMe()', { data });
  return async (dispatch, getState) => {
    const userId = getState().auth.user.id;
    if (!userId) return;
    // Additional transformations if updating with new avatar.
    if (data.avatar) {
      data = {
        name: 'me[avatar]',
        filename: data.avatar.fileName,
        type: 'image/jpeg',
        data: RNFetchBlob.wrap(data.avatar.uri.uri.replace('file://', '')),
      };
    }

    return await request({
      ...ROUTES.UPDATE_ME,
      pathParams: { userId },
      data,
      authToken: getState().auth.authToken,
    }).then(
      userData => {
        // Update redux store with data received.
        return dispatch(setUser(userData));
      },
      error => {
        console.log('🛑 Error while updating the user.', error);
        throw error;
      },
    );
  };
}

export function loginAction(authToken) {
  // const authToken = authData.access_token;
  return async dispatch => {
    await dispatch({ type: REDUX_ACTIONS.LOGIN, authToken });
  };
}

export function userBlockedAction() {
  return async (dispatch: Dispatch) => {
    await dispatch({
      type: REDUX_ACTIONS.BLOCK,
    });
  };
}

// Check current system language against the one already stored.
// Update it on the server if different.
export function checkCurrentLanguage(prefLang = '') {
  return async (dispatch, getState): void => {
    const languageStored = getState().auth.language;
    const languageCurrent =
      prefLang.toUpperCase() || i18next?.language
        ? i18next.language.toUpperCase()
        : 'EN';

    if (prefLang !== i18next.language) {
      i18next.changeLanguage(prefLang.toLowerCase());
    }

    if (languageStored !== languageCurrent) {
      const { user } = getState().auth;
      const userData = {
        me: {
          ...user,
          /* eslint-disable @typescript-eslint/camelcase, camelcase */
          timezone_name: getTimeZone(),
          /* eslint-disable @typescript-eslint/camelcase, camelcase */
          country_code: getCountry(),
          language: {
            /* eslint-disable @typescript-eslint/camelcase, camelcase */
            language_code: languageCurrent,
          },
        },
      };

      try {
        // Update Existing Account.
        await dispatch(updateMe(userData));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('🛑 Error updating the user details \n', e);
      }
    }
  };
}

// When app starts.
export function startupAction() {
  return async dispatch => {
    await dispatch({
      type: REDUX_ACTIONS.STARTUP,
    });
    await dispatch(permissionsAndNotifications());
    // Get notifications every time sockets connections reestablished.
    await dispatch(getNotifications());
    // Update available adventures on app start.
    await dispatch(getAvailableAdventures());
    // Check if the system language changed.
    dispatch(checkCurrentLanguage());
  };
}

// When app focussed again.
export function wakeupAction() {
  return async (dispatch, getState) => {
    const currentScreen = getState().info?.currentScreen?.screen;
    LOG('🌝 function wakeupAction', { currentScreen });

    /* await Linking.getInitialURL().then(
      (data) => {
        if ( data ) {
          Alert.alert(
            'Deep Link:',
            data?.url,
          );
        }
      }
    ); */

    /*
    Try to extract dynamiclink with Adventure code passed by Firebase.
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link.url === 'https://invertase.io/offer') {
          // ...set initial route as offers screen
        }
      }); */

    await dispatch(permissionsAndNotifications());
    const deviceId = getState().auth.device.id; // TODO: can I move it to the top?
    dispatch(openSocketAction(deviceId));

    // Check on what screen we are and update the required info.
    // My Adventures screen: update invitations and adventures.
    if (currentScreen === 'AdventuresMy') {
      dispatch(getAdventuresInvitations());
      dispatch(getMyAdventures('Wakeup Action'));
    }

    // AdventureActive (Steps)
    if (currentScreen === 'AdventureActive') {
      const { adventureId } = getState().info?.currentScreen?.data;
      /* dispatch(
        getAdventureStepMessages(
          conversationId,
          adventureStepId
        )
      ); */
      console.log('going to refresh steps');
      dispatch(getAdventureSteps(adventureId));
    }

    // AdventureStepScreen (chat screen)
    if (currentScreen === 'AdventureStepScreen') {
      const {
        conversationId,
        adventureStepId,
        adventureId,
      } = getState().info?.currentScreen?.data;
      dispatch(getAdventureStepMessages(conversationId, adventureStepId));
      dispatch(getAdventureSteps(adventureId));
    }

    // Get notifications every time sockets connections reestablished.
    await dispatch(getNotifications());
  };
}

// When app goes to background.
export function sleepAction() {
  LOG('🌘 function sleepAction');
  return async dispatch => {
    // No need to close/reopen WebSocket connection anymore:
    // https://github.com/facebook/react-native/issues/26731
    // Not so fast! We need to close sockets to tell the backend to send
    // new notifications via push changed instead of WS.
    dispatch(closeSocketAction());
  };
}

export function requestPremissions(askPermission = true) {
  return async dispatch => {
    await dispatch(permissionsAndNotifications(askPermission));
  };
}

export function logoutAction() {
  console.log('🚶‍♂️🚪 logoutAction \n\n');
  return async (dispatch, getState) => {
    const deviceId = getState().auth.device?.id;
    const authToken = getState().auth?.authToken;
    try {
      if (deviceId) {
        if (deviceId.length > 0) {
          dispatch(
            revokeAuthToken({
              // eslint-disable-next-line @typescript-eslint/camelcase
              device_ids: [deviceId],
              token: authToken ? authToken : null,
            }),
          );
        }
      }
      // Set redux store into empty state.
      await dispatch({ type: REDUX_ACTIONS.LOGOUT });
      setAppIconBadgeNumber(0);
      // Clear data in the local storage if user logout.
      if (Platform.OS === 'android') {
        FilesystemStorage.clear();
      }
      // Both iOS and Android.
      AsyncStorage.clear();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🛑 Logout error', error);
      throw error;
    }
  };
}

/**
 * Update store.auth.user branch with user data fetched from the server.
 */
export function getMeAction() {
  return async (dispatch, getState) => {
    // Fetch user data from the server.
    return await request({
      ...ROUTES.GET_ME,
      authToken: getState().auth.authToken,
    }).then(
      userData => {
        // eslint-disable-next-line no-console
        console.log('👤 getMe > Updated user data:\n', userData);
        // Update redux store with data received.
        const me = dispatch(setUser(userData));
        // After user signin by merging guest account we need to refresh adventures.
        dispatch(getMyAdventures('getMeAction'));
        dispatch(getAdventuresInvitations());

        return me;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('👤 getMe > Fetch error', error);
        throw error;
      },
    );
  };
}

export function hasSeenSubscriptionModal(bool) {
  return async dispatch => {
    dispatch({ type: REDUX_ACTIONS.HAS_SEEN_SUBSCRIPTION_MODAL, bool });
  };
}

export function facebookLoginAction(accessToken) {
  return async (dispatch, getState) => {
    // Important! It tells the server to merge anonymous_user_id
    // with provided login details.
    const userId = getState().auth.user.id;
    const data = { assertion: accessToken };
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      data.anonymous_user_id = userId;
    }

    return await request({
      ...ROUTES.FACEBOOK_LOGIN,
      data,
      authToken: getState().auth.authToken,
    }).then(
      authData => {
        // eslint-disable-next-line no-console
        console.log('🚪🚶‍♂️Facebook loginResults:\n', authData);
        // Received login response do Logout/reset state.
        logoutAction();
        // Update user data in the state with ones received.
        dispatch(loginAction(authData.access_token));
        // After all download user details from server.
        return dispatch(getMeAction());
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('facebookLoginAction > Login error', error);
        throw error;
      },
    );
  };
}

export async function facebookGetUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    const getMeConfig = {
      version: CONSTANTS.FACEBOOK_VERSION,
      accessToken,
      parameters: {
        fields: {
          string: CONSTANTS.FACEBOOK_FIELDS,
        },
      },
    };

    try {
      // Prepare a graph request asking for user information
      // with a callback to handle the response.
      const infoRequest = new GraphRequest(
        '/me',
        getMeConfig, // What information we want back from Facebook?
        (err, meResult) => {
          // Callback to run when FB returns a value.
          if (err) {
            reject(err);
          } else {
            resolve(meResult);
          }
        },
      );
      // Send the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🛑 facebookGetUserInfo > GraphRequestManager:', error);
    }
  });
}

export async function facebookRequestPermissions() {
  // Attempt to login using the Facebook login dialog asking for permissions.
  const fbPermissionsRequest = await LoginManager.logInWithPermissions(
    CONSTANTS.FACEBOOK_SCOPE,
  );
  if (!fbPermissionsRequest.isCancelled) {
    return true;
  }
  // eslint-disable-next-line no-console
  console.log('🛑 👤FB Login cancelled');
  return false;
}

export async function facebookGetAccessToken() {
  // Generate FB access token.
  const fbAccessTokenInfo = await AccessToken.getCurrentAccessToken();

  if (fbAccessTokenInfo && fbAccessTokenInfo.accessToken) {
    // Permission given - get current user info.
    const accessToken = fbAccessTokenInfo.accessToken.toString();
    return accessToken;
  }
  // eslint-disable-next-line no-console
  console.log("🛑👤FB access token doesn't exist");
  return false;
}

export function facebookLogin() {
  return async dispatch => {
    // 1. Request permission to use Facebook for Sign In.
    const fbPermissions = await facebookRequestPermissions();
    if (fbPermissions) {
      // 2. Accepted by the user. Facebook returns us token.
      const accessToken = await facebookGetAccessToken();
      if (accessToken) {
        // 3. Get the user's info from Facebook.
        await facebookGetUserInfo(accessToken);
        // 4. Login on our server using Facebook token.
        const result = await dispatch(facebookLoginAction(accessToken));
        dispatch(setAuthData('authType', 'facebook'));
        return result.user.id;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('🛑👤FB Login cancelled');
      return false;
    }
  };
}

export function appleLoginAction({
  email,
  firstName,
  lastName,
  identityToken,
  appleUser,
}: {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  identityToken: string;
  appleUser: string;
}) {
  return async (dispatch, getState) => {
    const data = {
      assertion: appleUser,
      // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
      user_data: {
        token: identityToken,
        email: email,
        // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
        first_name: firstName,
        // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
        last_name: lastName,
      },
      // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
      anonymous_user_id: '',
    };
    // It tells the server to merge anonymous_user_id with provided logins.
    const userId: string = getState().auth.user.id || '';
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
      data.anonymous_user_id = userId;
    }

    return await request({
      ...ROUTES.APPLE_SIGNIN,
      data,
      authToken: getState().auth.authToken,
    }).then(
      authData => {
        LOG('🔑 Apple APPLE_SIGNIN results:\n', authData);
        logoutAction(); // Received login response reset local state (logout).
        dispatch(loginAction(authData.access_token)); // Add user data to state.
        return dispatch(getMeAction()); // Download user details from the server
      },
      error => {
        LOG('🛑 appleLoginAction > Login error', error);
        return error;
      },
    );
  };
}

export function appleSignIn() {
  return async dispatch => {
    // 1. - Performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const {
      /**
       * https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple
       *
       * An opaque user ID associated with the AppleID used for the sign in.
       * This identifier will be stable across the 'developer team',
       * it can later be used as an input to @{AppleAuthRequest}
       * to request user contact information.
       *
       * The identifier will remain stable as long as the user is connected
       * with the requesting client. The value may change upon user
       * disconnecting from the identity provider.
       *
       * Use it instead of an email address to identify the user in your app.
       */
      user,
      /**
       * A JSON Web Token (JWT) used to communicate information about
       * the identity of the user in a secure way to the app.
       *
       * The ID token contains the following information signed
       * by Apple's identity service:
       *  - Issuer Identifier
       *  - Subject Identifier
       *  - Audience
       *  - Expiry Time
       *  - Issuance Time
       */
      identityToken,
      fullName,
      email,
      // nonce,
      // realUserStatus,
      // authorizationCode,
    } = appleAuthRequestResponse;

    /**
     * 2. - Get current authentication state for user
     * (to ensure the user is authenticated)
     * /!\ This method must be tested on a real device.
     * On the iOS simulator it always throws an error.
     */
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // 3. - Login on the server using Apple identity token.
    if (credentialState === appleAuth.State.AUTHORIZED && identityToken) {
      try {
        const result = await dispatch(
          appleLoginAction({
            email,
            firstName: fullName?.givenName || null,
            lastName: fullName?.familyName || null,
            identityToken,
            appleUser: user,
          }),
        );
        if (result?.user) {
          // User is authenticated.
          dispatch(setAuthData('authType', 'apple'));
          return result.user;
        }
      } catch (error) {
        LOG(
          '🛑🛑🛑 Apple SignIn cancelled. Returned (credentialState, identityToken):',
          credentialState,
          identityToken,
          error,
        );

        // Error.
        return result;
      }
    } else {
      // Apple signin failed.
      LOG(
        '🛑 Apple SignIn cancelled. Returned (credentialState, identityToken):',
        credentialState,
        identityToken,
      );
      return false;
    }
  };
}

export function passwordResetAction(email) {
  return async (dispatch, getState) => {
    try {
      const data = {
        me: {
          email,
        },
      };
      return await request({
        ...ROUTES.FORGOT_PASSWORD,
        data,
        authToken: getState().auth.authToken,
      }).then(
        result => {
          // eslint-disable-next-line no-console
          console.log('🗝 Reset Password:\n', result);
          // Received login response do Logout/reset state.
          // logoutAction();
          // Update user data in the state with ones received.
          // dispatch(loginAction(authData.access_token));
          // After all download user details from server.
          return;
        },
        error => {
          // eslint-disable-next-line no-console
          console.log('🛑 Login error', error);
          throw error;
        },
      );
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

export function userLogin(username, password) {
  return async (dispatch, getState) => {
    const data = {
      username,
      password,
    };

    // Important! It tells the server to merge anonymous_user_id
    // with provided login details.
    const userId = getState().auth.user.id;
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      data.anonymous_user_id = userId;
    }

    return await request({
      ...ROUTES.LOGIN,
      data,
      authToken: getState().auth.authToken,
    }).then(
      authData => {
        // eslint-disable-next-line no-console
        console.log('🚪🚶‍♂️loginResults:\n', authData);
        // Received login response do Logout/reset state.
        logoutAction();
        // Update user data in the state with ones received.
        dispatch(loginAction(authData.access_token));
        dispatch(setAuthData('authType', 'email'));
        // After all download user details from server.
        return dispatch(getMeAction());
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 Login error', error);
        throw error;
      },
    );
  };
}

export function createAccount(user) {
  console.log('Auth > createAccount\n', { user });
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

    return await request({
      ...ROUTES.CREATE_ACCOUNT,
      data,
      authToken: getState().auth.authToken,
      description: 'Request CREATE_ACCOUNT',
    }).then(
      userData => {
        // eslint-disable-next-line no-console
        console.log('👤 createAccount \n\n', userData);
        // Received login response do Logout/reset state.
        // logoutAction();
        // Update user data in the state with ones received.
        return dispatch(setUser(userData));
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 Create account error', error);
        throw error;
      },
    );
  };
}

export function deleteAccountAction() {
  console.log('Auth > deleteAccount');
  return async (dispatch, getState) => {
    const data = {};
    return await request({
      ...ROUTES.DELETE_ACCOUNT,
      data,
      authToken: getState().auth.authToken,
      description: 'Request DELETE_ACCOUNT',
    }).then(
      success => {
        // eslint-disable-next-line no-console
        console.log('👤 Account Deleted \n\n', success);
        setAppIconBadgeNumber(0);
        // Clear data in the local storage if user logout.
        // AsyncStorage.clear(); - we do that in the parrent functions
        // return;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log('🛑 Delete account error', error);
        // return;
      },
    );
  };
}
