import lodashUniqBy from 'lodash/uniqBy';
import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT, NEW_MESSAGE, TYPE_STATE_CHANGE, MARK_READ, SET_ACTIVE_CONVERSATION, SET_IN_SHARE, MESSAGE_CREATED } from '../constants';
import { isArray } from '../utils/common';
import Notifications from '../utils/notifications';



const initialState = {
  conversations: [],
  messages: {},
  typeState: {},
  unReadBadgeCount: 0,
  pagination: {
    conversations: {
      hasMore: false,
      page: 1,
    },
    messages: {},
  },
  inShare: false,
  activeConversationId: null,
  getConversationsIsRunning: false,
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

function removeDuplicateMessages(msgs = []) {
  return lodashUniqBy(msgs, 'id');
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
        pagination: initialState.pagination,
        unReadBadgeCount: 0,
        inShare: false,
      };
    // Add or update the existing conversation that's returned in the conversations array
    case REQUESTS.GET_CONVERSATION.SUCCESS:
      let stateConversations = state.conversations;
      const newConversation = action.conversation;
      if (!newConversation) {
        return state;
      }
      const newConvIndex = stateConversations.findIndex((c) => c.id === newConversation.id);
      if (newConvIndex >= 0) {
        stateConversations[newConvIndex] = newConversation;
      } else {
        stateConversations = [newConversation, ...state.conversations];
      }

      return {
        ...state,
        conversations: stateConversations,
      };
    case REQUESTS.GET_CONVERSATIONS.FETCH:
      return {
        ...state,
        getConversationsIsRunning: true,
      };
    case REQUESTS.GET_CONVERSATIONS.FAIL:
      return {
        ...state,
        getConversationsIsRunning: false,
      };
    case REQUESTS.GET_CONVERSATIONS.SUCCESS:
      let newConversations = [];
      if (action.query.page && action.query.page > 1) {
        newConversations = state.conversations;
      }
      const conversationPagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      newConversations = newConversations.concat(action.conversations);
      // const unReadCheck = newConversations.filter((m) => m.hasUnread).length;
      // const unRead = unReadCheck || 0;
      // Pull the unread count from the '_meta' in notifications
      let unRead = action._meta ? action._meta.pending_notifications : 0;
      unRead = unRead >= 0 ? unRead : 0;
      Notifications.setBadge(unRead);

      return {
        ...state,
        conversations: newConversations,
        typeState: {},
        unReadBadgeCount: unRead,
        getConversationsIsRunning: false,
        pagination: {
          ...state.pagination,
          conversations: conversationPagination,
        },
      };
    case REQUESTS.GET_MESSAGES.SUCCESS:
      const conversationId = action.messages[0] ? action.messages[0].conversation_id : null;
      if (!conversationId) {
        return state;
      }
      let newMessages = [];
      if (action.query && action.query.page && state.messages[conversationId]) {
        newMessages = state.messages[conversationId];
      }
      newMessages = newMessages.concat(action.messages || []);
      const messagePagination = {
        hasMore: action._links ? !!action._links.next : false,
        page: action.query.page || 1,
      };
      newMessages = removeDuplicateMessages(newMessages);


      // Update the conversation messagePreview and latestMessage based on the first new message
      // This should happen so when push notification messages come in, everything is up to date
      const msgPreviewConversationsNewMessages = state.conversations.map((c) => {
        if (newMessages[0] && c.id === conversationId) {
          return {
            ...c,
            messagePreview: newMessages[0].content,
            latestMessage: {
              message_id: newMessages[0].id,
            },
          };
        }
        return c;
      });


      return {
        ...state,
        conversations: msgPreviewConversationsNewMessages,
        messages: { ...state.messages, [conversationId]: newMessages },
        pagination: {
          ...state.pagination,
          messages: {
            ...state.pagination.messages,
            [conversationId]: messagePagination,
          },
        },
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
    // When I create a message, reorder the conversations to have this one at the top;
    case REQUESTS.DELETE_CONVERSATION.SUCCESS:
      const conversationIdToDelete = action.query.id;
      // Remove the conversation from the array
      const newConversationsWithDeleted = state.conversations.filter((c) => c.id !== conversationIdToDelete);
      // Remove any messages associated with that conversation
      let newMessagesWithDeleted = state.messages;
      if (newMessagesWithDeleted[conversationIdToDelete]) {
        delete newMessagesWithDeleted[conversationIdToDelete];
      }
      newMessagesWithDeleted = removeDuplicateMessages(newMessagesWithDeleted);
      return {
        ...state,
        messages: newMessagesWithDeleted,
        conversations: newConversationsWithDeleted,
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
      const incrementBadge = action.incrementBadge;
      let currentBadgeCount = state.unReadBadgeCount;
      let msgPreviewConversations = state.conversations.map((c) => {
        if (c.id === conversationNewMessageId) {
          // order messengers
          const newMessenger = c.messengers.find((m) => m.id === action.message.messenger_id);
          let messengers = c.messengers.filter((m) => m.id !== action.message.messenger_id);
          if (newMessenger) {
            messengers.unshift(newMessenger);
          }
          // Always increment the badge count
          let cnt = (c.unReadCount || 0);
          if (incrementBadge) {
            cnt++;
            currentBadgeCount++;
          }
          return {
            ...c,
            messengers,
            messagePreview: action.message.content,
            hasUnread: cnt > 0,
            unReadCount: cnt,
            latestMessage: {
              message_id: action.message.id,
            },
          };
        }
        return c;
      });

      // Move the conversation to the first item in the list
      msgPreviewConversations = moveConversationFirst(msgPreviewConversations, conversationNewMessageId);
      let newCreatedMessages = [
        action.message,
        // Spread over an existing array or force it to a blank array if it doesnt exist
        ...(state.messages[conversationNewMessageId] || []),
      ];
      newCreatedMessages = removeDuplicateMessages(newCreatedMessages);

      currentBadgeCount = currentBadgeCount >= 0 ? currentBadgeCount : 0;
      Notifications.setBadge(currentBadgeCount);

      return {
        ...state,
        conversations: msgPreviewConversations,
        messages: {
          ...state.messages,
          [conversationNewMessageId]: newCreatedMessages,
        },
        unReadBadgeCount: currentBadgeCount,
      };
    // Fired from a socket event to new messages
    case MESSAGE_CREATED:
      const messageCreatedConversationId = action.conversationId;
      if (!messageCreatedConversationId) {
        return state;
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          [messageCreatedConversationId]: [
            action.message,
            // Spread over an existing array or force it to a blank array if it doesnt exist
            ...(state.messages[messageCreatedConversationId] || []),
          ],
        },
      };
    case MARK_READ:
      let currentBadgeCount2 = state.unReadBadgeCount;
      const readConversations = state.conversations.map((c) => {
        if (c.id === action.conversationId) {
          currentBadgeCount2 = c.unReadCount > 0 ? currentBadgeCount2 - c.unReadCount : currentBadgeCount2;
          return {
            ...c,
            hasUnread: false,
            unReadCount: 0,
            myLatestReadId: action.messageId,
          };
        }
        return c;
      });

      currentBadgeCount2 = currentBadgeCount2 >= 0 ? currentBadgeCount2 : 0;
      Notifications.setBadge(currentBadgeCount2);

      return {
        ...state,
        conversations: readConversations,
        unReadBadgeCount: currentBadgeCount2,
      };
    case SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        activeConversationId: action.id,
      };
    case SET_IN_SHARE:
      return {
        ...state,
        inShare: action.bool,
      };
    case LOGOUT:
      Notifications.setBadge(0);
      return initialState;
    default:
      return state;
  }
}
