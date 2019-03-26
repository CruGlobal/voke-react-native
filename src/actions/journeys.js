import moment from 'moment';
import callApi, { REQUESTS } from './api';
import { UTC_FORMAT } from '../utils/common';

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

export function getJourneyInvite(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_JOURNEY_INVITE, { journeyId }));
  };
}

export function sendJourneyInvite(data) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.SEND_JOURNEY_INVITE, {}, data));
  };
}

export function deleteJourneyInvite(journeyId) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.DELETE_JOURNEY_INVITE, { journeyId }));
  };
}

export function acceptJourneyInvite(journeyId, code) {
  return dispatch => {
    return dispatch(
      callApi(REQUESTS.ACCEPT_JOURNEY_INVITE, { journeyId, code }),
    );
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
      dispatch(getMyJourneys());
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
      callApi(REQUESTS.GET_MY_JOURNEY_STEPS, { journeyId, stepId }),
    );
  };
}

export function skipJourneyMessage(step, journey) {
  return dispatch => {
    return dispatch(createJourneyMessage(step, journey, ''));
  };
}

export function createJourneyMessage(step, journey, text) {
  return dispatch => {
    const query = {
      conversationId: journey.conversation_id,
    };
    const data = {
      message: {
        content: text,
        messenger_journey_step_id: step.id,
      },
    };

    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data));
  };
}
