import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';


export function navigatePush(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({
      routeName: screen,
      params: props,
    }));
  };
}

export function navigateBack(key = null) {
  return (dispatch) => {
    dispatch(NavigationActions.back({ key }));
  };
}

export function navigateResetTo(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen }),
      ],
    }));
  };
}

export function navigateResetHome(options) {
  return (dispatch) => {
    dispatch(navigatePush('MainTabs'));
  };
}

export function navigateResetLogin(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.Login'));
  };
}

export function navigateResetToNumber(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.SignUpNumber'));
  };
}

export function navigateResetToProfile(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.SignUpProfile'));
  };
}

export function navigateModal(screen, props) {
  return (dispatch) => {
    dispatch(navigatePush(screen, props));
  };
}

// Wix navigation actions
// export function navigatePush(navigator, screen, passProps = {}, screenProps = {}) {
//   return () => {
//     let newScreenProps = defaultProps(screen, screenProps, passProps);
//     navigator.push({
//       screen,
//       ...newScreenProps,
//       passProps,
//     });
//   };
// }
// // Wix navigation actions
// export function navigateResetTo(navigator, screen, passProps = {}, screenProps = {}) {
//   return () => {
//     let newScreenProps = defaultProps(screen, screenProps, passProps);
//     navigator.resetTo({
//       screen,
//       ...newScreenProps,
//       passProps,
//     });
//   };
// }

// export function navigateBack(navigator, options = {}) {
//   return () => {
//     navigator.pop({
//       animated: true,
//       animationType: 'slide-horizontal', // Or 'slide-horizontal'
//       ...options,
//     });
//   };
// }

// export function navigateResetHome(navigator, options = {}) {
//   return () => {
//     // navigator.resetTo({
//     //   screen: 'voke.Home',
//     //   animated: false,
//     //   navigatorStyle: {
//     //     screenBackgroundColor: theme.primaryColor,
//     //   },
//     //   ...options,
//     // });
//     startTabApp({
//       animationType: 'fade',
//       ...(options || {}),
//     });
//   };
// }

// export function navigateResetLogin(navigator, options = {}) {
//   return (dispatch) => {
//     // navigator.resetTo({
//     //   screen: 'voke.Login',
//     //   animated: true,
//     //   animationType: 'fade',
//     //   ...options,
//     // });
//     dispatch(logoutAction());
//     startLoginApp(options);
//   };
// }

// export function navigateResetToNumber(navigator, options = {}) {
//   return () => {
//     Navigation.startSingleScreenApp({
//       // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
//       animationType: 'none',
//       ...options,
//       appStyle: {
//         // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
//         orientation: 'portrait',
//         statusBarColor: theme.statusBarColor,
//         ...(options.appStyle || {}),
//       },
//       passProps: {
//         ...(options.passProps || {}),
//         hideBack: true,
//       },
//       overrideBackPress: true,
//       screen: { screen: 'voke.SignUpNumber' },
//     });
//   };
// }

// export function navigateResetToProfile(navigator, options = {}) {
//   return () => {
//     Navigation.startSingleScreenApp({
//       // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
//       animationType: 'none',
//       ...options,
//       appStyle: {
//         // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
//         orientation: 'portrait',
//         statusBarColor: theme.statusBarColor,
//         ...(options.appStyle || {}),
//       },
//       passProps: {
//         ...(options.passProps || {}),
//         hideBack: true,
//       },
//       overrideBackPress: true,
//       screen: { screen: 'voke.SignUpProfile' },
//     });
//   };
// }

export const NavPropTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  navigatePush: PropTypes.func.isRequired, // Redux
  navigateBack: PropTypes.func.isRequired, // Redux
  navigateResetHome: PropTypes.func.isRequired, // Redux
  navigateResetLogin: PropTypes.func.isRequired, // Redux
  navigateResetToNumber: PropTypes.func.isRequired, // Redux
  navigateResetToProfile: PropTypes.func.isRequired, // Redux
  navigateResetTo: PropTypes.func.isRequired, // Redux
  navigateModal: PropTypes.func.isRequired, // Redux
};

// Redux connect function for navigator screens
export default (dispatch) => {
  return {
    dispatch,
    navigatePush: debounce((...args) => dispatch(navigatePush(...args)), 50),
    navigateBack: (...args) => dispatch(navigateBack(...args)),
    navigateResetHome: (...args) => dispatch(navigateResetHome(...args)),
    navigateResetLogin: (...args) => dispatch(navigateResetLogin(...args)),
    navigateResetToNumber: (...args) => dispatch(navigateResetToNumber(...args)),
    navigateResetToProfile: (...args) => dispatch(navigateResetToProfile(...args)),
    navigateResetTo: (...args) => dispatch(navigateResetTo(...args)),
    navigateModal: (...args) => dispatch(navigateResetTo(...args)),
  };
};
