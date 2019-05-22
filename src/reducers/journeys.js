import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import {
  LOGOUT,
  ACTIVE_JOURNEY,
  INACTIVE_JOURNEY,
  UPDATE_JOURNEY_STEP,
} from '../constants';

const initialState = {
  activeJourney: null,
  org: [],
  mine: [],
  invites: [],
  steps: {},
  messages: {},
};

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
        steps: myJourneySteps,
      } = action;
      const completed = myJourneySteps.reduce((previous, next) => {
        return previous + (next.status === 'completed' ? 1 : 0);
      }, 0);
      return {
        ...state,
        steps: {
          ...state.steps,
          [stepsJourneyId]: myJourneySteps || [],
        },
        mine: state.mine.map(i =>
          i.id === stepsJourneyId
            ? { ...i, progress: { ...i.progress, completed } }
            : i,
        ),
      };
    case UPDATE_JOURNEY_STEP:
      const {
        journeyId: updateJourneyId,
        journeyStepId: updateJourneyStepId,
        updateObj,
      } = action;
      const currentSteps = state.steps[updateJourneyId] || [];
      const indexToUpdate = currentSteps.findIndex(
        s => s.id === updateJourneyStepId,
      );
      if (indexToUpdate >= 0) {
        currentSteps[indexToUpdate] = {
          ...(currentSteps[indexToUpdate] || {}),
          ...(updateObj || {}),
        };
      }
      return {
        ...state,
        steps: {
          ...state.steps,
          [updateJourneyId]: currentSteps,
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
    case ACTIVE_JOURNEY:
      return {
        ...state,
        activeJourney: action.journey,
      };
    case INACTIVE_JOURNEY:
      return {
        ...state,
        activeJourney: null,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
