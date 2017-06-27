import { Platform } from 'react-native';
import PropTypes from 'prop-types';

// Wix navigation actions
export function navigatePush(navigator, screen, passProps = {}, screenProps = {}) {
  return () => {
    navigator.push({
      screen,
      ...screenProps,
      passProps,
    });
  };
}

export function navigateBack(navigator, options = {}) {
  return () => {
    navigator.pop({
      animated: true,
      animationType: 'fade', // Or 'slide-horizontal'
      ...options,
    });
  };
}

export function navigateResetHome(navigator, options = {}) {
  return () => {
    navigator.resetTo({
      screen: 'voke.Home',
      animated: false,
      ...options,
    });
  };
}

export function navigateResetLogin(navigator, options = {}) {
  return () => {
    navigator.resetTo({
      screen: 'voke.Login',
      animated: true,
      animationType: 'fade',
      ...options,
    });
  };
}

export const NavPropTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  navigatePush: PropTypes.func.isRequired, // Redux
  navigateBack: PropTypes.func.isRequired, // Redux
  navigateResetHome: PropTypes.func.isRequired, // Redux
  navigateResetLogin: PropTypes.func.isRequired, // Redux
};

// Redux connect function for navigator screens
export default (dispatch, { navigator }) => {
  return {
    dispatch,
    navigatePush: (...args) => dispatch(navigatePush(navigator, ...args)),
    navigateBack: (...args) => dispatch(navigateBack(navigator, ...args)),
    navigateResetHome: (...args) => dispatch(navigateResetHome(navigator, ...args)),
    navigateResetLogin: (...args) => dispatch(navigateResetLogin(navigator, ...args)),
  };
};