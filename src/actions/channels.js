import callApi, { REQUESTS } from './api';

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
