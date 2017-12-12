import { REHYDRATE } from 'redux-persist/constants';

import { LOGIN, LOGOUT, SET_USER, SET_PUSH_TOKEN, TAB_SELECTED, ACTIVE_SCREEN, UPDATE_TOKENS, NO_BACKGROUND_ACTION, RESET_TOKEN } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = {
  token: '',
  refreshToken: '',
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
  pushId: '',
  apiActive: 0,
  homeTabSelected: 0,
  activeScreen: null,
  // onboardCompleted: false,
  noBackgroundAction: false,
};

export default function auth(state = initialState, action) {

  // Keep track of API loading requests
  if (action.type && action.showApiLoading) {
    if (action.type.endsWith('_SUCCESS') || action.type.endsWith('_FAIL')) {
      const apiReqs = state.apiActive - 1;
      return { ...state, apiActive: apiReqs < 0 ? 0 : apiReqs };
    } else if (action.type.endsWith('_FETCH')) {
      return { ...state, apiActive: state.apiActive + 1 };
    }
  }

  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.auth;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
        // onboardCompleted: false,
        apiActive: 0,
        homeTabSelected: 0, // Always default the home page to tab 0
        activeScreen: null,
        noBackgroundAction: false,
      };

    case TAB_SELECTED: {
      return {
        ...state,
        homeTabSelected: action.tab || 0,
      };
    }

    case LOGIN:
      return {
        ...state,
        token: action.token,
        refreshToken: action.data ? action.data.refresh_token : '',
        isLoggedIn: true,
      };
    case RESET_TOKEN:
      return {
        ...state,
        token: '',
        refreshToken: '',
      };
    case UPDATE_TOKENS:
      return {
        ...state,
        token: action.data.access_token,
        refreshToken: action.data.refresh_token,
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
    case REQUESTS.CREATE_PUSH_DEVICE.SUCCESS:
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
        pushId: action.id,
      };
    case REQUESTS.DESTROY_DEVICE.SUCCESS:
      return {
        ...state,
        device: {},
        cableId: '',
      };
    case ACTIVE_SCREEN:
      return {
        ...state,
        activeScreen: action.screen,
      };
    // case ONBOARD_FLAG:
    //   return {
    //     ...state,
    //     onboardCompleted: action.completed,
    //   };
    case NO_BACKGROUND_ACTION:
      return {
        ...state,
        noBackgroundAction: action.value,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
