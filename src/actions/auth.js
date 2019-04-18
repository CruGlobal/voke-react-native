import RNFetchBlob from 'react-native-fetch-blob';
import {
  Linking,
  AppState,
  ToastAndroid,
  AsyncStorage,
  Alert,
  PushNotificationIOS,
} from 'react-native';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import Firebase from 'react-native-firebase';
import * as RNOmniture from 'react-native-omniture';

import {
  LOGIN,
  LOGOUT,
  SET_USER,
  SET_PUSH_TOKEN,
  NO_BACKGROUND_ACTION,
  PUSH_PERMISSION,
  DONT_NAV_TO_VIDS,
  RESET_FIRST_TIME,
  SET_TOAST,
} from '../constants';
import callApi, { REQUESTS } from './api';
import {
  establishDevice,
  closeSocketAction,
  getDevices,
  checkAndRunSockets,
} from './socket';
import {
  getConversations,
  getMessages,
  createMessageInteraction,
} from './messages';
import {
  getAllOrganizations,
  getFeaturedOrganizations,
  getMyOrganizations,
} from './channels';
import { getAdventure } from './adventures';
import { API_URL } from '../api/utils';
import { isArray, locale } from '../utils/common';
import theme from '../theme';
import Permissions from '../utils/permissions';
import { logInAnalytics } from './analytics';
import i18n from '../i18n';
import { navigateResetMessage, navigateBack } from './nav';

// Setup app state change listeners
let appStateChangeFn;
// let currentAppState = AppState.currentState || '';
let firebaseLinkHandler;

let hasStartedUp = false;

export function startupAction() {
  return (dispatch, getState) => {
    Orientation.lockToPortrait();
    if (hasStartedUp) return;

    const isFirstTime = getState().auth.isFirstTime;
    if (isFirstTime) {
      dispatch({ type: RESET_FIRST_TIME });
    } else {
      if (!__DEV__) {
        dispatch(setOpenVoke());
      }
    }

    // Check push permissions and run 'establishDevice' if they have permission
    // TODO: Remove this for release

    dispatch(checkPushPermissions());
    hasStartedUp = true;
    // If sockets have not started up, go ahead and do that
    dispatch(checkAndRunSockets());
    if (appStateChangeFn) {
      AppState.removeEventListener('change', appStateChangeFn);
    } else {
      appStateChangeFn = appStateChange.bind(null, dispatch, getState);
    }
    AppState.addEventListener('change', appStateChangeFn);
    Firebase.analytics().setAnalyticsCollectionEnabled(true);
    dispatch(setupFirebaseLinks());
    firebaseLinkHandler = Firebase.links().onLink(link => {
      dispatch(handleFirebaseLink(link));
    });
  };
}

export function setupFirebaseLinks() {
  return async dispatch => {
    // if (firebaseLinkHandler) return;
    // Firebase dynamic links
    let initialLink;
    try {
      initialLink = await Firebase.links().getInitialLink();
    } catch (e) {
      LOG('error getting Firebase initial link');
    }
    if (initialLink) {
      LOG('initial link', initialLink);
      dispatch(handleFirebaseLink(initialLink));
    }
  };
}

export function handleFirebaseLink(link) {
  return dispatch => {
    LOG('handling link', link);
  };
}

export function cleanupAction() {
  return dispatch => {
    hasStartedUp = false;
    LOG('removing appState listener');
    AppState.removeEventListener('change', appStateChangeFn);
  };
}

let appCloseTime;

// TODO: It would be nice to somehow do this in the background and not block the UI when coming back into the app
function appStateChange(dispatch, getState, nextAppState) {
  const { cableId, token, noBackgroundAction } = getState().auth;
  LOG(nextAppState);
  // Sometimes this runs when logging out and causes a network error
  // Only run it when there is a valid token
  if (!token) {
    return;
  }

  // LOG('appStateChange', nextAppState, currentAppState, cableId);
  if (nextAppState === 'active') {
    // Tracking
    RNOmniture.collectLifecycleData(getState().analytics);

    LOG('App has come to the foreground!');

    // Don't run establish device if it's authorized
    dispatch(checkPushPermissions(false));

    let messages = getState().messages;
    if (!theme.isAndroid) {
      PushNotificationIOS.getDeliveredNotifications(results => {
        if (results && results.length > 0)
          PushNotificationIOS.removeAllDeliveredNotifications();
        let conversations = getState().messages.conversations;
        let link =
          results[0] &&
          results[0].userInfo &&
          results[0].userInfo.data &&
          results[0].userInfo.data.link;
        if (!link) return;
        if (link.includes('adventures')) {
          dispatch(getMe());
          return;
        }
        const cId = link.substring(
          link.indexOf('conversations/') + 14,
          link.indexOf('/messages'),
        );
        const mId = link.substring(link.indexOf('messages/') + 9, link.length);
        // LOG('conversation ID: ', cId);
        // LOG('message ID:', mId);
        if (cId && mId) {
          let conv = conversations.find(c => cId === c.id);
          // if the conversation does not exist then call get conversations or if the message does not exist call get conversation
          if (
            !conv ||
            (conv.latestMessage && conv.latestMessage.message_id !== mId)
          ) {
            // LOG('get conversations');
            if (messages.activeConversationId === cId) {
              dispatch(getMessages(cId)).then(() => {
                const interaction = {
                  action: 'read',
                  conversationId: cId,
                  messageId: mId,
                };
                dispatch(createMessageInteraction(interaction)).then(() => {
                  dispatch(getConversations());
                });
              });
            } else {
              dispatch(getConversations());
            }
          }
        }
      });
    } else {
      if (messages.activeConversationId) {
        dispatch(getMessages(messages.activeConversationId)).then(() => {
          const message = getState().messages[messages.activeConversationId];
          const mId = message ? message[0].id : null;
          if (!mId) {
            dispatch(getConversations());
          } else {
            const interaction = {
              action: 'read',
              conversationId: messages.activeConversationId,
              messageId: mId,
            };
            dispatch(createMessageInteraction(interaction)).then(() => {
              dispatch(getConversations());
            });
          }
        });
      } else {
        dispatch(getConversations());
      }
    }
    const now = Date.now();
    const BACKGROUND_REFRESH_TIME = 1000 * 3600 * 24; // 24 hours
    if (now - appCloseTime > BACKGROUND_REFRESH_TIME) {
      dispatch(getAllOrganizations());
      dispatch(getMyOrganizations());
      dispatch(getFeaturedOrganizations());
      dispatch(setOpenVoke());
    }
    // const currentConvId = getState().messages.activeConversationId;
    // if (currentConvId) {
    //   dispatch(getMessages(currentConvId));
    // }

    dispatch(checkAndRunSockets());
  } else if (nextAppState === 'background' || nextAppState === 'inactive') {
    LOG('App is going into the background');

    dispatch(closeSocketAction());
    appCloseTime = Date.now();
  }
  // currentAppState = nextAppState;
}

export function checkPushPermissions(runIfTrue = true) {
  return dispatch => {
    Permissions.checkPush().then(response => {
      dispatch({ type: PUSH_PERMISSION, permission: response });
      // After checking permissions, make sure we run 'establishDevice' if necessary
      if (runIfTrue && response === 'authorized') {
        dispatch(establishDevice());
      }
    });
  };
}

export function dontNavigateToVideos() {
  return dispatch => {
    dispatch({ type: DONT_NAV_TO_VIDS, bool: true });
  };
}

export function loginAction(token, allData = {}) {
  return dispatch =>
    new Promise(async resolve => {
      dispatch({
        type: LOGIN,
        token,
        data: allData,
      });

      // Analytics
      dispatch(logInAnalytics());
      const mePerson = await dispatch(getMe());
      RNOmniture.syncIdentifier(mePerson.global_registry_mdm_id);

      resolve();
      // dispatch(resetHomeAction());
    });
}

export function setUserAction(user) {
  return dispatch =>
    new Promise(resolve => {
      dispatch({
        type: SET_USER,
        user,
      });
      resolve();
      // dispatch(resetHomeAction());
    });
}

export function registerPushToken(token) {
  return dispatch =>
    new Promise(resolve => {
      dispatch({
        type: SET_PUSH_TOKEN,
        pushToken: token,
      });
      resolve();
      // dispatch(resetHomeAction());
    });
}

export function logoutAction(isDelete = false) {
  return (dispatch, getState) =>
    new Promise(resolve => {
      const token = getState().auth.token;
      if (token && !isDelete) {
        dispatch(getDevices()).then(results => {
          LOG('get devices results', results);
          if (results && isArray(results.devices)) {
            // Pass the token into this function because the LOGOUT action will clear it out
            const deviceIds = results.devices.map(d => d.id);
            if (deviceIds.length > 0) {
              dispatch(
                callApi(
                  REQUESTS.REVOKE_TOKEN,
                  {
                    access_token: token,
                  },
                  {
                    device_ids: deviceIds,
                    token: null,
                  },
                ),
              );
            }
          }
        });
      }
      dispatch(cleanupAction());
      dispatch({ type: LOGOUT });
      resolve();
      AsyncStorage.clear();
      dispatch(clearAndroid());
    });
}

export function createAccountAction(email, password, isAnonymous = false) {
  return dispatch =>
    new Promise((resolve, reject) => {
      let data = {
        me: {
          timezone_name: DeviceInfo.getTimezone(),
          country_code: DeviceInfo.getDeviceCountry(),
          language: {
            language_code: locale,
          },
        },
      };
      if (email) data.email = email;
      if (password) data.password = password;

      if (isAnonymous) {
        data = {
          me: {
            timezone_name: DeviceInfo.getTimezone(),
            anonymous: true,
            country_code: DeviceInfo.getDeviceCountry(),
            language: {
              language_code: locale,
            },
          },
        };
      }
      dispatch(callApi(REQUESTS.ME, {}, data))
        .then(results => {
          if (!results.errors) {
            // LOG('create account success', results);
            dispatch(
              loginAction(
                results.access_token.access_token,
                results.access_token,
              ),
            );
            // dispatch(messagesAction());
            // Do something with the results
          } else {
            LOG('Failed to create account', results.errors);
            reject(results);
            return;
          }
          resolve(results);
        })
        .catch(error => {
          LOG('error creating account', error);
          reject(error);
        });
    });
}

export function toastAction(text, length) {
  return dispatch => {
    if (theme.isAndroid) {
      const toastLength =
        length === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
      ToastAndroid.show(text, toastLength);
    } else {
      dispatch({
        type: SET_TOAST,
        props: { text, timeout: length === 'long' ? 8000 : undefined },
      });
    }
  };
}

export function forgotPasswordAction(email) {
  return dispatch =>
    new Promise((resolve, reject) => {
      const data = {
        me: {
          email,
        },
      };
      dispatch(callApi(REQUESTS.FORGOT_PASSWORD, {}, data))
        .then(resolve)
        .catch(reject);
    });
}

export function deleteAccount() {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch(callApi(REQUESTS.DELETE_ACCOUNT))
        .then(resolve)
        .catch(reject);
    });
}

export function anonLogin(username, password, anonId) {
  return dispatch =>
    new Promise((resolve, reject) => {
      let data = {
        username,
        password,
      };
      if (anonId) {
        data.anonymous_user_id = anonId;
      }
      dispatch(callApi(REQUESTS.OAUTH, {}, data))
        .then(results => {
          dispatch(loginAction(results.access_token, results)).then(() => {
            dispatch(getMe());
          });
          resolve(results);
          return results;
        })
        .catch(reject);
    });
}

export function facebookLoginAction(accessToken, anonId) {
  // LOG('access token for fb', accessToken);
  return dispatch => {
    let data = { assertion: accessToken };
    if (anonId) {
      data.anonymous_user_id = anonId;
    }
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, data))
      .then(results => {
        dispatch(loginAction(results.access_token, results));
        // dispatch(messagesAction());
        // Do something with the results
        return results;
      })
      .catch(error => {
        LOG('error logging in', error);
      });
  };
}

export function getMe() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_ME))
      .then(results => {
        dispatch(setUserAction(results));
        dispatch(getAdventure(results.main_adventure_id));
        return results;
      })
      .catch(() => {
        // LOG('error getting me', error);
      });
  };
}

export function updateMe(data) {
  return dispatch => {
    if (data.avatar) {
      return dispatch(updateMeImage(data.avatar));
    }
    let newData = { ...data };
    newData.timezone_name = DeviceInfo.getTimezone();
    return dispatch(callApi(REQUESTS.UPDATE_ME, {}, newData))
      .then(results => {
        dispatch(getMe());
        return results;
      })
      .catch(() => {
        LOG('error updating me', error);
      });
  };
}

export function updateMeImage(avatar) {
  return dispatch => {
    if (!avatar.fileName) {
      LOG('Must have a filename for updating an avatar');
      return Promise.reject();
    }

    // Need image upload data in this format for the RNFetchBlob request
    const data = {
      name: 'me[avatar]',
      filename: avatar.fileName,
      type: 'image/jpeg',
      data: RNFetchBlob.wrap(avatar.uri.replace('file://', '')),
    };
    LOG('data', data);

    return dispatch(callApi(REQUESTS.UPDATE_ME_IMAGE, {}, data))
      .then(results => {
        LOG('update me image successful', results);
        dispatch(getMe());
        return results;
      })
      .catch(error => {
        LOG('error updating me image', error);
      });
  };
}

export function createMobileVerification(data) {
  return dispatch => {
    let newData = { ...data };
    newData.mobile.country_code = DeviceInfo.getDeviceCountry();
    return dispatch(
      callApi(REQUESTS.CREATE_MOBILE_VERIFICATION, {}, newData),
    ).then(results => {
      LOG('Verify mobile request successfully sent', results);
      return results;
    });
  };
}

export function verifyMobile(data) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.VERIFY_MOBILE, {}, data)).then(results => {
      LOG('Mobile successfully verified', results);
      return results;
    });
  };
}

export function blockMessenger(data) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/block`,
    };
    return dispatch(callApi(REQUESTS.BLOCK_MESSENGER, query));
  };
}

export function unblockMessenger(data) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${data}/unblock`,
    };
    return dispatch(callApi(REQUESTS.UNBLOCK_MESSENGER, query));
  };
}

export function reportUserAction(report, messenger) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}/messengers/${messenger}/reports`,
    };
    const data = {
      report: {
        comment: report,
      },
    };
    return dispatch(callApi(REQUESTS.REPORT_MESSENGER, query, data));
  };
}

export function openSettingsAction() {
  return () => {
    if (!theme.isAndroid) {
      const APP_SETTINGS_URL = 'app-settings:';
      Linking.canOpenURL(APP_SETTINGS_URL)
        .then(isSupported => {
          if (isSupported) {
            return Linking.openURL(APP_SETTINGS_URL);
          }
        })
        .catch(err => {
          LOG('error opening app settings url', err);
        });
    } else {
      // Android link to settings not needed
    }
  };
}

export function setNoBackgroundAction(value) {
  return dispatch => {
    dispatch({ type: NO_BACKGROUND_ACTION, value });
  };
}

export function setOpenVoke() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.POST_OPEN_VOKE));
  };
}

export function confirmAlert(title, message, onPress, text, onCancel) {
  return () => {
    Alert.alert(title, message, [
      {
        text: i18n.t('cancel'),
        onPress: onCancel,
        style: 'cancel',
      },
      { text: text || i18n.t('ok'), onPress },
    ]);
  };
}

export function shareVideo(video, onSelectVideo, conversation) {
  return dispatch => {
    dispatch(
      confirmAlert(
        i18n.t('videos:addToChat'),
        i18n.t('videos:areYouSureAdd', {
          name: video.name.substr(0, 25).trim(),
        }),
        () => {
          onSelectVideo(video.id);
          // Navigate back after selecting the video
          if (conversation) {
            dispatch(navigateResetMessage({ conversation }));
          } else {
            dispatch(navigateBack());
          }
        },
        i18n.t('add'),
      ),
    );
  };
}

export function clearAndroid() {
  return () => {
    // For Android, clear out the file system storage on logout so it doesn't get cached incorrectly
    // if (theme.isAndroid) {
    //   FilesystemStorage.getAllKeys((err, keys = []) => {
    //     if (isArray(keys)) {
    //       keys.forEach((k) => FilesystemStorage.removeItem(k, (err) => {
    //         LOG('err', err);
    //       }));
    //     }
    //   });
    // }
  };
}
