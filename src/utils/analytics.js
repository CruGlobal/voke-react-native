// import {
//   GoogleAnalyticsTracker,
//   GoogleAnalyticsSettings,
// } from 'react-native-google-analytics-bridge';
import Firebase from 'react-native-firebase';
// import Appsee from 'react-native-appsee';
import CONSTANTS from '../constants';

// let tracker = null;

function setup() {
  // The tracker must be constructed, and you can have multiple:
  // tracker = new GoogleAnalyticsTracker(CONSTANTS.GA_TRACKER);

  // Setting dryRun to true lets you test tracking without sending data to GA
  if (__DEV__) {
    Firebase.analytics().setAnalyticsCollectionEnabled(true);
    // GoogleAnalyticsSettings.setDryRun(true);
  } else {
    Firebase.analytics().setAnalyticsCollectionEnabled(true);
    // Appsee.start(CONSTANTS.APPSEE_KEY);
  }

  // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
  // GoogleAnalyticsSettings.setDispatchInterval(30);
}

function screen(screen) {
  if (!screen || typeof screen !== 'string') {
    LOG('Screen must be passed in as a string');
    return;
  }
  // if (tracker && tracker.trackScreenView) {
  //   tracker.trackScreenView(screen);
  //   // LOG('screen', screen);
  //   if (!__DEV__) {
  //     Appsee.startScreen(screen);
  //   }
  // }
  Firebase.analytics().setCurrentScreen(screen);
  if (!__DEV__) {
    // Appsee.startScreen(screen);
  }
}

function event(event, params = {}) {
  // Setup the optional values as an object of {label: String, value: Number}
  if (!event || typeof event !== 'string') {
    LOG('Event must be passed in as a string');
    return;
  }
  // tracker.trackEvent(category, action, optionalValues);
  Firebase.analytics().trackEvent(event, params);
}

function setUser(id = '') {
  if (!id || typeof id !== 'string') {
    LOG('Analytics: id must be a string in setUser', id);
    return;
  }
  // tracker.setUser(id);
  Firebase.analytics().setUserId(id);
}

function markSensitive(view) {
  if (!view) {
    // LOG('Analytics: no view passed in', view);
    return;
  }
  // tracker.setUser(id);
  // Appsee.markViewAsSensitive(view);
}

const s = {
  About: 'About',
  Acknowledgements: 'Acknowledgements',
  AdventuresTab: 'AdventuresTab',
  AdventuresTabMine: 'AdventuresTabMine',
  AdventuresTabFind: 'AdventuresTabFind',
  ChallengeModal: 'ChallengeModal',
  ChannelsTab: 'ChannelsTab',
  ChannelsPage: 'ChannelsPage',
  Contacts: 'Contacts',
  CountrySelect: 'CountrySelect',
  ForgotPassword: 'ForgotPassword',
  Help: 'Help',
  ChatKickstarters: 'ChatKickstarters',
  ChatTab: 'ChatTab',
  Login: 'Login',
  Menu: 'Menu',
  Chat: 'Chat',
  ContactPermissionModal: 'ContactPermissionModal',
  Profile: 'Profile',
  SelectFriend: 'SelectFriend',
  ShareName: 'ShareName',
  ShareModal: 'ShareModal',
  CreateAccount: 'CreateAccount',
  CreateFacebookAccount: 'CreateFacebookAccount',
  SignUpNumber: 'SignUpNumber',
  SignUpNumberVerify: 'SignUpNumberVerify',
  SignUpProfile: 'SignUpProfile',
  Welcome: 'Welcome',
  ThemeSelect: 'ThemeSelect',
  TryItName: 'TryItName',
  VideoDetails: 'VideoDetails',
  VideosTab: 'VideosTab',
  VideosMessage: 'VideosMessage',
};

export default {
  setup,
  event,
  screen,
  setUser,
  s,
  markSensitive,
};
