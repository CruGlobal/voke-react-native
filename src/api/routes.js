import { API_URL, AUTH_URL } from './utils';
import { mapAuth, mapMe } from './mapping';
import CONSTANTS from '../constants';
// Import mapping functions or w/e

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

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
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
    mapResults: mapAuth,
  },
  'ME': {
    endpoint: API_URL + 'me',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'GET_ME': {
    endpoint: API_URL + 'me',
    method: 'get',
    data: {
      client: CLIENT,
    },
  },
  'UPDATE_ME': {
    endpoint: API_URL + 'me',
    method: 'put',
    data: {
      client: CLIENT,
    },
  },
  'CREATE_MOBILE_VERIFICATION': {
    endpoint: API_URL + 'me/mobile',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'VERIFY_MOBILE': {
    endpoint: API_URL + 'me/mobile',
    method: 'put',
    data: {
      client: CLIENT,
    },
  },
  'VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
    },
  },
  'GET_POPULAR_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
      popularity: true,
    },
  },
  'GET_FEATURED_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
      featured: true,
    },
  },
  'GET_TAGS': {
    endpoint: API_URL + 'tags',
    method: 'get',
    data: {
      client: CLIENT,
    },
  },
  'GET_VIDEOS_BY_TAG': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
    },
  },
  'MESSAGES': {
    endpoint: `${API_URL}me/conversations/${'4a61be7f-5734-4e7e-bce5-4105a3f32f0f'}/messages`,
    // mapResults: (results, query, data, getState) => results,
  },
};
