import { API_URL, AUTH_URL } from './utils';
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
  // },
  'OAUTH': {
    endpoint: AUTH_URL + 'oauth/web',
    anonymous: true,
    method: 'post',
    mapResults: (results, query, data, getState) => results,    
  },
  'MESSAGES': {
    endpoint: `${API_URL}me/conversations/${'4a61be7f-5734-4e7e-bce5-4105a3f32f0f'}/messages`,
    mapResults: (results, query, data, getState) => results,    
  },
  'PLANETS': {
    endpoint: 'planets/1',
    mapResults: (results, query, data, getState) => results,    
  },
  'STARSHIPS': {
    endpoint: 'starships/9',
  },
};