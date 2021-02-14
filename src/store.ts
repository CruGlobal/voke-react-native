import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { Platform } from 'react-native';
import { REDUX_ACTIONS } from 'utils/constants';
import createRootReducer from 'reducers';

import { createWebSocketMiddleware } from './actions/socket';

const reduxLog = store => next => action => {
  // console.log( 'REDUX: ' + action?.description, action)
  return next(action);
};

const persistedReducer = createRootReducer();
const enhancers = [];
const middlewares = [thunk, reduxLog, createWebSocketMiddleware];
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const composedEnhancers = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers,
);

// Get store data from Persist Redux store V4
const getOldData = async () => {
  try {
    let oldData = {};
    let oldStore;

    if (Platform.OS === 'android') {
      // Need to check if key exists first. Otherwise get error: File not found.
      const allStoreKeys = await FilesystemStorage.getAllKeys();
      if (allStoreKeys.length && allStoreKeys.includes('reduxPersist:auth')) {
        oldStore = await FilesystemStorage.getItem('reduxPersist:auth');
      }
    } else {
      // In iOS we don't need to verify key existence.
      oldStore = await AsyncStorage.getItem('reduxPersist:auth');
    }
    if (oldStore) {
      oldData = JSON.parse(oldStore);
    }
    return oldData;
  } catch (error) {
    console.log('🛑 Persist migration error:', error);
  }
};

function configureStore(initialState) {
  const store = createStore(
    persistedReducer, // root reducer with router state
    initialState,
    composedEnhancers,
  );

  return {
    store,
    persistor: persistStore(store, null, async (fsError, fsResult) => {
      const oldStore = await getOldData();
      const auth = store.getState()?.auth;
      if (
        (!auth?.isLoggedIn || !auth?.user?.id) &&
        oldStore?.isLoggedIn &&
        oldStore?.user?.id
      ) {
        await store.dispatch({
          type: REDUX_ACTIONS.SET_USER,
          user: {
            id: oldStore?.user?.id,
            email: oldStore?.user?.email,
            first_name: oldStore?.user?.first_name,
            last_name: oldStore?.user?.last_name,
            access_token: {
              access_token: oldStore?.token,
            },
            language: {
              language_code: oldStore?.user?.language?.language_code,
            },
            avatar: oldStore?.user?.avatar,
            vokebot_conversation_id: oldStore?.user?.vokebot_conversation_id,
          },
        });
      }
    }),
  };
}

export default configureStore;
