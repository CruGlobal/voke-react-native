import { API_URL, AUTH_URL } from './utils';
import { mapAuth, mapMessages, mapConversations, mapConversation } from './mapping';
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
  //   (mark the api as a call that will show the loading state)
  //   showApiLoading: true
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
    showApiLoading: true,
  },
  'UPDATE_ME': {
    endpoint: API_URL + 'me',
    method: 'put',
    data: {
      client: CLIENT,
    },
    showApiLoading: true,
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
  'FORGOT_PASSWORD': {
    endpoint: API_URL + 'me/forgot',
    method: 'post',
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
    },
    showApiLoading: true,
  },
  'GET_FEATURED_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
    },
    showApiLoading: true,
  },
  'GET_TAGS': {
    endpoint: API_URL + 'tags',
    method: 'get',
    data: {
      client: CLIENT,
    },
    showApiLoading: true,
  },
  'GET_VIDEOS_BY_TAG': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
    },
    showApiLoading: true,
  },
  'GET_KICKSTARTERS': {
    endpoint: API_URL + 'items',
    method: 'get',
    data: {
      client: CLIENT,
    },
    showApiLoading: true,
  },
  'GET_CONVERSATIONS': {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    data: {
      client: CLIENT,
    },
    mapResults: mapConversations,
    showApiLoading: true,
  },
  'GET_CONVERSATION': {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    data: {
      client: CLIENT,
    },
    mapResults: mapConversation,
  },
  'CREATE_CONVERSATION': {
    endpoint: API_URL + 'me/conversations',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'GET_MESSAGES': {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'get',
    data: {
      client: CLIENT,
    },
    mapResults: mapMessages,
    showApiLoading: true,
  },
  'CREATE_MESSAGE': {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'CREATE_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'CREATE_PUSH_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'GET_DEVICES': {
    endpoint: API_URL + 'me/devices',
    method: 'get',
    data: {
      client: CLIENT,
    },
  },
  'DESTROY_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'delete',
    data: {
      client: CLIENT,
    },
  },
  'UPDATE_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'put',
    data: {
      client: CLIENT,
    },
  },
  'CREATE_TYPESTATE': {
    endpoint: API_URL + 'me/conversations',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'DESTROY_TYPESTATE': {
    endpoint: API_URL + 'me/conversations',
    method: 'delete',
    data: {
      client: CLIENT,
    },
  },
  'CREATE_MESSAGE_INTERACTION': {
    endpoint: API_URL + 'me/conversations',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
};
