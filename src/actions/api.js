/* global __DEV__ */
import lodashForEach from 'lodash/forEach';
// import Reactotron from 'reactotron-react-native';

import API_CALLS from '../api';
import { logoutAction } from './auth';
import apiRoutes from '../api/routes';





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
  return (dispatch, getState) => (
    new Promise((resolve, reject) => {
      // Generic error handler
      const throwErr = (msg) => {
        if (__DEV__) { 
          console.warn(msg);
          throw new Error(msg);
        }
        reject(msg);
      };
      if (!requestObject) {
        return throwErr(`callApi(): There is no type: ${JSON.stringify(requestObject)}`);
      }
      let newQuery = { ...query };
      const action = requestObject;

      if (!action.anonymous) {
        const { token, user } = getState().auth;
        newQuery.access_token = token;
        if (user.id) {
          newQuery.authUserId = user.id;
        }
      }
      newQuery.timestamp = new Date().valueOf();

      dispatch({
        query: newQuery,
        data: data || {},
        type: action.FETCH,
      });

      if (!API_CALLS[action.name] || typeof API_CALLS[action.name] !== 'function') {
        return throwErr(`callApi(): API call is not a function: ${action.name}`);
      }

      // If there is a method that uses data, call it here
      if (METHODS_WITH_DATA.includes(action.method)) {
        if (!action.anonymous && !newQuery.access_token) {
          return throwErr(`There is no token and route is not anonymous: ${JSON.stringify(action)}`);
        }
      }

      API_CALLS[action.name](newQuery, data).then((results) => {
        let actionResults = results || {};
        if (action.mapResults) {
          actionResults = action.mapResults(actionResults, newQuery, data, getState);
        }

        dispatch({
          ...(actionResults || {}),
          query: newQuery,
          data,
          type: action.SUCCESS,
        });
        resolve(actionResults);
      }).catch((err) => {
        if (err) {
          if (typeof err === 'object' && err.code === 'AUTHORIZATION_REQUIRED') {
            dispatch(logoutAction(true));
          }

          dispatch({
            error: err,
            query: newQuery,
            data,
            type: action.FAIL,
          });
        }
        reject(err);
      });
    })
  );
}
