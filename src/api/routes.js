import { API_URL, AUTH_URL } from './utils';
import {
  mapMessages,
  mapConversations,
  mapConversation,
  mapChallenges,
} from './mapping';
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
  //   showApiLoading: false
  // },
  OAUTH: {
    endpoint: AUTH_URL + 'oauth/token',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
  },
  FACEBOOK_LOGIN: {
    endpoint: AUTH_URL + 'oauth/token',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
      grant_type: 'assertion',
      scope: 'messenger',
    },
    showApiLoading: true, // Used to show a loading overlay on the login page with Facebook login
  },
  REVOKE_TOKEN: {
    endpoint: AUTH_URL + 'oauth/revoke',
    method: 'post',
  },
  ME: {
    endpoint: API_URL + 'me',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  GET_ME: {
    endpoint: API_URL + 'me',
    method: 'get',
    showApiLoading: true, // Used to show a loading overlay on the login page with Facebook login
  },
  UPDATE_ME: {
    endpoint: API_URL + 'me',
    method: 'put',
    showApiLoading: false,
  },
  UPDATE_ME_IMAGE: {
    endpoint: API_URL + 'me',
    method: 'put',
    // Force this request to use a custom imageUpload method
    extra: {
      imageUpload: true,
    },
    showApiLoading: false,
  },
  CREATE_MOBILE_VERIFICATION: {
    endpoint: API_URL + 'me/mobile',
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  VERIFY_MOBILE: {
    endpoint: API_URL + 'me/mobile',
    method: 'put',
  },
  FORGOT_PASSWORD: {
    endpoint: API_URL + 'me/forgot',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
    },
  },
  GET_VIDEO: {
    endpoint: API_URL + 'items/:videoId',
  },
  FAVORITE_VIDEO: {
    endpoint: API_URL + 'items/:videoId/favorite',
    method: 'post',
  },
  UNFAVORITE_VIDEO: {
    endpoint: API_URL + 'items/:videoId/favorite',
    method: 'delete',
  },
  VIDEOS: {
    endpoint: API_URL + 'items',
  },
  GET_POPULAR_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { popularity: true },
    showApiLoading: false,
  },
  GET_FEATURED_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { featured: true },
    showApiLoading: false,
  },
  GET_FAVORITES_VIDEOS: {
    endpoint: API_URL + 'items',
    query: { favorite: '#<Messenger::Favorite:0x007ffd7c4afb60>' },
    showApiLoading: false,
  },
  GET_TAGS: {
    endpoint: API_URL + 'tags',
    method: 'get',
    showApiLoading: false,
  },
  GET_VIDEOS_BY_TAG: {
    endpoint: API_URL + 'items',
    method: 'get',
    showApiLoading: false,
  },
  GET_KICKSTARTERS: {
    endpoint: API_URL + 'items',
    method: 'get',
    showApiLoading: false,
  },
  GET_CONVERSATIONS: {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    mapResults: mapConversations,
    showApiLoading: false,
  },
  GET_CONVERSATION: {
    endpoint: API_URL + 'me/conversations',
    method: 'get',
    mapResults: mapConversation,
  },
  DELETE_CONVERSATION: {
    endpoint: API_URL + 'me/conversations/:id',
    method: 'delete',
    showApiLoading: false,
  },
  CREATE_CONVERSATION: {
    endpoint: API_URL + 'me/conversations',
    method: 'post',
    showApiLoading: true,
  },
  GET_MESSAGES: {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'get',
    mapResults: mapMessages,
    showApiLoading: false,
  },
  CREATE_MESSAGE: {
    endpoint: API_URL + 'me/conversations/conversation_id/messages',
    method: 'post',
  },
  CREATE_DEVICE: {
    endpoint: API_URL + 'me/devices',
    method: 'post',
  },
  CREATE_PUSH_DEVICE: {
    endpoint: API_URL + 'me/devices',
    method: 'post',
  },
  GET_DEVICES: {
    endpoint: API_URL + 'me/devices',
    method: 'get',
  },
  DESTROY_DEVICE: {
    endpoint: API_URL + 'me/devices',
    method: 'delete',
  },
  UPDATE_DEVICE: {
    endpoint: API_URL + 'me/devices',
    method: 'put',
  },
  CREATE_TYPESTATE: {
    endpoint: API_URL + 'me/conversations/:conversation_id/type_state',
    method: 'post',
  },
  DESTROY_TYPESTATE: {
    endpoint: API_URL + 'me/conversations/:conversation_id/type_state',
    method: 'delete',
  },
  CREATE_MESSAGE_INTERACTION: {
    endpoint:
      API_URL +
      'me/conversations/:conversation_id/messages/:message_id/interactions',
    method: 'post',
  },
  BLOCK_MESSENGER: {
    endpoint: API_URL + 'messengers/:messenger_id/block',
    method: 'post',
  },
  UNBLOCK_MESSENGER: {
    endpoint: API_URL + 'messengers/:messenger_id/unblock',
    method: 'post',
  },
  REPORT_MESSENGER: {
    endpoint: API_URL + 'messengers/:messenger_id/block',
    method: 'post',
  },
  ADD_FRIENDS: {
    endpoint: API_URL + 'me/friends',
    method: 'post',
  },
  GET_ORGANIZATIONS: {
    endpoint: API_URL + 'organizations',
    method: 'get',
  },
  GET_FEATURED_ORGANIZATIONS: {
    endpoint: API_URL + 'organizations',
    method: 'get',
    query: { featured: true },
  },
  GET_MY_ORGANIZATIONS: {
    endpoint: API_URL + 'organizations',
    method: 'get',
    query: { follows: true },
  },
  ORGANIZATION_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
  },
  GET_POPULAR_ORGANIZATION_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { popularity: true },
    // showApiLoading: false,
  },
  GET_FEATURED_ORGANIZATION_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { featured: true },
    // showApiLoading: false,
  },
  GET_FAVORITES_ORGANIZATION_VIDEOS: {
    endpoint: API_URL + 'items',
    method: 'get',
    query: { favorite: '#<Messenger::Favorite:0x007ffd7c4afb60>' },
    // showApiLoading: false,
  },
  GET_ORGANIZATION_VIDEOS_BY_TAG: {
    endpoint: API_URL + 'items',
    method: 'get',
    // showApiLoading: false,
  },
  GET_ORGANIZATION_SUBSCRIBERS: {
    endpoint: API_URL + 'organizations/:orgId/subscriptions',
    method: 'get',
    showApiLoading: false,
  },
  GET_ORGANIZATION: {
    endpoint: API_URL + 'organizations/:orgId',
    method: 'get',
    showApiLoading: false,
  },
  GET_ADVENTURE: {
    endpoint: API_URL + 'adventures/:adventure_id',
    method: 'get',
    showApiLoading: false,
  },
  GET_ADVENTURES: {
    endpoint: API_URL + 'me/messenger_adventures',
    method: 'get',
    showApiLoading: false,
  },
  GET_CHALLENGES: {
    endpoint: API_URL + 'adventures/:adventure_id/challenges',
    method: 'get',
    mapResults: mapChallenges,
    showApiLoading: false,
  },
  ORGANIZATION_SUBSCRIBE: {
    endpoint: API_URL + 'organizations/:orgId/subscriptions',
    method: 'post',
  },
  ACCEPT_CHALLENGE: {
    endpoint: API_URL + 'adventures/:adventure_id/challenges/:challenge_id/log',
    method: 'post',
  },
  COMPLETE_CHALLENGE: {
    endpoint:
      API_URL + 'adventures/:adventure_id/challenges/:challenge_id/log/:log_id',
    method: 'post',
  },
  ORGANIZATION_UNSUBSCRIBE: {
    endpoint: API_URL + 'organizations/:orgId/subscriptions/:subscriptionId',
    method: 'delete',
  },
  CREATE_ITEM_INTERACTION: {
    endpoint: API_URL + 'items/:item_id/interactions',
    method: 'post',
  },
  POST_OPEN_VOKE: {
    endpoint: API_URL + 'me/open_voke',
    method: 'post',
  },
};
