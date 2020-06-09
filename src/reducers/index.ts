import { combineReducers } from 'redux';
import { createMigrate, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import auth from './auth';
import data from './data';
import info from './info';

// Migrate critical state data from old version of the store.
const migrations = {
  // version number...
  2: (state) => {
    console.log( "🐸 migrations:", state );
    // migration to keep only user state
    return {
      user: {
        ...state.user
      }
    }
  }
}

// Defines what data to store in the local storage.
const persistConfig = {
  key: 'root',
  version: 2,
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const store = combineReducers({
  auth: persistReducer({
    key: 'auth',
    version: 2,
    storage: AsyncStorage,
    migrate: createMigrate(migrations, { debug: true }),
  }, auth),
  data,
  info,
});

const rootReducer = () => persistReducer(persistConfig, store);

export type RootState = ReturnType<typeof store>;
export default rootReducer;
