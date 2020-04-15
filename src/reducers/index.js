import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import auth from './auth';
import data from './data';
import info from './info';

// Defines what data to store in the local storage.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const store = combineReducers({
  auth: persistReducer({ key: 'auth', storage: AsyncStorage }, auth),
  data,
  info,
});

const rootReducer = () => persistReducer(persistConfig, store);

export type RootState = ReturnType<typeof store>;

export default rootReducer;
