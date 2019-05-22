import { StackActions, NavigationActions } from 'react-navigation';
import { REHYDRATE } from 'redux-persist/constants';

import { MainRoutes } from '../AppRoutes';

const initialState = MainRoutes.router.getStateForAction(
  MainRoutes.router.getActionForPathAndParams('voke.SignUpWelcome'),
);
const initialStateLoggedIn = MainRoutes.router.getStateForAction(
  StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainTabs' })],
  }),
);

function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      const auth = action.payload && action.payload.auth;
      if (auth && auth.token && auth.isLoggedIn) {
        return initialStateLoggedIn;
      }
      return state;
    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
}

export default navReducer;
