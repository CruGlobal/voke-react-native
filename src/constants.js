
export const LOGIN = 'app/LOGIN';
export const LOGOUT = 'app/LOGOUT';
export const SET_USER = 'app/SET_USER';
export const SET_ALL_CONTACTS = 'app/SET_ALL_CONTACTS';
export const SET_VOKE_CONTACTS = 'app/SET_VOKE_CONTACTS';
export const NEW_MESSAGE = 'app/NEW_MESSAGE';
export const TYPE_STATE_CHANGE = 'app/TYPE_STATE_CHANGE';
export const MARK_READ = 'app/MARK_READ';
export const SET_PUSH_TOKEN = 'app/SET_PUSH_TOKEN';

// TODO: Check this in a better way
const isStaging = true;


const SALT_HASH_STAGING = 'nRgwCUrxKyWDytQDdfYpaJGrEjNQVUYHoDvHhtfgFvauvPrwIm';
const SALT_HASH_PROD = 'OoyGkKqLaEYOxXnxJHoLRAqcJsDKVVSInMtvPkyKVgrfmVzMmy';

const IOS_APP_ID = 'id1056168356';
const ANDROID_APP_ID = 'org.cru.voke';

export default {
  GCM_SENDER_ID: '360680446899',
  CONTACT_CHUNKS: 500,
  IOS_STORE_LINK: `itms://itunes.apple.com/us/app/apple-store/${IOS_APP_ID}`,
  ANDROID_STORE_LINK: `market://details?id=${ANDROID_APP_ID}`,
  // These are from voke_web
  CLIENT_ID: 'db6274e05ca47b4eee31b25525eae8a02a1b7e1f0c09f653352782fb8cefcaf4',
  CLIENT_SECRET: 'e0c2d30d486fa2254284d978d148036213ec41998b2aa6bcb9986b8833547a21',
  SALT_HASH: isStaging ? SALT_HASH_STAGING : SALT_HASH_PROD,
  // API_KEY: '69f02db1aff5035578e9',
  // FB_ID: '443564615845137',
  // SUBSCRIBE_KEY: 'sub-c-399d3af6-0e44-11e5-a3e7-02ee2ddab7fe',

  // These are from the documentation website
  // CLIENT_ID: '8b54cc4b3fa887919f290502563d7a70b8d3cd8ad33a148d650b072d1a9b1cd7',
  // CLIENT_SECRET: '3e9ab9085e3f42c3d160c2da35be9693f801571d3624634ecfe1bda745a376bb',
};
