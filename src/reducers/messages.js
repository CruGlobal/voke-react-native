import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';


const initialState = {
  conversations: [],
  messages: [],
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
    case REQUESTS.GET_MESSAGES.SUCCESS:
      // const conversationId = action.messages[0] ? action.messages[0].conversation_id : 'conversationId';
      return {
        ...state,
        messages: action.messages,
      };
    default:
      return state;
  }
}
