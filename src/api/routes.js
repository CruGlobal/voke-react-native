import { API_URL, AUTH_URL } from './utils';
import { mapAuth, mapMessages, mapConversations, mapConversation } from './mapping';
import CONSTANTS from '../constants';
// Import mapping functions or w/e

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

// const FB_CLIENT = {
//   id: '443564615845137',
//   secret: '45f7ffa5523369986711194976f206d0',
// };

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
  //   (some default query that will merge with the query passed in)
  //   query: {}
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
  'FACEBOOK_LOGIN': {
    endpoint: AUTH_URL + 'oauth/token',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
      grant_type: 'assertion',
      scope: 'messenger',
    },
    mapResults: mapAuth,
  },
  'REVOKE_TOKEN': {
    endpoint: AUTH_URL + 'oauth/revoke',
    method: 'post',
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
    // showApiLoading: true,
  },
  'UPDATE_ME': {
    endpoint: API_URL + 'me',
    method: 'put',
    showApiLoading: true,
  },
  'UPDATE_ME_IMAGE': {
    endpoint: API_URL + 'me',
    method: 'put',
    // Force this request to use a custom imageUpload method
    extra: {
      imageUpload: true,
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
  },
  'FORGOT_PASSWORD': {
    endpoint: API_URL + 'me/forgot',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  'VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
  },
  'GET_POPULAR_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { popularity: true },
    showApiLoading: true,
  },
  'GET_FEATURED_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { featured: true },
    showApiLoading: true,
  },
  'GET_TAGS': {
    endpoint: API_URL + 'tags',
    method: 'get',
    showApiLoading: true,
  },
  'GET_VIDEOS_BY_TAG': {
    endpoint: API_URL + 'items',
    method: 'get',
    showApiLoading: true,
  },
  'GET_KICKSTARTERS': {
    endpoint: API_URL + 'items',
    method: 'get',
    showApiLoading: true,
  },
  'GET_CONVERSATIONS': {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    mapResults: mapConversations,
    showApiLoading: true,
  },
  'GET_CONVERSATION': {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    mapResults: mapConversation,
  },
  'DELETE_CONVERSATION': {
    endpoint: API_URL + 'me/conversations/:id',
    method: 'delete',
    showApiLoading: true,
  },
  'CREATE_CONVERSATION': {
    endpoint: API_URL + 'me/conversations',
    method: 'post',
    showApiLoading: true,
  },
  'GET_MESSAGES': {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'get',
    mapResults: mapMessages,
    showApiLoading: true,
  },
  'CREATE_MESSAGE': {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'post',
  },
  'CREATE_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'post',
  },
  'CREATE_PUSH_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'post',
  },
  'GET_DEVICES': {
    endpoint: API_URL + 'me/devices',
    method: 'get',
  },
  'DESTROY_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'delete',
  },
  'UPDATE_DEVICE': {
    endpoint: API_URL + 'me/devices',
    method: 'put',
  },
  'CREATE_TYPESTATE': {
    endpoint: API_URL + 'me/conversations/:conversation_id/type_state',
    method: 'post',
  },
  'DESTROY_TYPESTATE': {
    endpoint: API_URL + 'me/conversations/:conversation_id/type_state',
    method: 'delete',
  },
  'CREATE_MESSAGE_INTERACTION': {
    endpoint: API_URL + 'me/conversations/:conversation_id/messages/:message_id/interactions',
    method: 'post',
  },
  'BLOCK_MESSENGER': {
    endpoint: API_URL + 'messengers/:messenger_id/block',
    method: 'post',
  },
  'UNBLOCK_MESSENGER': {
    endpoint: API_URL + 'messengers/:messenger_id/unblock',
    method: 'post',
  },
  'REPORT_MESSENGER': {
    endpoint: API_URL + 'messengers/:messenger_id/block',
    method: 'post',
  },
  'ADD_FRIENDS': {
    endpoint: API_URL + 'me/friends',
    method: 'post',
  },
  'GET_ORGANIZATIONS': {
    endpoint: API_URL + 'organizations',
    method: 'get',
  },
  'GET_FEATURED_ORGANIZATIONS': {
    endpoint: API_URL + 'organizations',
    method: 'get',
    query: { featured: true },
  },
  'GET_MY_ORGANIZATIONS': {
    endpoint: API_URL + 'organizations',
    method: 'get',
    query: { follows: true },
  },
  'ORGANIZATION_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
  },
  'GET_POPULAR_ORGANIZATION_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { popularity: true },
    showApiLoading: true,
  },
  'GET_FEATURED_ORGANIZATION_VIDEOS': {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { featured: true },
    showApiLoading: true,
  },
  'GET_ORGANIZATION_VIDEOS_BY_TAG': {
    endpoint: API_URL + 'items',
    method: 'get',
    showApiLoading: true,
  },
  'GET_ORGANIZATION_SUBSCRIBERS': {
    endpoint: API_URL + 'organizations/:orgId/subscriptions',
    method: 'get',
    showApiLoading: true,
  },
  'ORGANIZATION_SUBSCRIBE': {
    endpoint: API_URL + 'organizations/:orgId/subscriptions',
    method: 'post',
  },
  'ORGANIZATION_UNSUBSCRIBE': {
    endpoint: API_URL + 'organizations/:orgId/subscriptions/:subscriptionId',
    method: 'delete',
  },
};
