// import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../theme';

const DEFAULT_PROPS = {
  'voke.Videos': {
    title: 'Videos',
    titleImage: require('../../images/nav_voke_logo.png'),
  },
  'voke.SelectFriend': {
    title: 'Select Friend',
    titleImage: require('../../images/nav_voke_logo.png'),
  },
  'voke.MessageTabView': {
    title: 'Add',
    topTabs: [
      {
        screenId: 'voke.KickstartersTab',
        title: 'Kickstarters',
      },
      {
        screenId: 'voke.VideosTab',
        title: 'Videos',
      },
    ],
  },
  // 'voke.Message': {},
  'voke.Contacts': { title: 'Contacts' },
  'voke.Profile': { title: 'Profile' },
  'voke.Acknowledgements': { title: 'Acknowledgements' },
  'voke.About': { title: 'About' },
  'voke.Help': { title: 'Help' },
  // 'voke.SignUpAccount': { title: 'Create Account' },
  // 'voke.SignUpProfile': { title: 'Create Profile' },
  // 'voke.SignUpNumber': { title: 'Mobile Number' },
  // 'voke.SignUpNumberVerify': { title: 'Verify Number' },
  'voke.CountrySelect': { title: 'Select Country' },
};
// Handle default screen things
function defaultProps(screen, props, passProps) {
  let newProps = {
    ...(DEFAULT_PROPS[screen] || {}),
    ...props,
  };
  if (screen === 'voke.Message' && passProps.name) {
    newProps.title = passProps.name;
  }
  if (screen === 'voke.MessageTabView' && passProps.onSelectKickstarter) {
    newProps.topTabs[0].passProps = { onSelect: passProps.onSelectKickstarter };
  }
  if (screen === 'voke.MessageTabView' && passProps.onSelectVideo) {
    newProps.topTabs[1].passProps = { onVideoShare: passProps.onSelectVideo };
  }
  return newProps;
}
// Wix navigation actions
export function navigatePush(navigator, screen, passProps = {}, screenProps = {}) {
  return () => {
    let newScreenProps = defaultProps(screen, screenProps, passProps);
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
      navigatorStyle: {
        screenBackgroundColor: theme.primaryColor,
      },
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
