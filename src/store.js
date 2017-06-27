import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import reducers from './reducers';

export default function getStore(onCompletion) {
  const store = createStore(
    reducers,
    applyMiddleware(thunk),
  );
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  return store;
}