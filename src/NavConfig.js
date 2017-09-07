// import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import registerScreens from './routes';
import getStore from './store';

import theme, { COLORS } from './theme';
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
  // navigatorStyle: {
  //   screenBackgroundColor: theme.primaryColor,
  // },
};
const loginScreen = {
  screen: 'voke.Login',
  // navigatorStyle: {
  //   screenBackgroundColor: theme.primaryColor,
  //   navBarButtonColor: theme.lightText,
  //   navBarTextColor: theme.headerTextColor,
  //   navBarBackgroundColor: theme.primaryColor,
  //   navBarNoBorder: true,
  //   topBarElevationShadowEnabled: false,
  // },
};

export function startTabApp(options = {}) {
  // this will start our app
  Navigation.startTabBasedApp({
    ...options,
    tabs: [
      {
        label: 'Chats', // tab label as appears under the icon in iOS (optional)
        screen: 'voke.Home', // unique ID registered with Navigation.registerScreen
        title: 'Chats',
        // titleImage: require('../images/nav_voke_logo.png'),
        icon: require('../images/chats_icon.png'), // local image asset for the tab icon unselected state (optional on iOS)
        // selectedIcon: require('../img/one_selected.png'), // local image asset for the tab icon selected state (optional, iOS only. On Android, Use `tabBarSelectedButtonColor` instead)
        // iconInsets: { // add this to change icon position (optional, iOS only).
        //   top: 6, // optional, default is 0.
        //   left: 0, // optional, default is 0.
        //   bottom: -6, // optional, default is 0.
        //   right: 0 // optional, default is 0.
        // },
        // title: 'Screen One', // title of the screen as appears in the nav bar (optional)
        // titleImage: require('../img/titleImage.png'), // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
        // navigatorStyle: {
        //   navBarBackgroundColor: theme.secondaryColor,
        // },
        // navigatorButtons: {} // override the nav buttons for the tab screen, see "Adding buttons to the navigator" below (optional)
      },
      {
        label: 'Videos',
        title: 'Videos',
        screen: 'voke.Videos',
        icon: require('../images/video_icon.png'),
        // selectedIcon: require('../img/two_selected.png'),
        // title: 'Screen Two'
      },
    ],
    tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
      tabBarButtonColor: theme.primaryColor, // optional, change the color of the tab icons and text (also unselected)
      tabBarSelectedButtonColor: theme.textColor, // optional, change the color of the selected tab icon and text (only selected)
      tabBarBackgroundColor: theme.secondaryColor, // optional, change the background color of the tab bar
      initialTabIndex: 0, // optional, the default selected bottom tab. Default: 0
      tabBarTranslucent: false,
      tabBarLabelColor: theme.primaryColor,
      tabBarSelectedLabelColor: theme.textColor,
      tabBarHideShadow: true,
      ...(options.tabsStyle || {}),
    },
    appStyle: {
      orientation: 'portrait',
      tabBarButtonColor: theme.primaryColor, // optional, change the color of the tab icons and text (also unselected)
      tabBarSelectedButtonColor: theme.textColor, // optional, change the color of the selected tab icon and text (only selected)
      tabBarBackgroundColor: theme.secondaryColor, // optional, change the background color of the tab bar
      bottomTabBadgeTextColor: theme.primaryColor, // Optional, change badge text color. Android only
      bottomTabBadgeBackgroundColor: COLORS.YELLOW, // Optional, change badge background color. Android only
      tabBarTranslucent: false,
      forceTitlesDisplay: true, // Android, only show title
      ...(options.appStyle || {}),
    },
    // screen: homeScreen,
    // passProps: {},
    // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
    // animationType: 'fade',
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

export function startLoginApp(options = {}) {
  Navigation.startSingleScreenApp({
    // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
    animationType: 'fade',
    ...options,
    screen: loginScreen,
  });
}

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
      startLoginApp();
    } else {
      startTabApp();
    }
  }
}
