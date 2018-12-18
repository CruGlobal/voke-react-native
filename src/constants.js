import theme from './theme';

export const LOGIN = 'app/LOGIN';
export const LOGOUT = 'app/LOGOUT';
export const SET_USER = 'app/SET_USER';
export const SET_ALL_CONTACTS = 'app/SET_ALL_CONTACTS';
export const SET_VOKE_CONTACTS = 'app/SET_VOKE_CONTACTS';
export const SET_CONTACTS_LOADING = 'app/SET_CONTACTS_LOADING';
export const NEW_MESSAGE = 'app/NEW_MESSAGE';
export const TYPE_STATE_CHANGE = 'app/TYPE_STATE_CHANGE';
export const MARK_READ = 'app/MARK_READ';
export const SET_PUSH_TOKEN = 'app/SET_PUSH_TOKEN';
export const UPDATE_TOKENS = 'app/UPDATE_TOKENS';
export const ACTIVE_SCREEN = 'app/ACTIVE_SCREEN';
export const NO_BACKGROUND_ACTION = 'app/NO_BACKGROUND_ACTION';
export const RESET_TOKEN = 'app/RESET_TOKEN';
export const SET_ACTIVE_CONVERSATION = 'app/SET_ACTIVE_CONVERSATION';
export const ONBOARD_FLAG = 'app/ONBOARD_FLAG';
export const SET_IN_SHARE = 'app/SET_IN_SHARE';
export const SHOW_SHARE_MODAL = 'app/SHOW_SHARE_MODAL';
export const PREVIEW_MESSAGE_CREATED = 'app/PREVIEW_MESSAGE_CREATED';
export const MESSAGE_CREATED = 'app/MESSAGE_CREATED';
export const CLEAR_CHANNEL_VIDEOS = 'app/CLEAR_CHANNEL_VIDEOS';
export const CREATE_ANON_USER = 'app/CREATE_ANON_USER';
export const RESET_ANON_USER = 'app/RESET_ANON_USER';
export const PUSH_PERMISSION = 'app/PUSH_PERMISSION';
export const SET_MESSAGE_MODAL = 'app/SET_MESSAGE_MODAL';
export const DONT_NAV_TO_VIDS = 'app/DONT_NAV_TO_VIDS';
// Overlays
export const CLEAR_OVERLAY = 'app/CLEAR_OVERLAY';
export const SET_OVERLAY = 'app/SET_OVERLAY';

export const IS_SMALL_ANDROID = theme.isAndroid && theme.fullHeight < 600;
// export const IS_SMALL_ANDROID = true;

const IS_STAGING = false;

const SALT_HASH_STAGING = 'nRgwCUrxKyWDytQDdfYpaJGrEjNQVUYHoDvHhtfgFvauvPrwIm';
const SALT_HASH_PROD = 'sKgbotdipkiaPVmtViOPhJJidXPXthowELRKwGNwhOMHnIclxj';

const CLIENT_ID_STAGING =
  'db6274e05ca47b4eee31b25525eae8a02a1b7e1f0c09f653352782fb8cefcaf4';
const CLIENT_ID_PROD =
  'a236be0f30998033b32664440e10a606775a77631609155870ddd9565eebdf14';

const CLIENT_SECRET_STAGING =
  'e0c2d30d486fa2254284d978d148036213ec41998b2aa6bcb9986b8833547a21';
const CLIENT_SECRET_PROD =
  '1254b13a5bd7e61346c28f7e59fe0b1caa87e4b75284dbbe1970dc4fd60b36f4';

const IOS_APP_ID = 'id1056168356';
const ANDROID_APP_ID = 'org.cru.voke';

export default {
  IS_STAGING,
  IS_ANDROID: theme.isAndroid,

  EMAIL_REGEX: new RegExp(/^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
  GA_TRACKER: 'UA-39188989-7', // Google Analytics
  APPSEE_KEY: 'f12ec0fba0e24c6e80fa2f8fcbf1eb04',

  FACEBOOK_VERSION: 'v2.8',
  FACEBOOK_FIELDS: 'name,email,picture,about,cover,first_name,last_name',
  FACEBOOK_SCOPE: ['public_profile', 'email'],
  // FACEBOOK_FIELDS: 'name,picture,about,cover,first_name,last_name',
  // FACEBOOK_SCOPE: ['public_profile'],

  PAGE_SIZE: 25, // This is the default page size from the API
  CONVERSATIONS_PAGE_SIZE: 12,

  CONTACT_CHUNKS: 500, // How many contacts to send up per upload request
  REFRESH_CONTACTS_TIME: 30 * 24 * 60 * 60 * 1000, // 5 days
  // // REFRESH_CONTACTS_TIME: 30 * 60 * 1000, // 30 minutes

  GCM_SENDER_ID: '360680446899',
  IOS_STORE_LINK: `itms://itunes.apple.com/us/app/apple-store/${IOS_APP_ID}`,
  ANDROID_STORE_LINK: `market://details?id=${ANDROID_APP_ID}`,

  CLIENT_ID: IS_STAGING ? CLIENT_ID_STAGING : CLIENT_ID_PROD,
  CLIENT_SECRET: IS_STAGING ? CLIENT_SECRET_STAGING : CLIENT_SECRET_PROD,
  SALT_HASH: IS_STAGING ? SALT_HASH_STAGING : SALT_HASH_PROD,

  // API_KEY: '69f02db1aff5035578e9',
  // FB_ID: '443564615845137',

  WEB_URLS: {
    INSTAGRAM: 'https://instagram.com/_u/vokeapp',
    VOKE: 'https://www.vokeapp.com',
    HELP: 'https://help.vokeapp.com/',
    FAQ: 'https://www.vokeapp.com/faq',
    TERMS: 'https://www.vokeapp.com/terms-in-app/',
    PRIVACY: 'https://www.vokeapp.com/privacy-in-app/',
    FACEBOOK: 'https://www.facebook.com/vokeapp/',
    // Acknowledgements
    CRASHLYTICS: 'https://try.crashlytics.com/',
    REACT_NATIVE: 'https://facebook.github.io/react-native/',
    REACT_NATIVE_ACTION_BUTTON:
      'https://github.com/mastermoo/react-native-action-button/blob/master/LICENSE',
    REACT_NATIVE_ANIMATABLE:
      'https://github.com/oblador/react-native-animatable/blob/master/LICENSE',
    REACT_NATIVE_COMMUNICATIONS:
      'https://github.com/anarchicknight/react-native-communications/blob/master/LICENSE',
    REACT_NATIVE_CONTACTS:
      'https://github.com/rt2zz/react-native-contacts/blob/master/LICENSE',
    REACT_NATIVE_DEVICE_INFO:
      'https://github.com/rebeccahughes/react-native-device-info/blob/master/LICENSE',
    REACT_NATIVE_FABRIC:
      'https://github.com/corymsmith/react-native-fabric/blob/master/LICENSE',
    REACT_NATIVE_FBSDK:
      'https://github.com/facebook/react-native-fbsdk/blob/master/LICENSE.txt',
    REACT_NATIVE_FETCH_BLOB:
      'https://github.com/wkh237/react-native-fetch-blob/blob/master/LICENSE',
    REACT_NATIVE_GOOGLE_ANALYTICS:
      'https://github.com/idehub/react-native-google-analytics-bridge/blob/master/LICENSE',
    REACT_NATIVE_IMAGE_CROP_PICKER:
      'https://github.com/ivpusic/react-native-image-crop-picker/blob/master/LICENSE',
    REACT_NATIVE_IMAGE_PICKER:
      'https://github.com/react-community/react-native-image-picker/blob/develop/LICENSE.md',
    REACT_NAVIGATION:
      'https://github.com/react-community/react-navigation/blob/master/LICENSE',
    REACT_NATIVE_PUSH_NOTIFICATIONS:
      'https://github.com/zo0r/react-native-push-notification/blob/master/LICENSE',
    REACT_NATIVE_SPINKIT:
      'https://github.com/maxs15/react-native-spinkit/blob/master/LICENSE',
    REACT_NATIVE_SWIPE_LIST_VIEW:
      'https://github.com/jemise111/react-native-swipe-list-view/blob/master/LICENSE',
    REACT_NATIVE_VECTOR_ICONS:
      'https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE',
    REACT_NATIVE_REDUX:
      'https://github.com/reactjs/react-redux/blob/master/LICENSE.md',
    REACT_NATIVE_VIEW_PAGER: 'https://github.com/zbtang/React-Native-ViewPager',
    FIREBASE: 'https://firebase.google.com/',
    REACT_NATIVE_FIREBASE: 'https://rnfirebase.io/',
  },
};
