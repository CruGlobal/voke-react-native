import { API_URL, AUTH_URL } from './utils';
import { mapAuth } from './mapping';
import CONSTANTS from '../constants';
// Import mapping functions or w/e

export default {
  // Example
  // 'PLANETS': {
  //   method: 'get', (defaults to get)
  //   anonymous: false, (defaults to false)
  //   endpoint: 'planets/1',
  //   (returns true if it's good or a string with the error message)
  //   beforeCall(query, data) {
  //     return true;
  //   }
  //   (gives header or other information)
  //   extra: {
  //     stringify: false,
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   },
  //   (map the results using all this info)
  //   mapResults: (results, query, data, getState) => results,    
  //   (some default data that will merge with the data passed in)
  //   data: {}
  // },
  'OAUTH': {
    endpoint: AUTH_URL + 'oauth/token',
    anonymous: true,
    method: 'post',
    data: {
      client: {
        id: CONSTANTS.CLIENT_ID,
        secret: CONSTANTS.CLIENT_SECRET,
      },
      grant_type: 'password',
      scope: 'messenger',
    },
    mapResults: mapAuth,
    extra: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  },
  'MESSAGES': {
    endpoint: `${API_URL}me/conversations/${'4a61be7f-5734-4e7e-bce5-4105a3f32f0f'}/messages`,
    // mapResults: (results, query, data, getState) => results,    
  },
};