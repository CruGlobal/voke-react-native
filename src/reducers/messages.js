import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { NEW_MESSAGE } from '../constants';


const initialState = {
  conversations: [],
  messages: {},
  // Key is conversationId, value
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
      const conversationId = action.messages[0] ? action.messages[0].conversation_id : null;
      if (!conversationId) {
        return state;
      }
      return {
        ...state,
        messages: { ...state.messages, [conversationId]: action.messages },
      };
    case NEW_MESSAGE:
      const conversationNewMessageId = action.message ? action.message.conversation_id : null;
      if (!conversationNewMessageId) {
        return state;
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationNewMessageId]: [
            action.message,
            ...state.messages[conversationNewMessageId],
          ],
        },
      };
    default:
      return state;
  }
}
