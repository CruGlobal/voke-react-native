import { combineReducers } from 'redux';
import { createMigrate, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { Platform } from 'react-native';
import auth from './auth';
import data from './data';
import info from './info';

// Migrate critical state data from old version of the store.
/* const migrations = {
  // version number...
  3: async (state) => {
    const oldStore = await getOldData();
    // Migration to keep only user-related data.
    return {
      isLoggedIn: oldStore?.isLoggedIn,
      authToken: oldStore?.token,
      pushToken: oldStore?.pushToken,
      pushDeviceId: oldStore?.pushId,
      user: oldStore?.user,
    }
  }
} */

// Defines what data to store in the local storage.
const persistConfig = {
  key: 'root',
  version: 2,
  storage:
    // Platform.OS === 'android' ?
    // FilesystemStorage : // Android
    AsyncStorage, // iOS
  blacklist: ['auth'],
  // blacklist: ['auth', 'data'],

  // Getting error redux-persist: rehydrate for "root" called after timeout?
  // https://github.com/rt2zz/redux-persist/issues/717#issuecomment-375011049
  // 👇 https://github.com/rt2zz/redux-persist/issues/906
  // keyPrefix: '',
  // timeout: null,
  // timeout: 0,
  // debug: true,
};

const store = combineReducers({
  auth: persistReducer({
    key: 'auth',
    version: 3,
    storage: AsyncStorage,
    // migrate: createMigrate(migrations, { debug: true }),
  }, auth),
  data,
  info,
});

const rootReducer = () => persistReducer(persistConfig, store);

export type RootState = ReturnType<typeof store>;
export default rootReducer;
