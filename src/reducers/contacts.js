import { REHYDRATE } from 'redux-persist/constants';

import { LOGOUT, SET_ALL_CONTACTS, SET_VOKE_CONTACTS, SET_CONTACTS_LOADING } from '../constants';
import { REQUESTS } from '../actions/api';

const initialState = {
  all: [],
  voke: [],
  random: [],
  lastUpdated: null,
  isLoading: false,
};

// Voke contacts object
// id: fcf3f974-7d52-4127-8600-c5c55c0a4499
// first_name: John
// last_name: Appleseed
// initials: JA
// mobile_app: false
// ▶avatar: { }
// present_at: null
// blocked: false
// blocked_by_messenger: false
// local_id: 410FE041-5C4E-48DA-B4DE-04C15EA3DBAC

export default function contacts(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.contacts;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case SET_CONTACTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SET_ALL_CONTACTS:
      return {
        ...state,
        all: action.all || [],
        random: action.random || [],
      };
    case SET_VOKE_CONTACTS:
      const vokeArr = action.voke || [];
      // Pull out the localIds to compare with the contactIds
      const vokeIds = vokeArr.map((c) => c.local_id);
      // Format contacts to update them based on if they match a voke id
      const allContacts = state.all.map((c) => {
        if (vokeIds.includes(c.id)) {
          const vokeContact = vokeArr.find((v) => v.local_id === c.id);
          c.isVoke = true;
          c.vokeDetails = vokeContact;
        }
        return c;
      });
      return {
        ...state,
        all: allContacts,
        voke: vokeArr,
      };

    case REQUESTS.ADD_FRIENDS.SUCCESS:
      return {
        ...state,
        lastUpdated: new Date().valueOf(),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
