import {
  LOGOUT,
  SET_OVERLAY,
  CLEAR_OVERLAY,
  RESET_ANON_USER,
  CLEAR_TOAST,
  SET_TOAST,
} from '../constants';
import { exists } from '../utils/common';

const initialState = {
  tryItNowSignUp: false,
  pushPermissions: false,
  messageModal: false,
  adventurePushPermissions: false,
  overlayProps: {},
  toastProps: {},
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

    case SET_TOAST:
      return {
        ...state,
        toastProps: action.props || {},
      };
    case CLEAR_TOAST:
      return {
        ...state,
        toastProps: {},
      };
    case SET_OVERLAY:
      if (!exists(state[action.value])) return state;
      return {
        ...state,
        [action.value]: true,
        overlayProps: { ...state.overlayProps, ...action.props },
      };
    case CLEAR_OVERLAY:
      if (!exists(state[action.value])) return state;
      let newProps = { ...state.overlayProps };
      if (action.value === 'tryItNowSignUp') {
        delete newProps.channelName;
        delete newProps.onClose;
      } else if (action.value === 'messageModal') {
        delete newProps.messageData;
      }
      return { ...state, [action.value]: false, overlayProps: newProps };
    case RESET_ANON_USER:
      return { ...state, tryItNowSignUp: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
