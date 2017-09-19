import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';

export function getVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS));
  };
}

export function getFeaturedVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS));
  };
}

export function getPopularVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS));
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

export function getSelectedThemeVideos(tag) {
  return (dispatch) => {
    const query = { tag_id: tag };
    return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query));
  };
}
