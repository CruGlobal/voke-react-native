import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation, NativeEventsReceiver } from 'react-native-navigation';
import './utils/reactotron'; // This needs to be before the store
import './utils/globals';
import Analytics from './utils/analytics';
import registerScreens from './routes';
import getStore from './store';

import theme, { COLORS } from './theme';
import { iconsLoaded } from './utils/iconMap';

const loginScreen = {
  screen: 'voke.SignUpWelcome',
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
        ...(options.passProps || {}),
      },
      {
        label: 'Videos',
        title: 'Videos',
        screen: 'voke.Videos',
        icon: require('../images/video_icon.png'),
        // selectedIcon: require('../img/two_selected.png'),
        ...(options.passProps || {}),
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
      // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
      orientation: 'portrait',
      tabBarButtonColor: theme.primaryColor, // optional, change the color of the tab icons and text (also unselected)
      tabBarSelectedButtonColor: theme.textColor, // optional, change the color of the selected tab icon and text (only selected)
      tabBarBackgroundColor: theme.secondaryColor, // optional, change the background color of the tab bar
      bottomTabBadgeTextColor: theme.primaryColor, // Optional, change badge text color. Android only
      bottomTabBadgeBackgroundColor: COLORS.YELLOW, // Optional, change badge background color. Android only
      tabBarTranslucent: false,
      forceTitlesDisplay: true, // Android, only show title
      statusBarColor: theme.statusBarColor,
      ...(options.appStyle || {}),
    },
  });
}

export function startLoginApp(options = {}) {
  Navigation.startSingleScreenApp({
    // animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
    animationType: 'fade',
    ...options,
    appStyle: {
      // Apply to whole app, can't do single pages https://github.com/wix/react-native-navigation/issues/846
      orientation: 'portrait',
      statusBarColor: theme.statusBarColor,
      ...(options.appStyle || {}),
    },
    screen: loginScreen,
  });
}

export default class App {
  constructor() {
    // Need to load the store with redux-persist and then start the app when it's loaded
    this.store = getStore(() => {
      iconsLoaded.then(() => {
        // if (Platform.OS === 'android') {
        //   Promise.resolve(Navigation.isAppLaunched())
        //     .then((appLaunched) => {
        //       if (appLaunched) {
        //         this.startApp(); // App is launched -> show UI
        //       } else {
        //         new NativeEventsReceiver().appLaunched(() => {
        //           this.startApp();
        //         }); // App hasn't been launched yet -> show the UI only when needed.
        //       }
        //     });
        // } else {
        //   this.startApp();
        // }
        this.startApp();
      });
    });
    registerScreens(this.store, Provider);
    Analytics.setup();
    this.loadingState();
  }

  loadingState() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'voke.Loading',
      },
      appStyle: {
        screenBackgroundColor: theme.primaryColor,
      },
      navigatorStyle: {
        screenBackgroundColor: theme.primaryColor,
      },
      animationType: 'fade',
    });
  }

  startApp() {
    setTimeout(() => {
      if (!this.store.getState().auth.isLoggedIn) {
        startLoginApp();
      } else {
        startTabApp();
      }
    }, 1000)
  }
}
