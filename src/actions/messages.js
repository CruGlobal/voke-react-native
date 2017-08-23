import { API_URL } from '../api/utils';
import callApi, { REQUESTS } from './api';

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}

export function getConversation(data) {
  let query = {
    endpoint: `${API_URL}me/conversations/${data}`,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATION, query)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}

export function createConversation(data) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_CONVERSATION, {}, data)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}

export function getMessages(data) {
  let query = {
    endpoint: `${API_URL}me/conversations/${data}/messages`,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_MESSAGES, query)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}

export function createMessage(conversation, data) {
  let query = {
    endpoint: `${API_URL}me/conversations/${conversation}/messages`,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_MESSAGE, query, data)).then((results) => {
      console.warn('results', results);
      dispatch(getMessages(conversation));
      return results;
    });
  };
}
