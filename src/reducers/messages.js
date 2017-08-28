import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { NEW_MESSAGE, TYPE_STATE_CHANGE } from '../constants';


const initialState = {
  conversations: [],
  messages: {},
  typeState: {},
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.messages;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
        typeState: {},
      };
    case REQUESTS.GET_CONVERSATIONS.SUCCESS:
      return {
        ...state,
        conversations: action.conversations || [],
        typeState: {},
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
    case TYPE_STATE_CHANGE:
      return {
        ...state,
        typeState: { ...state.typeState, [action.data.conversationId]: action.data.bool },
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
