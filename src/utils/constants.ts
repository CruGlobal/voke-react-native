import st from 'utils/st';

export const REDUX_ACTIONS: { [key: string]: string } = {
  REQUEST_FETCH: 'REQUEST_FETCH',
  REQUEST_FAIL: 'REQUEST_FAIL',
  REQUEST_SUCCESS: 'REQUEST_SUCCESS',
  LOADING_STATUS: 'LOADING_STATUS',
  INIT_LOADING_STATUS: 'INIT_LOADING_STATUS',

  STARTUP: 'STARTUP',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  SET_DATA: 'SET_DATA',

  SET_DEVICE: 'SET_DEVICE',
  OPEN_SOCKETS: 'OPEN_SOCKETS',

  SET_VIDEO_STATE: 'SET_VIDEO_STATE',
  SET_STARTUP_TIME: 'SET_STARTUP_TIME',

  START_ADVENTURE: 'START_ADVENTURE',
  UPDATE_INVITATIONS: 'UPDATE_INVITATIONS',
  UPDATE_ADVENTURE: 'UPDATE_ADVENTURE',
  UPDATE_ADVENTURES: 'UPDATE_ADVENTURES',
  SEND_ADVENTURE_INVITATION: 'SEND_ADVENTURE_INVITATION',
  RESEND_ADVENTURE_INVITATION: 'RESEND_ADVENTURE_INVITATION',
  UPDATE_ADVENTURE_INVITATION: 'UPDATE_ADVENTURE_INVITATION',
  GET_ADVENTURE_STEPS: 'GET_ADVENTURE_STEPS',
  UPDATE_ADVENTURE_STEP_MESSAGES: 'UPDATE_ADVENTURE_STEP_MESSAGES',
  UPDATE_ADVENTURE_UNREADS: 'UPDATE_ADVENTURE_UNREADS',
  CREATE_ADVENTURE_STEP_MESSAGE: 'CREATE_ADVENTURE_STEP_MESSAGE',
  UPDATE_ADVENTURE_STEP: 'UPDATE_ADVENTURE_STEP',
  UPDATE_ADVENTURE_STEPS: 'UPDATE_ADVENTURE_STEPS',
  UPDATE_VIDEO_PAGINATION: 'UPDATE_VIDEO_PAGINATION',
  MARK_READ: 'MARK_READ',
  UPDATE_UNREAD_TOTAL: 'UPDATE_UNREAD_TOTAL',

  CREATE_COMPLAIN: 'CREATE_COMPLAIN',
  SET_COMPLAIN: 'SET_COMPLAIN',
  CLEAR_COMPLAIN: 'CLEAR_COMPLAIN',
  BLOCK: 'BLOCK',

  RESET: 'RESET',
  CLEAR_TOAST: 'CLEAR_TOAST',
  SET_TOAST: 'SET_TOAST',
  SET_SCREEN: 'SET_SCREEN',
  PUSH_PERMISSION: 'PUSH_PERMISSION',
  SET_PUSH_TOKEN: 'SET_PUSH_TOKEN',
  SET_PUSH_DEVICE_ID: 'SET_PUSH_DEVICE_ID',
  SET_AUTH_DATA: 'SET_AUTH_DATA',
  UPDATE_NOTIFICATION_PAGINATION: 'UPDATE_NOTIFICATION_PAGINATION',
  UPDATE_NOTIFICATION_UNREAD_BADGE: 'UPDATE_NOTIFICATION_UNREAD_BADGE',
  TUTORIAL_COUNTDOWN_DUO: 'TUTORIAL_COUNTDOWN_DUO',
  TUTORIAL_COUNTDOWN_GROUP: 'TUTORIAL_COUNTDOWN_GROUP',
  SET_REMIND_TO_UPDATE: 'SET_REMIND_TO_UPDATE',
};
export const VIDEO_HEIGHT = st.fullWidth * (9 / 16);
export const VIDEO_LANDSCAPE_WIDTH = st.fullHeight;
export const VIDEO_LANDSCAPE_HEIGHT = st.fullWidth;

export const { isAndroid } = st;

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
const APP_URL = 'https://voke.page.link/app';

export const ANALYTICS_CONTEXT_CHANGED = 'app/ANALYTICS_CONTEXT_CHANGED';
export const ANALYTICS: { [key: string]: string } = {
  MCID: 'cru.mcid',
  SCREENNAME: 'cru.screenname',
  SITE_SECTION: 'cru.sitesection',
  SITE_SUBSECTION: 'cru.sitesubsection',
  SITE_SUB_SECTION_3: 'cru.subsectionlevel3',
  SITE_SUB_SECTION_4: 'cru.subsectionlevel4',
  CONTENT_AUDIENCE_TARGET: 'cru.contentaudiencetarget',
  CONTENT_TOPIC: 'cru.contenttopic',
  LOGGED_IN_STATUS: 'cru.loggedinstatus',
  SSO_GUID: 'cru.ssoguid',
  GR_MASTER_PERSON_ID: 'cru.grmasterpersonid',
  FACEBOOK_ID: 'cru.facebookid',
  CONTENT_LANGUAGE: 'cru.contentlanguage',
  LOGGED_IN: 'logged in',
  NOT_LOGGED_IN: 'not logged in',
};
export const ID_SCHEMA = 'iglu:org.cru/ids/jsonschema/1-0-3';
export const ACTIONS = {
  PERSON_ADDED: {
    name: 'Person Added',
    key: 'cru.personadded',
  },
  STATUS_CHANGED: {
    name: 'Contact Status Changed',
    key: 'cru.contactstatuschanged',
  },
  EMAIL_ENGAGED: {
    name: 'Contact Engaged by Email',
    key: 'cru.emailiconengaged',
  },
  CALL_ENGAGED: {
    name: 'Contact Engaged by Phone',
    key: 'cru.calliconengaged',
  },
  TEXT_ENGAGED: {
    name: 'Contact Engaged by Text',
    key: 'cru.texticonengaged',
  },
  FILTER_ENGAGED: {
    name: 'Search Filter Engaged',
    key: 'cru.searchfilterengaged',
  },
  SEARCH_FILTER: {
    key: 'cru.searchfilter',
  },
  USER_ERROR: {
    name: 'User Signin Error',
    key: 'cru.usersigninerror',
  },
  SYSTEM_ERROR: {
    name: 'System Signin Error',
    key: 'cru.systemsigninerror',
  },
  ONBOARDING_STARTED: {
    name: 'Onboarding Started',
    key: 'cru.onboardingstarted',
  },
  ONBOARDING_COMPLETE: {
    name: 'Onboarding Complete',
    key: 'cru.onboardingcomplete',
  },
  SELF_STAGE_SELECTED: {
    name: 'Self Stage Selected',
    key: 'cru.selfselectedstage',
  },
  PERSON_STAGE_SELECTED: {
    name: 'Person Stage Selected',
    key: 'cru.personselectedstage',
  },
  STAGE_SELECTED: {
    key: 'cru.stageselected',
  },
  STEP_DETAIL: {
    name: 'Step of Faith Detail',
    key: 'cru.stepoffaithdetail',
  },
  STEPS_ADDED: {
    name: 'Step of Faith Added',
    key: 'cru.stepoffaithadded',
  },
  STEP_CREATED: {
    name: 'Step of Faith Created',
    key: 'cru.stepoffaithcreated',
  },
  ALLOW: {
    name: 'Notification Permissions',
    key: 'cru.notificationsallowed',
  },
  NOT_NOW: {
    name: 'Notification Permissions',
    key: 'cru.notificationsnotallowed',
  },
  NO_REMINDERS: {
    name: 'Notification Reminders',
    key: 'cru.notoreminders',
  },
  STEP_PRIORITIZED: {
    name: 'Step Prioritized',
    key: 'cru.stepprioritized',
  },
  STEP_DEPRIORITIZED: {
    name: 'Step Deprioritized',
    key: 'cru.stepdeprioritized',
  },
  STEP_REMOVED: {
    name: 'Step Removed',
    key: 'cru.stepremoved',
  },
  STEP_COMPLETED: {
    name: 'Step Completed',
    key: 'cru.stepcompleted',
  },
  JOURNEY_EDITED: {
    name: 'Edit on Person Journey',
    key: 'cru.journeyedit',
  },
  INTERACTION: {
    name: 'Action Taken on Person',
    COMMENT: 'cru.commentadded',
    SOMETHING_COOL_HAPPENED: 'cru.somethingcoolhappenedadded',
    SPIRITUAL_CONVERSATION: 'cru.initiatinggospelconversations',
    GOSPEL_PRESENTATION: 'cru.presentingthegospel',
    PERSONAL_DECISION: 'cru.newprofessingbelievers',
    HOLY_SPIRIT_PRESENTATION: 'cru.presentingtheholyspirit',
    DISCIPLESHIP: 'cru.discipleshipconversation',
  },
  ITEM_LIKED: {
    name: 'Celebrate Item Liked',
    key: 'cru.celebrateitemliked',
  },
  ASSIGNED_TO_ME: {
    name: 'Assigned to Me',
    key: 'cru.assignedtome',
  },
  SELECT_COMMUNITY: {
    name: 'Community Selected',
    key: 'cru.selectcommunities',
  },
  SELECT_CREATED_COMMUNITY: {
    name: 'Community Selected After Create',
    key: 'cru.createcommunities',
  },
  SELECT_JOINED_COMMUNITY: {
    name: 'Community Selected After Join',
    key: 'cru.joincommunities',
  },
  SEARCH_COMMUNITY_WITH_CODE: {
    name: 'Search for Community With Code',
    key: 'cru.codesearch',
  },
  JOIN_COMMUNITY_WITH_CODE: {
    name: 'Join Community With Code',
    key: 'cru.codejoin',
  },
  ADD_COMMUNITY_PHOTO: {
    name: 'Add Photo for Community',
    key: 'cru.communityphoto',
  },
  CREATE_COMMUNITY: {
    name: 'Create Community',
    key: 'cru.communitycreate',
  },
  CHALLENGE_CREATED: {
    name: 'Challenge Created',
    key: 'cru.challengecreated',
  },
  CHALLENGE_JOINED: {
    name: 'Challenge Joined',
    key: 'cru.challengejoined',
  },
  CHALLENGE_COMPLETED: {
    name: 'Challenge Completed',
    key: 'cru.challengecompleted',
  },
  CHALLENGE_DETAIL: {
    name: 'Challenge Detail View',
    key: 'cru.challengedetail',
  },
  MANAGE_MAKE_ADMIN: {
    name: 'Make Admin',
    key: 'cru.membersmakeadmin',
  },
  MANAGE_MAKE_OWNER: {
    name: 'Make Owner',
    key: 'cru.membersmakeowner',
  },
  MANAGE_REMOVE_ADMIN: {
    name: 'Remove Admin',
    key: 'cru.membersremoveadmin',
  },
  MANAGE_REMOVE_MEMBER: {
    name: 'Remove Member',
    key: 'cru.membersremovemember',
  },
  MANAGE_LEAVE_COMMUNITY: {
    name: 'Leave Community',
    key: 'cru.membersleave',
  },
  COMMUNITY_EDIT: {
    name: 'Editting Community',
    key: 'cru.communityedit',
  },
  COPY_CODE: {
    name: 'Copy Community Code',
    key: 'cru.copycode',
  },
  COPY_INVITE_URL: {
    name: 'Copy Community Invite URL',
    key: 'cru.copyinviteurl',
  },
  NEW_CODE: {
    name: 'New Community Code',
    key: 'cru.newcode',
  },
  NEW_INVITE_URL: {
    name: 'New Community Invite URL',
    key: 'cru.newinviteurl',
  },
  COMMUNITY_DELETE: {
    name: 'Delete Community',
    key: 'cru.communitydelete',
  },
};

const CONSTANTS: { [key: string]: { [key: string]: string | number } | any } = {
  IS_STAGING,
  EMAIL_REGEX: new RegExp(/^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
  GA_TRACKER: 'UA-39188989-7', // Google Analytics
  // APPSEE_KEY: 'f12ec0fba0e24c6e80fa2f8fcbf1eb04',

  FACEBOOK_VERSION: 'v2.8',
  FACEBOOK_FIELDS: 'name,email,picture,about,cover,first_name,last_name',
  FACEBOOK_SCOPE: ['public_profile', 'email'], // FB data we want access to.
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
  APP_URL,

  CLIENT_ID: IS_STAGING ? CLIENT_ID_STAGING : CLIENT_ID_PROD,
  CLIENT_SECRET: IS_STAGING ? CLIENT_SECRET_STAGING : CLIENT_SECRET_PROD,
  SALT_HASH: IS_STAGING ? SALT_HASH_STAGING : SALT_HASH_PROD,

  // API_KEY: '69f02db1aff5035578e9',
  // FB_ID: '443564615845137',

  WEB_URLS: {
    INSTAGRAM: 'https://instagram.com/_u/vokeapp',
    VOKE: 'https://www.vokeapp.com',
    HELP: 'https://help.vokeapp.com/',
    FAQ: 'https://www.vokeapp.com/faq/',
    HELP_RESET_APPLEID:
      'https://help.vokeapp.com/search?collectionId=&query=reset+apple+id',
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

export default CONSTANTS;
