import theme from './theme';

// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { addNavigationHelpers, StackNavigator } from 'react-navigation';
//
// import Routes from './routes';
//
// // TODO: Look into switching to this navigator for more control:
// // https://wix.github.io/react-native-navigation/#/
//
//
// // See https://reactnavigation.org/docs/navigators/stack
// export const AppNavigator = StackNavigator(Routes, {
//   cardStyle: {
//     backgroundColor: theme.backgroundColor,
//   },
//   navigationOptions: {
//     headerTintColor: theme.headerTextColor,
//     headerStyle: {
//       backgroundColor: theme.headerBackgroundColor,
//     },
//   },
// });
//
// const AppWithNavState = ({ dispatch, navigationState }) => (
//   <AppNavigator
//     navigation={addNavigationHelpers({
//       dispatch,
//       state: navigationState,
//     })}
//   />
// );
//
// AppWithNavState.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   navigationState: PropTypes.object.isRequired,
// };
//
// const mapStateToProps = ({ navigation }) => ({
//   navigationState: navigation,
// });
//
// export default connect(mapStateToProps)(AppWithNavState);

import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import registerScreens from './routes';
import getStore from './store';

import { iconsMap, iconsLoaded } from './utils/iconMap';

// const tabs = [{
//   label: 'Navigation',
//   screen: 'voke.Home',
//   title: 'Navigation Types',
// }, {
//   label: 'Actions',
//   screen: 'voke.Videos',
//   title: 'Navigation Actions',
// }];
//
// if (Platform.OS === 'android') {
//   tabs.push({
//     label: 'Transitions',
//     screen: 'voke.Home',
//     title: 'Navigation Transitions',
//   });
// }

// TODO: Figure out how to put this in ./routes
const homeScreen = {
  screen: 'voke.Home',
  title: 'Home',
  titleImage: require('../images/vokeLogo.png'),
};
const loginScreen = {
  screen: 'voke.Login',
};

export default class App {
  constructor() {
    this.isLoading = true;
    // this.loadingState();
    this.store = getStore(() => {
      iconsLoaded.then(() => {
        this.isLoading = false;
        this.startApp();
      });
    });
    registerScreens(this.store, Provider);
    // screen related book keeping
  }

  loadingState() {
    Navigation.startSingleScreenApp({
      screen: loginScreen,
      animationType: 'none',
    });
  }

  startApp() {
    console.warn('this.store.getState()', this.store.getState());
    if (!this.store.getState().auth.isLoggedIn) {
      Navigation.startSingleScreenApp({
        screen: loginScreen,
        passProps: {},
        // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
        animationType: 'none',
        // tabsStyle: {
        //   tabBarBackgroundColor: '#003a66',
        //   navBarButtonColor: '#ffffff',
        //   tabBarButtonColor: '#ffffff',
        //   navBarTextColor: '#ffffff',
        //   tabBarSelectedButtonColor: '#ff505c',
        //   navigationBarColor: '#003a66',
        //   navBarBackgroundColor: '#003a66',
        //   statusBarColor: '#002b4c',
        //   tabFontFamily: 'BioRhyme-Bold',
        // },
        // drawer: {
        //   left: {
        //     screen: 'voke.Menu',
        //   },
        // },
      });
    } else {

      // this will start our app
      Navigation.startSingleScreenApp({
        screen: homeScreen,
        passProps: {
          hello: () => {
            console.warn('hello!');
            return store.dispatch({ type: 'HEY' });
          },
        },
        // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
        animationType: 'none',
        // tabsStyle: {
        //   tabBarBackgroundColor: '#003a66',
        //   navBarButtonColor: '#ffffff',
        //   tabBarButtonColor: '#ffffff',
        //   navBarTextColor: '#ffffff',
        //   tabBarSelectedButtonColor: '#ff505c',
        //   navigationBarColor: '#003a66',
        //   navBarBackgroundColor: '#003a66',
        //   statusBarColor: '#002b4c',
        //   tabFontFamily: 'BioRhyme-Bold',
        // },
        // drawer: {
        //   left: {
        //     screen: 'voke.Menu',
        //   },
        // },
      });
    }
  }
}
