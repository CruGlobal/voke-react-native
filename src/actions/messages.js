import callApi, { REQUESTS } from './api';

export function messagesAction() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.MESSAGES)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}
