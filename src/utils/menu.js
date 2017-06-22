import { navigateAction } from '../actions/navigation';
import { logoutAction } from '../actions/auth';

// This is used by the android <MenuButton /> and the iOS <Menu />
export function navMenuOptions(dispatch) {
  return [
    { name: 'Profile', onPress: () => dispatch(navigateAction('Home')) },
    { name: 'About', onPress: () => dispatch(navigateAction('About')) },
    { name: 'Write a Review', onPress: () => dispatch(navigateAction('Home')) },
    { name: 'Acknowledgements', onPress: () => dispatch(navigateAction('Acknowledgements')) },
    { name: 'Help', onPress: () => dispatch(navigateAction('Home')) },
    { name: 'Sign Out', onPress: () => dispatch(logoutAction()) },
  ];
}