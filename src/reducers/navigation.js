// import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../NavConfig';
import { REHYDRATE } from 'redux-persist/constants';

const loginState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));
const homeState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));

export default function navigation(state = loginState, action) {
  // If the user is logged in, set navigation correctly
  if (action.type === REHYDRATE) {
    const incomingAuth = action.payload.auth;
    if (incomingAuth && incomingAuth.isLoggedIn) {
      return homeState;
    }
    return state;
  }
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
}
