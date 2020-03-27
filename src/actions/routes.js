import CONSTANTS from '../constants';

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

const ROUTES = {
  LOGIN: {
    method: 'post',
    url: 'oauth/token',
    anonymous: true,
    isAuth: true,
    customData: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
  },
  CREATE_ACCOUNT: {
    method: 'post',
    url: 'me',
    anonymous: true,
    customData: {
      client: CLIENT,
    },
  },
  UPDATE_ME: {
    method: 'put',
    url: 'me',
  },
  GET_ME: {
    method: 'get',
    url: 'me',
  },
  GET_AVAILABLE_ADVENTURES: { method: 'get', url: `organization_journeys` },
  GET_MY_ADVENTURES: { method: 'get', url: `me/journeys` },
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
};

export default ROUTES;
