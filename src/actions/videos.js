import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';

export function getVideos(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS, query));
  };
}

export function getFeaturedVideos(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS, query));
  };
}

export function getPopularVideos(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS, query));
  };
}

export function getTags() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_TAGS));
  };
}

export function getKickstarters(item) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}items/${item}/questions`,
    };
    return dispatch(callApi(REQUESTS.GET_KICKSTARTERS, query));
  };
}

export function getSelectedThemeVideos(tag, page) {
  return (dispatch) => {
    let query = { tag_id: tag };
    if (page && page > 1) {
      query.page = page;
    }
    return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query));
  };
}
