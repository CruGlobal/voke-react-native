import { REDUX_ACTIONS } from '../constants';

export function togglePlayStatus(status) {
  return { type: REDUX_ACTIONS.TOGGLE_PLAY_STATUS, status };
}

export function toggleShuffleStatus(status) {
  return { type: REDUX_ACTIONS.TOGGLE_SHUFFLE_STATUS, status };
}

export function toggleRepeatStatus(status) {
  return { type: REDUX_ACTIONS.TOGGLE_REPEAT_STATUS, status };
}
