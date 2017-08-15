// import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import './utils/reactotron'; // This needs to be before the store

import registerScreens from './routes';
import getStore from './store';

import theme from './theme';
import { iconsLoaded } from './utils/iconMap';

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

const homeScreen = {
  screen: 'voke.Home',
  title: 'Home',
  titleImage: require('../images/nav_voke_logo.png'),
  navigatorStyle: {
    screenBackgroundColor: theme.primaryColor,
  },
};
const loginScreen = {
  screen: 'voke.Login',
  navigatorStyle: {
    screenBackgroundColor: theme.primaryColor,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  },
};

export default class App {
  constructor() {
    // Need to load the store with redux-persist and then start the app when it's loaded
    this.store = getStore(() => {
      iconsLoaded.then(() => {
        this.startApp();
      });
    });
    registerScreens(this.store, Provider);
    this.loadingState();
  }

  loadingState() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'voke.Loading',
      },
      animationType: 'fade',
    });
  }

  startApp() {
    if (!this.store.getState().auth.isLoggedIn) {
      Navigation.startSingleScreenApp({
        screen: loginScreen,
        passProps: {},
        // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
        animationType: 'fade',
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
        passProps: {},
        // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
        animationType: 'fade',
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
