import { REDUX_ACTIONS } from '../constants';

const initialState = {
  isPlaying: false,
  isShuffle: false,
  repeatStatus: 0, // 0 is off, 1 is repeat_all, 2 is repeat_one
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REDUX_ACTIONS.TOGGLE_PLAY_STATUS:
      return { ...state, isPlaying: action.status || false };
    case REDUX_ACTIONS.TOGGLE_SHUFFLE_STATUS:
      return { ...state, isShuffle: action.status || false };
    case REDUX_ACTIONS.TOGGLE_REPEAT_STATUS:
      return { ...state, repeatStatus: action.status || 0 };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
