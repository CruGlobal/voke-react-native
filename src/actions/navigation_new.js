// import { Platform } from 'react-native';
import PropTypes from 'prop-types';

const DEFAULT_PROPS = {
  'voke.Videos': {
    title: 'Videos',
    titleImage: require('../../images/vokeLogo.png'),
  },
  'voke.SelectFriend': {
    title: 'Select Friend',
    titleImage: require('../../images/vokeLogo.png'),
  },
  'voke.Contacts': { title: 'Contacts' },
  'voke.Profile': { title: 'Profile' },
  'voke.Acknowledgements': { title: 'Acknowledgements' },
  'voke.About': { title: 'About' },
};
// Handle default screen things
function defaultProps(screen, props) {
  const newProps = {
    ...(DEFAULT_PROPS[screen] || {}),
    ...props,
  };
  return newProps;
}
// Wix navigation actions
export function navigatePush(navigator, screen, passProps = {}, screenProps = {}) {
  return () => {
    let newScreenProps = defaultProps(screen, screenProps);
    navigator.push({
      screen,
      ...newScreenProps,
      passProps,
    });
  };
}

export function navigateBack(navigator, options = {}) {
  return () => {
    navigator.pop({
      animated: true,
      animationType: 'slide-horizontal', // Or 'slide-horizontal'
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
