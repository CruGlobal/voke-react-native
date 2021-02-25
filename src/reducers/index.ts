import { Action, AnyAction, combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import auth from './auth';
import { data } from './data';
import { info } from './info';

// Defines what data to store in the local storage.
const persistConfig = {
  key: 'root',
  version: 2,
  storage: AsyncStorage,
  blacklist: ['auth'],
};

const store = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      version: 3,
      storage: AsyncStorage,
    },
    auth,
  ),
  data,
  info,
});

const rootReducer = () => persistReducer(persistConfig, store);

export type RootState = ReturnType<typeof store>;

// Extra typing for redux-thunk:
// https://github.com/reduxjs/redux-thunk/issues/231#issuecomment-528028398

export type AsyncAction<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  null,
  Action
>;
export type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<
  RootState,
  null,
  T
>;
export const useSelectorTs: TypedUseSelectorHook<RootState> = useSelector;
export const useDispatchTs: () => DispatchAction = useDispatch;

export default rootReducer;
