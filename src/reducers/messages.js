import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';


const initialState = {
  conversations: [],
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.messages;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.GET_CONVERSATIONS.SUCCESS:
      return {
        ...state,
        conversations: action.conversations || [],
      };
    default:
      return state;
  }
}
