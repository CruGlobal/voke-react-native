import lodashUniqBy from 'lodash/uniqBy';
import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT, NEW_JOURNEY_MESSAGE } from '../constants';

const initialState = {
  org: [],
  mine: [],
  invites: [],
  steps: {},
  messages: {},
};

function removeDuplicateMessages(msgs = []) {
  return lodashUniqBy(msgs, 'id');
}

export default function adventures(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.journeys;
      if (!incoming) return state;
      return {
        ...state,
        ...incoming,
      };
    case REQUESTS.GET_ORG_JOURNEYS.SUCCESS:
      return {
        ...state,
        org: action.organization_journeys,
      };
    case REQUESTS.GET_MY_JOURNEYS.SUCCESS:
      return {
        ...state,
        mine: action.journeys,
      };
    case REQUESTS.GET_JOURNEY_INVITES.SUCCESS:
      return {
        ...state,
        invites: action.journey_invites,
      };
    case REQUESTS.GET_MY_JOURNEY_STEPS.SUCCESS:
      const {
        query: { journeyId: stepsJourneyId },
        steps,
      } = action;
      return {
        ...state,
        steps: {
          ...state.steps,
          [stepsJourneyId]: steps || [],
        },
      };
    case REQUESTS.GET_MESSAGES.SUCCESS:
      const {
        query: { conversationId, messenger_journey_step_id: messageStepId },
        messages,
      } = action;
      if (!conversationId || !messageStepId || !messages) {
        return state;
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          [messageStepId]: messages || [],
        },
      };
    // // Fired from a socket event to new messages
    // case NEW_JOURNEY_MESSAGE:
    //   return state;
    //   const conversationNewMessageId = action.message
    //     ? action.message.conversation_id
    //     : null;
    //   if (!conversationNewMessageId) {
    //     return state;
    //   }
    //   const currentMessages = state.messages[conversationNewMessageId] || [];
    //   const newCreatedMessages = removeDuplicateMessages([
    //     action.message,
    //     ...currentMessages,
    //   ]);

    //   return {
    //     ...state,
    //     messages: {
    //       ...state.messages,
    //       [conversationId]: newCreatedMessages,
    //     },
    //   };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
