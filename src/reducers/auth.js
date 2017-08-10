import { REHYDRATE } from 'redux-persist/constants';
import { LOGIN, LOGOUT } from '../constants';
// import { REQUESTS } from '../actions/api';

const initialAuthState = {
  token: '',
  user: {},
  isLoggedIn: false,
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
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}