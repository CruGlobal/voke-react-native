import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ } from '../constants';


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
      const newConvo = action.data ? action.data.conversationId : null;
      if (!newConvo) {
        return state;
      }
      return {
        ...state,
        typeState: {
          ...state.typeState,
          [newConvo]: action.data.bool,
        },
      };
    case NEW_MESSAGE:
      const conversationNewMessageId = action.message ? action.message.conversation_id : null;
      if (!conversationNewMessageId) {
        return state;
      }
      console.warn('new message', action.message);

      const msgPreviewConversations = state.conversations.map((c) => {
        if (c.id === conversationNewMessageId) {
          // order messengers
          const newMessenger = c.messengers.find((m) => m.id === action.message.messenger_id);
          let messengers = c.messengers.filter((m) => m.id !== action.message.messenger_id);
          messengers.unshift(newMessenger);
          return { ...c, messengers, messagePreview: action.message.content, hasUnread: true };
        }
        return c;
      });
      return {
        ...state,
        conversations: msgPreviewConversations,
        messages: {
          ...state.messages,
          [conversationNewMessageId]: [
            action.message,
            ...state.messages[conversationNewMessageId],
          ],
        },
      };
    case MARK_READ:
      const readConversations = state.conversations.map((c) => {
        if (c.id === action.conversationId) {
          return { ...c, hasUnread: false };
        }
        return c;
      });
      return {
        ...state,
        conversations: readConversations,
      };
    default:
      return state;
  }
}
