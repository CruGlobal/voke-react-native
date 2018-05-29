import { API_URL } from '../api/utils';
import callApi, { REQUESTS } from './api';

export function getAdventure(id) {
  return (dispatch, getState) => {
    let adventures = getState().adventures;
    const query = {
      endpoint: `${API_URL}adventures/${id}`,
    };
    //
    // if (id === adventures.adventureId && adventures.challenges.length > 0) {
    //   console.log('not running adventure calls');
    //   return;
    // }
    return dispatch(callApi(REQUESTS.GET_ADVENTURE, query)).then(()=> {
      dispatch(getChallenges(id));
    });
  };
}

export function getChallenges(id) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}adventures/${id}/challenges`,
    };
    return dispatch(callApi(REQUESTS.GET_CHALLENGES, query));
  };
}

export function completeChallenge(adventureId, challengeId) {
  return (dispatch) => {
    const query = {
      endpoint: `${API_URL}adventures/${adventureId}/challenges/${challengeId}/complete`,
    };
    return dispatch(callApi(REQUESTS.COMPLETE_CHALLENGE, query)).then(()=> {
      dispatch(getChallenges(adventureId));
    });
  };
}
