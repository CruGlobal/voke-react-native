import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT, NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ } from '../constants';
import { isArray } from '../utils/common';

const initialState = {
  conversations: [],
  messages: {},
  typeState: {},
  unReadBadgeCount: 0,
};

function moveConversationFirst(conversations, conversationId) {
  let reorderItems = isArray(conversations) ? [...conversations] : [];
  if (!conversationId) return reorderItems;
  // Move the conversation to the first item in the list
  const convIndex = reorderItems.findIndex((c) => c.id === conversationId);
  // Do this only if the index exists and is not already first in the array
  if (convIndex > 0) {
    const conversationToMoveToFront = reorderItems[convIndex];
    reorderItems.splice(convIndex, 1);
    reorderItems.unshift(conversationToMoveToFront);
  }
  return reorderItems;
}

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
        messages: { ...state.messages, [conversationId]: action.messages || [] },
      };

    // When I create a message, reorder the conversations to have this one at the top;
    case REQUESTS.CREATE_MESSAGE.SUCCESS:
      let newConversationsOrder = moveConversationFirst(state.conversations, action.conversation_id);
      // Set the message preview based on the message that I sent
      if (newConversationsOrder[0] && action.data && action.data.message) {
        if (action.data.message.content) {
          newConversationsOrder[0].messagePreview = action.data.message.content;
        } else if (action.data.message.item_id) {
          newConversationsOrder[0].messagePreview = 'Shared a video';
        }
      }
      return {
        ...state,
        conversations: newConversationsOrder,
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
          if (newMessenger) {
            messengers.unshift(newMessenger);
          }
          currentBadgeCount++;
          return {
            ...c,
            messengers,
            messagePreview: action.message.content,
            hasUnread: true,
            unReadCount: c.unReadCount ? c.unReadCount + 1 : 1,
          };
        }
        return c;
      });
      
      // Move the conversation to the first item in the list
      msgPreviewConversations = moveConversationFirst(msgPreviewConversations, conversationNewMessageId);

      return {
        ...state,
        conversations: msgPreviewConversations,
        messages: {
          ...state.messages,
          [conversationNewMessageId]: [
            action.message,
            // Spread over an existing array or force it to a blank array if it doesnt exist
            ...(state.messages[conversationNewMessageId] || []),
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
