import { API_URL } from '../api/utils';
import callApi, { REQUESTS } from './api';
import { SET_OVERLAY } from '../constants';

export function getAllOrganizations(query = {}) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_ORGANIZATIONS, query));
  };
}

export function getMyOrganizations(query = {}) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, query));
  };
}

export function getFeaturedOrganizations(query = {}) {
  return dispatch => {
    return dispatch(callApi(REQUESTS.GET_FEATURED_ORGANIZATIONS, query));
  };
}

export function getChannel(channelId) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}organizations/${channelId}`,
    };
    return dispatch(callApi(REQUESTS.GET_ORGANIZATION, query));
  };
}

export function getChannelSubscriberData(channelId) {
  return dispatch => {
    const query = {
      endpoint: `${API_URL}organizations/${channelId}/subscriptions`,
    };
    return dispatch(callApi(REQUESTS.GET_ORGANIZATION_SUBSCRIBERS, query));
  };
}

export function subscribeChannel(channel) {
  return (dispatch, getState) => {
    if (getState().auth.isAnonUser) {
      dispatch({
        type: SET_OVERLAY,
        value: 'tryItNowSignUp',
        props: { channelName: channel.name || null },
      });
      return Promise.reject();
    }
    const query = {
      endpoint: `${API_URL}organizations/${channel.id}/subscriptions`,
    };
    return dispatch(callApi(REQUESTS.ORGANIZATION_SUBSCRIBE, query)).then(r => {
      dispatch(getMyOrganizations());
      return r;
    });
  };
}
export function unsubscribeChannel(channelId, subscriptionId) {
  return dispatch => {
    if (!subscriptionId) {
      return Promise.reject('NoSubscriptionId');
    }
    const query = {
      endpoint: `${API_URL}organizations/${channelId}/subscriptions/${
        subscriptionId
      }`,
    };
    return dispatch(callApi(REQUESTS.ORGANIZATION_UNSUBSCRIBE, query)).then(
      r => {
        dispatch(getMyOrganizations());
        return r;
      },
    );
  };
}
