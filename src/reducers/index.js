import { combineReducers } from 'redux';
import auth from './auth';
import player from './player';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

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
      player,
    }),
  );

export default rootReducer;
