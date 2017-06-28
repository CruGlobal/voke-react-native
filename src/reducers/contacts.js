import { REHYDRATE } from 'redux-persist/constants';
import { SET_CONTACTS } from '../constants';

const initialState = {
  all: [],
  voke: [],
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
    case SET_CONTACTS:
      return {
        ...state,
        all: action.all || [],
        voke: action.voke || [],
      };
    default:
      return state;
  }
}