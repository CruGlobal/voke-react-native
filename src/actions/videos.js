import callApi, { REQUESTS } from './api';

export function getVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS)).then((results) => {
      console.warn('results', results);
      return results;
    });
  };
}
