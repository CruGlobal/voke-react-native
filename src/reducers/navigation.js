// import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../NavConfig';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));

export default function navigation(state = initialState, action) {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
}
