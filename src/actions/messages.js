import { API_URL } from '../api/utils';
import { NEW_MESSAGE, TYPE_STATE_CHANGE } from '../constants';
import callApi, { REQUESTS } from './api';

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS)).then((results) => {
      // console.warn('results', results.conversations[1]);
      return results;
    });
  };
}

export function getConversation(data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}`,
    };
    return dispatch(callApi(REQUESTS.GET_CONVERSATION, query));
  };
}

export function createConversation(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_CONVERSATION, {}, data));
  };
}

export function getMessages(data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${data}/messages`,
    };
    return dispatch(callApi(REQUESTS.GET_MESSAGES, query));
  };
}

export function createMessage(conversation, data) {
  return (dispatch) => {
    let query = {
      endpoint: `${API_URL}me/conversations/${conversation}/messages`,
    };
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data)).then((results) => {
      dispatch(getMessages(conversation));
      return results;
    });
  };
}

export function newMessageAction(message) {
  return (dispatch) => {
    return dispatch({ type: NEW_MESSAGE, message });
  };
}

export function typeStateChangeAction(message) {
  return (dispatch) => {
    let data = {
      conversationId: message.message.conversation_id,
      bool: message.notification.action === 'create' ? true : false,
    };
    return dispatch({ type: TYPE_STATE_CHANGE, data });
  };
}
