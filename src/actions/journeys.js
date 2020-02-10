import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';
import { INACTIVE_JOURNEY, ACTIVE_JOURNEY } from '../constants';

export function getOrgJourneys() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_ORG_JOURNEYS));
  };
}

export function getOrgJourney(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_ORG_JOURNEY, { journeyId }));
  };
}

export function getJourneyInvites() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_JOURNEY_INVITES));
  };
}

export function getJourneyInvite(inviteId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_JOURNEY_INVITE, { inviteId }));
  };
}

export function sendJourneyInvite(data) {
  return async dispatch => {
    const results = await dispatch(
      callApi(REQUESTS.SEND_JOURNEY_INVITE, {}, data),
    );
    return results;
  };
}

export function resendJourneyInvite(inviteId) {
  return async dispatch => {
    const results = await dispatch(
      callApi(REQUESTS.RESEND_JOURNEY_INVITE, { inviteId }),
    );
    return results;
  };
}

export function deleteJourneyInvite(inviteId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.DELETE_JOURNEY_INVITE, { inviteId }));
  };
}

export function acceptJourneyInvite(code) {
  return async dispatch => {
    const results = await dispatch(
      callApi(REQUESTS.ACCEPT_JOURNEY_INVITE, { code }),
    );
    dispatch(getMyJourneys());
    return results;
  };
}

export function getMyJourneys() {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_MY_JOURNEYS));
  };
}

export function getMyJourney(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_MY_JOURNEY, { journeyId }));
  };
}

export function createMyJourney(data) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.CREATE_MY_JOURNEY, {}, data)).then(r => {
      return r;
    });
  };
}

export function deleteMyJourney(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.DELETE_MY_JOURNEY, { journeyId }));
  };
}

export function getMyJourneySteps(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_MY_JOURNEY_STEPS, { journeyId }));
  };
}

export function getMyJourneyStep(journeyId, stepId) {
  return dispatch => {
    return dispatch(
      callApi(REQUESTS.GET_MY_JOURNEY_STEP, { journeyId, stepId }),
    );
  };
}

export function skipJourneyMessage(step, journey) {
  return dispatch => {
    return dispatch(createJourneyMessage(step, journey, ''));
  };
}

export function createJourneyMessage(
  step,
  journey,
  text,
  multiChoiceAnswer,
  messageId,
) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}me/conversations/${journey.conversation.id}/messages`,
    };
    const data = {
      message: {
        content: text,
        messenger_journey_step_id: step.id,
      },
    };

    if (multiChoiceAnswer && !text) {
      data.message.content = null;
      data.message.messenger_journey_step_id = (
        (step || {}).metadata || {}
      ).messenger_journey_step_id;
      data.message.messenger_journey_step_option_id = multiChoiceAnswer;
    }
    if (messageId) {
      data.message.message_reference_id = messageId;
    }

    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data));
  };
}
export function createJourneyMessageFromMessage(
  stepId,
  journey,
  text,
  multiChoiceAnswer,
  messageId,
) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}me/conversations/${journey.conversation.id}/messages`,
    };
    const data = {
      message: {
        content: text,
        messenger_journey_step_id: stepId,
      },
    };
    if (messageId) {
      data.message.message_reference_id = messageId;
    }
    if (multiChoiceAnswer && !text) {
      data.message.content = null;
      data.message.messenger_journey_step_option_id = multiChoiceAnswer;
    }

    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data));
  };
}

export function getJourneyMessages(step, journey) {
  return dispatch => {
    const query = {
      conversationId: journey.conversation_id || journey.conversation.id,
      messenger_journey_step_id: step.id,
    };

    return dispatch(callApi(REQUESTS.GET_MESSAGES, query));
  };
}

export function activeJourneyConversation(journey) {
  return {
    type: ACTIVE_JOURNEY,
    journey,
  };
}

export function inactiveJourneyConversation() {
  return {
    type: INACTIVE_JOURNEY,
  };
}
