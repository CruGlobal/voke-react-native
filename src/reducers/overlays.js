import {
  LOGOUT,
  SET_OVERLAY,
  CLEAR_OVERLAY,
} from '../constants';
import { exists } from '../utils/common';

const initialState = {
  tryItNowIntro: false,
  tryItNowSignUp: false,
};

export default function overlays(state = initialState, action) {

  switch (action.type) {
    // case REHYDRATE:
    //   const incoming = action.payload.overlays;
    //   if (!incoming) return state;
    //   return {
    //     ...state,
    //     ...incoming,
    //   };

    case SET_OVERLAY:
      if (!exists(state[action.value])) return state;
      return { ...state, [action.value]: true };
    case CLEAR_OVERLAY:
      if (!exists(state[action.value])) return state;
      return { ...state, [action.value]: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
