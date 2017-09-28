// import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import { startLoginApp, startTabApp } from '../NavConfig';
import theme from '../theme';

const DEFAULT_PROPS = {
  'voke.Home': { title: 'Chats' },
  'voke.Videos': { title: 'Videos' },
  'voke.SelectFriend': { title: 'Select Friend' },
  'voke.Contacts': { title: 'Contacts' },
  'voke.Profile': {
    title: 'Profile',
    overrideBackPress: true,
  },
  'voke.Acknowledgements': { title: 'Acknowledgements' },
  'voke.About': { title: 'About' },
  'voke.Help': { title: 'Help' },
  'voke.VideoDetails': {
    appStyle: { orientation: 'auto' },
  },
  'voke.Message': {
    overrideBackPress: true,
  },
  'voke.CountrySelect': { title: 'Select Country' },
  // 'voke.SignUpAccount': { title: 'Create Account' },
  // 'voke.SignUpProfile': { title: 'Create Profile' },
  // 'voke.SignUpNumber': { title: 'Mobile Number' },
  // 'voke.SignUpNumberVerify': { title: 'Verify Number' },
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
    // navigator.resetTo({
    //   screen: 'voke.Home',
    //   animated: false,
    //   navigatorStyle: {
    //     screenBackgroundColor: theme.primaryColor,
    //   },
    //   ...options,
    // });
    startTabApp(options);
  };
}

export function navigateResetLogin(navigator, options = {}) {
  return () => {
    // navigator.resetTo({
    //   screen: 'voke.Login',
    //   animated: true,
    //   animationType: 'fade',
    //   ...options,
    // });
    startLoginApp(options);
  };
}

export function navigateResetToNumber(navigator, options = {}) {
  return () => {
    Navigation.startSingleScreenApp({
      // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
      animationType: 'none',
      ...options,
      appStyle: {
        // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
        orientation: 'portrait',
        statusBarColor: theme.statusBarColor,
        ...(options.appStyle || {}),
      },
      passProps: {
        ...(options.passProps || {}),
        hideBack: true,
      },
      overrideBackPress: true,
      screen: { screen: 'voke.SignUpNumber' },
    });
  };
}

export function navigateResetToProfile(navigator, options = {}) {
  return () => {
    Navigation.startSingleScreenApp({
      // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
      animationType: 'none',
      ...options,
      appStyle: {
        // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
        orientation: 'portrait',
        statusBarColor: theme.statusBarColor,
        ...(options.appStyle || {}),
      },
      passProps: {
        ...(options.passProps || {}),
        hideBack: true,
      },
      overrideBackPress: true,
      screen: { screen: 'voke.SignUpProfile' },
    });
  };
}

export const NavPropTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  navigatePush: PropTypes.func.isRequired, // Redux
  navigateBack: PropTypes.func.isRequired, // Redux
  navigateResetHome: PropTypes.func.isRequired, // Redux
  navigateResetLogin: PropTypes.func.isRequired, // Redux
  navigateResetToNumber: PropTypes.func.isRequired, // Redux
  navigateResetToProfile: PropTypes.func.isRequired, // Redux
};

// Redux connect function for navigator screens
export default (dispatch, { navigator }) => {
  return {
    dispatch,
    navigatePush: (...args) => dispatch(navigatePush(navigator, ...args)),
    navigateBack: (...args) => dispatch(navigateBack(navigator, ...args)),
    navigateResetHome: (...args) => dispatch(navigateResetHome(navigator, ...args)),
    navigateResetLogin: (...args) => dispatch(navigateResetLogin(navigator, ...args)),
    navigateResetToNumber: (...args) => dispatch(navigateResetToNumber(navigator, ...args)),
    navigateResetToProfile: (...args) => dispatch(navigateResetToProfile(navigator, ...args)),
  };
};
