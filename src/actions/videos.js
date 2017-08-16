import callApi, { REQUESTS } from './api';

export function getVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS)).then((results) => {
      console.warn('video results', results);
      return results;
    });
  };
}

export function getFeaturedVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS)).then((results) => {
      console.warn('featured video results', results);
      return results;
    });
  };
}

export function getPopularVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS)).then((results) => {
      console.warn('popular video results', results);
      return results;
    });
  };
}

export function getTags() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_TAGS)).then((results) => {
      console.warn('tag video results', results);
      return results;
    });
  };
}

export function getSelectedThemeVideos(tag) {
  const query = {
    tag_id: tag,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query)).then((results) => {
      console.warn('theme video results', results);
      return results;
    });
  };
}
