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
    isAuth: true, // Request to be made on auth subdomain.
    customData: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
  },
  // https://docs.vokeapp.com/#o-auth-token-via-assertion
  FACEBOOK_LOGIN: {
    method: 'post',
    url: 'oauth/token',
    anonymous: true, // x-access-token = userToken
    isAuth: true, // Request to be made on auth subdomain.
    customData: {
      client: CLIENT,
      grant_type: 'assertion',
      scope: 'messenger',
    },
    // showApiLoading: true, //NOT USED: Used to show a loading overlay on the login page with Facebook login
  },
  APPLE_SIGNIN: {
    method: 'post',
    url: 'oauth/token',
    anonymous: true, // x-access-token = userToken
    isAuth: true, // Request to be made on auth subdomain.
    customData: {
      client: CLIENT,
      // eslint-disable-next-line @typescript-eslint/camelcase, camelcase
      grant_type: 'assertion',
      provider: 'apple',
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
  FORGOT_PASSWORD: {
    method: 'post',
    url: 'me/forgot',
    anonymous: true, // x-access-token = userToken
    // isAuth: true, // Request to be made on auth subdomain.
    customData: {
      client: CLIENT,
      // grant_type: 'password',
      // scope: 'messenger',
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
  DELETE_ACCOUNT: {
    method: 'delete',
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
    url: `me/journeys`,
  },
  GET_MY_ADVENTURE: { method: 'get', url: `me/journeys/{adventureId}` },
  UNLOCK_NEXT_ADVENTURE_STEP: {
    method: 'get',
    url: `me/journeys/{adventureId}/unlock`,
  },
  GET_ADVENTURE_STEPS: {
    method: 'get',
    url: `me/journeys/{adventureId}/steps`,
  },
  GET_ADVENTURE_SUMMARY: {
    method: 'get',
    url: `me/journeys/{adventureId}/summary`,
  },
  GET_ADVENTURE_STEP_MESSAGES: {
    method: 'get',
    url: `me/conversations/{adventureConversationId}/messages`,
  },
  CREATE_ADVENTURE_STEP_MESSAGE: {
    method: 'post',
    url: `me/conversations/{adventureConversationId}/messages`,
  },
  CREATE_INTERACTION_READ: {
    method: 'post',
    url: `me/conversations/{conversationId}/messages/{messageId}/interactions/`,
  },
  CREATE_INTERACTION_PLAY_ADVENTURE_VIDEO: {
    method: 'post',
    url: `me/journeys/{adventureId}/steps/{stepId}/interactions/`,
  },
  CREATE_INTERACTION_PLAY_VIDEO: {
    method: 'post',
    url: `items/{videoId}/interactions`,
  },
  START_ADVENTURE: { method: 'post', url: `me/journeys` },
  // https://docs.vokeapp.com/#me-journeys-cancels-a-messenger-journey
  DELETE_ADVENTURE: {
    method: 'delete',
    url: `me/journeys/{adventureId}`,
  },
  UPDATE_ADVENTURE: {
    method: 'put',
    url: `me/journeys/{adventureId}`,
  },
  GET_ADVENTURE_INVITATIONS: { method: 'get', url: `me/journey_invites` },
  SEND_ADVENTURE_INVITATION: { method: 'post', url: `me/journey_invites` },
  RESEND_ADVENTURE_INVITATION: {
    method: 'put',
    url: `me/journey_invites/{inviteId}/resend`,
  },
  DELETE_ADVENTURE_INVITATION: {
    method: 'delete',
    url: `me/journey_invites/{inviteId}`,
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
  GET_OLD_CONVERSATIONS: {
    method: 'post',
    url: `me/export_data_requests`,
  },
  CREATE_COMPLAIN: {
    method: 'post',
    url: `me/journeys/{adventureId}/reports`,
  },
  DELETE_COMPLAIN: {
    method: 'delete',
    url: `me/journeys/{adventureId}/reports/{reportId}`,
  },
  APPROVE_COMPLAIN: {
    method: 'patch',
    url: `me/journeys/{adventureId}/reports/{reportId}/approve`,
  },
  GET_COMPLAINS: {
    method: 'get',
    url: `me/journeys/{adventureId}/reports`,
  },
  DELETE_MEMBER: {
    method: 'patch',
    url: `me/conversations/{conversationId}/messengers/{messengerId}/block`,
  },
};

export default ROUTES;
