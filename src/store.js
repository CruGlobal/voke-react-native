import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {createWebSocketMiddleware} from './actions/socket';
import createRootReducer from './reducers';
import { persistStore, getStoredState } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { REDUX_ACTIONS } from './constants';

const reduxLog = store => next => action => {
  // console.log( 'REDUX: ' + action?.description, action)
  return next(action)
}

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
const getOldData = async() => {
    try {
      const oldStore = await AsyncStorage.getItem('reduxPersist:auth'); // Android
      let oldData = {};
      if (oldStore) {
        oldData = JSON.parse(oldStore);
      }
      return oldData;
    } catch (error) {
      console.log( "🛑 Persist migration error:", error );
    }
}

function configureStore(initialState) {
  const store = createStore(
    persistedReducer, // root reducer with router state
    initialState,
    composedEnhancers,
  );

  return { store, persistor: persistStore(
    store,
    null,
    async (fsError, fsResult) => {
      const oldStore = await getOldData();
      const auth = store.getState()?.auth;
      if ((!auth?.isLoggedIn || !auth?.user?.id) &&
        oldStore?.isLoggedIn &&
        oldStore?.user?.id ) {
        await store.dispatch({
          type: REDUX_ACTIONS.SET_USER,
          user: {
            id: oldStore?.user?.id,
            email: oldStore?.user?.email,
            first_name: oldStore?.user?.first_name,
            last_name: oldStore?.user?.last_name,
            access_token: {
              access_token:  oldStore?.token,
            },
            language: {
              language_code: oldStore?.user?.language?.language_code,
            },
            avatar: oldStore?.user?.avatar,
            vokebot_conversation_id: oldStore?.user?.vokebot_conversation_id,
          },
        });
      }
      /* if ( oldStore?.token && oldStore?.user?.id && store.getState() ) {

      } */
    }
    ) };
}

export default configureStore;
