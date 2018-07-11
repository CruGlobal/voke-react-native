import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings,
} from 'react-native-google-analytics-bridge';
import Appsee from 'react-native-appsee';
import CONSTANTS from '../constants';

let tracker = null;

function setup() {
  // The tracker must be constructed, and you can have multiple:
  tracker = new GoogleAnalyticsTracker(CONSTANTS.GA_TRACKER);

  // Setting dryRun to true lets you test tracking without sending data to GA
  if (__DEV__) {
    GoogleAnalyticsSettings.setDryRun(true);
  } else {
    Appsee.start(CONSTANTS.APPSEE_KEY);
  }

  // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
  GoogleAnalyticsSettings.setDispatchInterval(30);
}

function screen(screen) {
  if (!screen || typeof screen !== 'string') {
    LOG('Screen must be passed in as a string');
    return;
  }
  if (tracker && tracker.trackScreenView) {
    tracker.trackScreenView(screen);
    // LOG('screen', screen);
    if (!__DEV__) {
      Appsee.startScreen(screen);
    }
  }
}

function event(category, action, label = '', value = -1) {
  // Setup the optional values as an object of {label: String, value: Number}
  let optionalValues = {};
  if (typeof label !== 'string') {
    label = '';
  }
  if (typeof value !== 'number') {
    value = -1;
  }
  if (label) {
    optionalValues.label = label;
  }
  if (value >= 0) {
    optionalValues.value = value;
  }

  if (!category || typeof category !== 'string') {
    LOG('Category must be passed in as a string');
    return;
  }
  if (!action || typeof action !== 'string') {
    LOG('Action must be passed in as a string');
    return;
  }
  tracker.trackEvent(category, action, optionalValues);
}

function setUser(id = '') {
  if (!id || typeof id !== 'string') {
    LOG('Analytics: id must be a string in setUser', id);
    return;
  }
  tracker.setUser(id);
}

const s = {
  About: 'About',
  Acknowledgements: 'Acknowledgements',
  AdventuresTab: 'AdventuresTab',
  ChallengeModal: 'ChallengeModal',
  ChannelsTab: 'ChannelsTab',
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
};

export default {
  setup,
  event,
  screen,
  setUser,
  s,
};
