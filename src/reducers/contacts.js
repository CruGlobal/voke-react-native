import { REHYDRATE } from 'redux-persist/constants';
import { SET_ALL_CONTACTS, SET_VOKE_CONTACTS } from '../constants';

const initialState = {
  all: [],
  voke: [],
  random: [],
};

export default function contacts(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.contacts;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case SET_ALL_CONTACTS:
      return {
        ...state,
        all: action.all || [],
        random: action.random || [],
      };
    case SET_VOKE_CONTACTS:
      return {
        ...state,
        voke: action.voke || [],
      };
    default:
      return state;
  }
}
