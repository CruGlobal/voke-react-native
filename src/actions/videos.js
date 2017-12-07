import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';


export function getVideo(videoId) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}items/${videoId}`,
    };
    return dispatch(callApi(REQUESTS.GET_VIDEO, query));
  };
}

export function getVideos(query = {}, channelId) {
  return (dispatch) => {
    if (channelId) {
      const newQuery = {
        ...(query || {}),
        organization_id: channelId,
      };
      return dispatch(callApi(REQUESTS.ORGANIZATION_VIDEOS, newQuery));
    }
    return dispatch(callApi(REQUESTS.VIDEOS, query));
  };
}

export function getFeaturedVideos(query = {}, channelId) {
  return (dispatch) => {
    if (channelId) {
      const newQuery = {
        ...(query || {}),
        organization_id: channelId,
      };
      return dispatch(callApi(REQUESTS.GET_FEATURED_ORGANIZATION_VIDEOS, newQuery));
    }
    return dispatch(callApi(REQUESTS.GET_FEATURED_VIDEOS, query));
  };
}

export function getPopularVideos(query = {}, channelId) {
  return (dispatch) => {
    if (channelId) {
      const newQuery = {
        ...(query || {}),
        organization_id: channelId,
      };
      return dispatch(callApi(REQUESTS.GET_POPULAR_ORGANIZATION_VIDEOS, newQuery));
    }
    return dispatch(callApi(REQUESTS.GET_POPULAR_VIDEOS, query));
  };
}

export function getFavorites(query = {}, channelId) {
  return (dispatch) => {
    if (channelId) {
      const newQuery = {
        ...(query || {}),
        organization_id: channelId,
      };
      return dispatch(callApi(REQUESTS.GET_FAVORITES_ORGANIZATION_VIDEOS, newQuery));
    }
    return dispatch(callApi(REQUESTS.GET_FAVORITES_VIDEOS, query));
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

export function getSelectedThemeVideos(tag, page, channelId) {
  return (dispatch) => {
    let query = { tag_id: tag };
    if (page && page > 1) {
      query.page = page;
    }
    if (channelId) {
      const newQuery = {
        ...(query || {}),
        organization_id: channelId,
      };
      return dispatch(callApi(REQUESTS.GET_ORGANIZATION_VIDEOS_BY_TAG, newQuery));
    }
    return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query));
  };
}

export function favoriteVideo(videoId) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}items/${videoId}/favorite`,
    };
    return dispatch(callApi(REQUESTS.FAVORITE_VIDEO, query));
  };
}

export function unfavoriteVideo(videoId) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}items/${videoId}/favorite`,
    };
    return dispatch(callApi(REQUESTS.UNFAVORITE_VIDEO, query));
  };
}
