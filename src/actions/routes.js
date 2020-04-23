import CONSTANTS from '../constants';

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

const ROUTES = {
  // https://docs.vokeapp.com/#o-auth-token-via-password
  LOGIN: {
    method: 'post',
    url: 'oauth/token',
    anonymous: true, // x-access-token = userToken
    isAuth: true, // Resuest to be made on auth subdomain.
    customData: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
  },
  // https://docs.vokeapp.com/#o-auth-token-via-assertion
  FACEBOOK_LOGIN: {
    method: 'post',
    endpoint: 'oauth/token',
    anonymous: true,
    customData: {
      client: CLIENT,
      grant_type: 'assertion',
      scope: 'messenger',
    },
    // showApiLoading: true, //NOT USED: Used to show a loading overlay on the login page with Facebook login
  },
  // https://docs.vokeapp.com/#me-create-me
  CREATE_ACCOUNT: {
    method: 'post',
    url: 'me',
    anonymous: true,
    customData: {
      client: CLIENT,
    },
  },
  REVOKE_TOKEN: {
    method: 'post',
    url: 'oauth/revoke',
    isAuth: true,
  },
  UPDATE_ME: {
    method: 'put',
    url: 'me',
  },
  /* UPDATE_ME_IMAGE: {
    url: 'me',
    method: 'put',
    // Force this request to use a custom imageUpload method
    extra: {
      imageUpload: true,
    },
  }, */
  // https://docs.vokeapp.com/#me-get-me
  GET_ME: {
    method: 'get',
    url: 'me',
  },
  GET_AVAILABLE_ADVENTURES: { method: 'get', url: `organization_journeys` },
  GET_MY_ADVENTURES: {
    method: 'get',
    url: `me/journeys`
  },
  GET_MY_ADVENTURE: { method: 'get', url: `me/journeys/{adventureId}` },
  GET_ADVENTURE_STEPS: {
    method: 'get',
    url: `me/journeys/{adventureId}/steps`,
  },
  GET_ADVENTURE_STEP_MESSAGES: {
    method: 'get',
    url: `me/conversations/{adventureConversationId}/messages`,
  },
  CREATE_ADVENTURE_STEP_MESSAGE: {
    method: 'post',
    url: `me/conversations/{adventureConversationId}/messages`,
  },
  START_ADVENTURE: { method: 'post', url: `me/journeys` },
  GET_ADVENTURE_INVITATIONS: { method: 'get', url: `me/journey_invites` },
  SEND_ADVENTURE_INVITATION: { method: 'post', url: `me/journey_invites` },
  RESEND_ADVENTURE_INVITATION: {
    method: 'put',
    url: `me/journey_invites/:inviteId/resend`,
  },
  DELETE_ADVENTURE_INVITATION: {
    method: 'delete',
    url: `me/journey_invites/:inviteId`,
  },
  ACCEPT_ADVENTURE_INVITATION: {
    method: 'post',
    url: `me/journey_invites/accept`,
  },
  GET_VIDEOS: {
    method: 'get',
    url: `items`,
  },
  FAVORITE_VIDEO: {
    method: 'post',
    url: `items/{videoId}/favorite`,
  },
  UNFAVORITE_VIDEO: {
    method: 'delete',
    url: `items/{videoId}/favorite`,
  },
  SEND_VIDEO_INVITATION: {
    method: 'post',
    url: `me/shares`,
  },
  GET_VIDEO_TAGS: {
    method: 'get',
    url: `tags`,
  },
  DESTROY_DEVICE: {
    method: 'delete',
    url: `me/devices/{deviceId}`,
  },
  UPDATE_DEVICE: {
    method: 'put',
    url: `me/devices/{deviceId}`,
  },
  GET_DEVICES: {
    method: 'get',
    url: `me/devices`,
  },
  // https://docs.vokeapp.com/#me-devices-create-device
  CREATE_DEVICE: {
    method: 'post',
    url: `me/devices`,
  },
  GET_NOTIFICATIONS: {
    method: 'get',
    url: `me/conversations/{notificationId}/messages`,
  },
};

export default ROUTES;
