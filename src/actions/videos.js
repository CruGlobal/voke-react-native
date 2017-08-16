import callApi, { REQUESTS } from './api';
import { GET_ALL_VIDEOS, GET_POPULAR, GET_FEATURED, GET_TAGS, GET_SELECTED_THEME } from '../constants';

export function getVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.VIDEOS)).then((results) => {
      console.warn('results', results);
      dispatch({
        type: GET_ALL_VIDEOS,
        all: results.items,
      });
      return results;
    });
  };
}

export function getFeaturedVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS)).then((results) => {
      console.warn('results', results);
      dispatch({
        type: GET_FEATURED,
        featured: results.items,
      });
      return results;
    });
  };
}

export function getPopularVideos() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS)).then((results) => {
      console.warn('results', results);
      dispatch({
        type: GET_POPULAR,
        popular: results.items,
      });
      return results;
    });
  };
}

export function getTags() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_TAGS)).then((results) => {
      console.warn('results', results);
      dispatch({
        type: GET_TAGS,
        tags: results,
      });
      return results;
    });
  };
}

export function getSelectedThemeVideos(tag) {
  let query = {
    tag_id: tag,
  };
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query, {})).then((results) => {
      console.warn('results', results);
      dispatch({
        type: GET_SELECTED_THEME,
        selectedThemeVideos: results,
      });
      return results;
    });
  };
}
