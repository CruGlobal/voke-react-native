import { REDUX_ACTIONS } from '../constants';
import { exists } from '../utils';

export type DataKeys =
  | 'availableAdventures'
  | 'myAdventures'
  | 'adventureInvitations';

const initialState = {
  availableAdventures: [],
  myAdventures: [],
  adventureInvitations: [],
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
    case REDUX_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
