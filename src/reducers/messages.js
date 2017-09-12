import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT, NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ } from '../constants';


const initialState = {
  conversations: [],
  messages: {},
  typeState: {},
  unReadBadgeCount: 0,
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
      const unReadCheck = action.conversations.find((m) => m.hasUnread === true);
      let unRead;
      if (unReadCheck) {
        unRead = state.unReadBadgeCount;
      } else { unRead = 0; }

      return {
        ...state,
        conversations: action.conversations || [],
        typeState: {},
        unReadBadgeCount: unRead,
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
    
    // Fired from a socket event to new messages
    case NEW_MESSAGE:
      const conversationNewMessageId = action.message ? action.message.conversation_id : null;
      if (!conversationNewMessageId) {
        return state;
      }
      let currentBadgeCount = state.unReadBadgeCount;
      let msgPreviewConversations = state.conversations.map((c) => {
        if (c.id === conversationNewMessageId) {
          // order messengers
          const newMessenger = c.messengers.find((m) => m.id === action.message.messenger_id);
          let messengers = c.messengers.filter((m) => m.id !== action.message.messenger_id);
          messengers.unshift(newMessenger);
          currentBadgeCount = currentBadgeCount +1;
          return { ...c, messengers, messagePreview: action.message.content, hasUnread: true, unReadCount: c.unReadCount ? c.unReadCount + 1 : 1 };
        }
        return c;
      });

      // Move the conversation to the first item in the list
      const convIndex = msgPreviewConversations.findIndex((c) => c.id === conversationNewMessageId);
      // Do this only if the index exists and is not already first in the array
      if (convIndex > 0) {
        const conversationToMoveToFront = msgPreviewConversations[convIndex];
        msgPreviewConversations.splice(convIndex, 1);
        msgPreviewConversations.unshift(conversationToMoveToFront);
      }

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
        unReadBadgeCount: currentBadgeCount,
      };
    case MARK_READ:
      let currentBadgeCount2 = state.unReadBadgeCount;

      const readConversations = state.conversations.map((c) => {
        if (c.id === action.conversationId) {
          currentBadgeCount2 = c.unReadCount >0 ? currentBadgeCount2 - c.unReadCount : currentBadgeCount2;
          return { ...c, hasUnread: false, unReadCount: 0 };
        }
        return c;
      });
      return {
        ...state,
        conversations: readConversations,
        unReadBadgeCount: currentBadgeCount2,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
