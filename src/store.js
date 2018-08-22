import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import theme from './theme';
import reducers from './reducers';

let myCreateStore = createStore;

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const enhancers = [];
const middleware = [thunk, navMiddleware];

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const composedEnhancers = composeEnhancers(
  applyMiddleware(...middleware),
  ...enhancers,
);

export default function getStore(onCompletion) {
  const store = myCreateStore(reducers, {}, composedEnhancers);
  persistStore(
    store,
    {
      storage: theme.isAndroid ? FilesystemStorage : AsyncStorage,
    },
    () => {
      onCompletion(store);
    },
  );

  return store;
}
