import callApi, { REQUESTS } from './api';
import { API_URL } from '../api/utils';

export function getAllOrganizations(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_ORGANIZATIONS, query));
  };
}

export function getMyOrganizations(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, query));
  };
}

export function getFeaturedOrganizations(query = {}) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_ORGANIZATIONS, query));
  };
}

//
// export function getKickstarters(item) {
//   return (dispatch) => {
//     const query = {
//       endpoint: `${API_URL}items/${item}/questions`,
//     };
//     return dispatch(callApi(REQUESTS.GET_KICKSTARTERS, query));
//   };
// }
//
// export function getSelectedThemeVideos(tag, page) {
//   return (dispatch) => {
//     let query = { tag_id: tag };
//     if (page && page > 1) {
//       query.page = page;
//     }
//     return dispatch(callApi(REQUESTS.GET_VIDEOS_BY_TAG, query));
//   };
// }
