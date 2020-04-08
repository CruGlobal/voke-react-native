import { combineReducers } from 'redux';
import auth from './auth';
import data from './data';
import info from './info';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

// Defines what data to store in the local storage.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const rootReducer = () =>
  persistReducer(
    persistConfig,
    combineReducers({
      auth: persistReducer({ key: 'auth', storage: AsyncStorage }, auth),
      data,
      info,
    }),
  );

export default rootReducer;
