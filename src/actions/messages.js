import callApi, { REQUESTS } from './api';

export function getConversations() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_CONVERSATIONS)).then((results) => {
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
