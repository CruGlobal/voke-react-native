import {
  LOGOUT,
  SET_OVERLAY,
  CLEAR_OVERLAY,
  RESET_ANON_USER,
} from '../constants';
import { exists } from '../utils/common';

const initialState = {
  tryItNowSignUp: false,
  pushPermissions: false,
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
    case RESET_ANON_USER:
      return { ...state, tryItNowSignUp: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
