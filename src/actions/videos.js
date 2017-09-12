import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';

export function getVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS)).then((results) => {
      LOG('video results', results);
      return results;
    });
  };
}

export function getFeaturedVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS, {featured: true}, {})).then((results) => {
      LOG('featured video results', results);
      return results;
    });
  };
}

export function getPopularVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS, {popularity: true}, {})).then((results) => {
      LOG('popular video results', results);
      return results;
    });
  };
}

export function getTags() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_TAGS)).then((results) => {
      LOG('tag video results', results);
      return results;
    });
  };
}

export function getKickstarters(item) {
  const query = {
    endpoint: `${API_URL}items/${item}/questions`,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_KICKSTARTERS, query)).then((results) => {
      LOG('tag video results', results);
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
      LOG('theme video results', results);
      return results;
    });
  };
}
