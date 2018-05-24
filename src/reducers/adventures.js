import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT, SET_USER } from '../constants';

const initialState = {
  adventureId: '',
  backgroundImage: '',
  challenges: [],
};

export default function adventures(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.channels;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.GET_ADVENTURE.SUCCESS:
      return {
        ...state,
        backgroundImage: action.image.large,
      };
    case REQUESTS.GET_CHALLENGES.SUCCESS:
      return {
        ...state,
        challenges: action.challenges,
      };
    case SET_USER:
      return {
        ...state,
        adventureId: action.user.main_adventure_id,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
