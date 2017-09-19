import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import reducers from './reducers';

let myCreateStore = createStore;

// Setup reactotron for development builds
if (__DEV__) {
  const Reactotron = require('reactotron-react-native').default;
  myCreateStore = Reactotron.createStore;
}

export default function getStore(onCompletion) {
  const store = myCreateStore(
    reducers,
    applyMiddleware(thunk),
  );
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  return store;
}