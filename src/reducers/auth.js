import { REHYDRATE } from 'redux-persist/constants';
import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN } from '../constants';
import { REQUESTS } from '../actions/api';

const initialAuthState = {
  token: '',
  user: {},
  isLoggedIn: false,
  device: {
    // version: 1,
    // local_version: '1.0.1',
    // local_id: '4afad6f1-1b5dfadfb-4e64-98dd-d7f538588584',
    // family: 'Apple',
    // name: 'iPhone',
    // os: 'ios 10.3.2',
  },
  cableId: '',
  pushToken: '',
};

export default function auth(state = initialAuthState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.auth;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };

    case LOGIN:
      return {
        ...state,
        token: action.token,
        user: action.user,
        isLoggedIn: true,
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case SET_PUSH_TOKEN:
      return {
        ...state,
        pushToken: action.pushToken,
      };
    case REQUESTS.UPDATE_DEVICE.SUCCESS:
      return {
        ...state,
        device: {
          version: action.version,
          local_version: action.local_version,
          local_id: action.local_id,
          family: action.family,
          name: action.name,
          os: action.os,
        },
        cableId: action.id,
      };
    case REQUESTS.CREATE_DEVICE.SUCCESS:
      return {
        ...state,
        device: {
          version: action.version,
          local_version: action.local_version,
          local_id: action.local_id,
          family: action.family,
          name: action.name,
          os: action.os,
        },
        cableId: action.id,
      };
    case REQUESTS.DESTROY_DEVICE.SUCCESS:
      return {
        ...state,
        device: {},
        cableId: '',
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}
