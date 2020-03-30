import { REDUX_ACTIONS } from '../constants';
import { exists } from '../utils';

export type AuthDataKeys = 'deviceInformation' | 'adventureInvitations';
const initialState = {
  isLoggedIn: false,
  authToken: '',
  pushToken: '',
  pushDeviceId: '',
  deviceInformation: {},
  user: {},
  modalProps: {},
};

export default function(
  state = initialState,
  action: {
    type: any;
    key: string | number;
    data: any;
    modalProps: any;
    user: { access_token: { access_token: any } };
    pushToken: any;
    deviceId: any;
  },
) {
  switch (action.type) {
    case REDUX_ACTIONS.SET_AUTH_DATA:
      // @ts-ignore
      if (!exists(state[action.key]) || !action.data) {
        return state;
      }
      return { ...state, [action.key]: action.data };
    case REDUX_ACTIONS.SHOW_MODAL:
      return { ...state, modalProps: action.modalProps || {} };
    case REDUX_ACTIONS.HIDE_MODAL:
      return { ...state, modalProps: {} };
    case REDUX_ACTIONS.LOGIN:
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
        authToken: action.user.access_token.access_token,
      };
    case REDUX_ACTIONS.SET_USER:
      return { ...state, user: action.user };
    case REDUX_ACTIONS.SET_PUSH_TOKEN:
      return { ...state, pushToken: action.pushToken };
    case REDUX_ACTIONS.SET_PUSH_DEVICE_ID:
      return { ...state, pushDeviceId: action.deviceId };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
