/* global __DEV__ */
import { Alert } from 'react-native';
import lodashForEach from 'lodash/forEach';

import { RESET_TOKEN, UPDATE_TOKENS } from '../constants';
import { refreshTokenRequest } from '../api/utils';
import API_CALLS from '../api';
import { toastAction, logoutAction } from './auth';
import { navigateResetLogin } from './nav';
import apiRoutes from '../api/routes';
import { isArray } from '../utils/common';
import i18n from '../i18n';

// WARNING: You shouldn't have to touch this file to change routes/mapping
// Put new routes in '../api/routes';

// Setup the requests to be used for this file
let REQUESTS = {};
lodashForEach(apiRoutes, (data, key) => {
  REQUESTS[key] = {
    ...data,
    name: key,
    FETCH: `${key}_FETCH`,
    FAIL: `${key}_FAIL`,
    SUCCESS: `${key}_SUCCESS`,
  };
});
export { REQUESTS };

const METHODS_WITH_DATA = ['put', 'post', 'delete'];

export default function callApi(requestObject, query = {}, data = {}) {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      // Generic error handler
      const throwErr = msg => {
        if (__DEV__) {
          LOG(msg);
          throw new Error(msg);
        }
        reject(msg);
      };
      if (!requestObject) {
        return throwErr(
          `callApi(): There is no type: ${JSON.stringify(requestObject)}`,
        );
      }
      let newQuery = { ...query };
      const action = requestObject;

      if (!action.anonymous) {
        const { token, user } = getState().auth;
        // If the request has not already passed in an access token, set it
        if (!newQuery.access_token) {
          newQuery.access_token = token;
        }
        if (user && user.id) {
          newQuery.authUserId = user.id;
        }
      }
      newQuery.timestamp = new Date().valueOf();

      dispatch({
        query: newQuery,
        data: data || {},
        type: action.FETCH,
        showApiLoading: action.showApiLoading,
      });

      if (
        !API_CALLS[action.name] ||
        typeof API_CALLS[action.name] !== 'function'
      ) {
        return throwErr(
          `callApi(): API call is not a function: ${action.name}`,
        );
      }

      // If there is a method that uses data, call it here
      if (METHODS_WITH_DATA.includes(action.method)) {
        if (!action.anonymous && !newQuery.access_token) {
          return throwErr(
            `There is no token and route is not anonymous: ${JSON.stringify({
              action,
              query: newQuery,
            })}`,
          );
        }
      }

      const handleError = err => {
        LOG('request error', action.name, err);
        if (err) {
          dispatch({
            error: err,
            query: newQuery,
            data,
            type: action.FAIL,
            showApiLoading: action.showApiLoading,
          });

          if (typeof err === 'object') {
            if (
              err.error === 'Unauthorized' ||
              err.code === 'AUTHORIZATION_REQUIRED'
            ) {
              // If it's the login request, show this message
              if (action.name === 'OAUTH') {
                Alert.alert(i18n.t('error.error'), i18n.t('error.userpass'));
                reject(err);
                return;
              }

              const unauthAlert = () => {
                Alert.alert(
                  i18n.t('error.unauthorized'),
                  i18n.t('error.sorryUnauth'),
                  [
                    {
                      text: i18n.t('ok'),
                      onPress: () => {
                        dispatch({ type: RESET_TOKEN });
                        dispatch(navigateResetLogin());
                        dispatch(logoutAction());
                      },
                    },
                  ],
                );
              };
              const refreshToken = getState().auth.refreshToken;
              if (refreshToken) {
                reject(err);
                refreshTokenRequest(refreshToken)
                  .then(tokenResults => {
                    if (!tokenResults || !tokenResults.access_token) {
                      unauthAlert();
                      return;
                    }
                    dispatch({
                      type: UPDATE_TOKENS,
                      data: tokenResults,
                    });
                  })
                  .catch(() => {
                    unauthAlert();
                  });
                return;
              }
              // There was a problem authenticating the user, log them out
              unauthAlert();
              reject(err);
              return;
            } else if (err.error === 'invalid_grant') {
              // There was a login error
              Alert.alert(i18n.t('error.error'), i18n.t('error.userpass'));
              reject(err);
              return;
            } else if (err.error === 'Not Found') {
              reject(err);
              return;
            } else if (err.error === 'Messenger not configured') {
              reject(err);
              return;
            }
            if (err.errors && isArray(err.errors)) {
              if (err.errors.includes("Code doesn't match")) {
                reject(err);
                return;
              } else if (err.errors.includes('Mobile is invalid')) {
                reject(err);
                return;
              } else if (err.errors.includes('Mobile has already been taken')) {
                reject(err);
                return;
              } else if (err.errors.includes('Email has already been taken')) {
                reject(err);
                return;
              } else if (err.errors.includes("Email can't be blank")) {
                reject(err);
                return;
              } else if (err.errors.includes("First name can't be blank")) {
                reject(err);
                return;
              } else if (err.errors.includes("Last name can't be blank")) {
                reject(err);
                return;
              }
            }
          }
          if (action.showApiLoading) {
            dispatch(toastAction('Network connection error'));
          }
          // If none of the above scenarios are hit, show a network connection error
        }
        reject(err);
      };

      API_CALLS[action.name](newQuery, data)
        .then(results => {
          let actionResults = results || {};
          // LOG('API results', actionResults);
          // If the results have an error object, call this to reject it
          if (actionResults.error || actionResults.errors) {
            handleError(actionResults);
            return;
          }

          // If there is a mapping function, call it
          if (action.mapResults) {
            actionResults = action.mapResults(
              actionResults,
              newQuery,
              data,
              getState,
            );
          }

          dispatch({
            ...(actionResults || {}),
            query: newQuery,
            data,
            type: action.SUCCESS,
            showApiLoading: action.showApiLoading,
          });
          resolve(actionResults);
        })
        .catch(handleError);
    });
}
