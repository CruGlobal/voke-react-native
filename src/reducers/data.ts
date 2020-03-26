import { REDUX_ACTIONS } from '../constants';
import { exists } from '../utils';

export type DataKeys =
  | 'availableAdventures'
  | 'myAdventures'
  | 'adventureSteps'
  | 'adventureStepMessages'
  | 'adventureInvitations';

const initialState = {
  availableAdventures: [],
  myAdventures: [],
  adventureInvitations: [],
  adventureSteps: {},
  adventureStepMessages: {},
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case REDUX_ACTIONS.SET_DATA:
      // @ts-ignore
      if (!exists(state[action.key]) || !action.data) {
        return state;
      }
      return { ...state, [action.key]: action.data };
    case REDUX_ACTIONS.START_ADVENTURE:
      let updatedMyAdventures: any = state.myAdventures;
      if (action.result) {
        updatedMyAdventures.push(action.result);
      }
      return { ...state, myAdventures: updatedMyAdventures };
    case REDUX_ACTIONS.SEND_ADVENTURE_INVITATION:
      let updatedAdventureInvitations: any = state.adventureInvitations;
      if (action.result) {
        updatedAdventureInvitations.push(action.result);
      }
      return { ...state, adventureInvitations: updatedAdventureInvitations };
    case REDUX_ACTIONS.GET_ADVENTURE_STEPS:
      let updatedAdventureSteps: any = state.adventureSteps;
      updatedAdventureSteps[action.result.adventureId] =
        action.result.adventureSteps;
      return { ...state, adventureSteps: updatedAdventureSteps };
    case REDUX_ACTIONS.GET_ADVENTURE_STEP_MESSAGES:
      let updatedAdventureStepMessages: any = state.adventureStepMessages;
      updatedAdventureStepMessages[action.result.adventureStepId] =
        action.result.adventureStepMessages;
      return { ...state, adventureStepMessages: updatedAdventureStepMessages };
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    case REDUX_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}
