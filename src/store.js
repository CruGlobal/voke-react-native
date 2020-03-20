import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import { persistStore } from 'redux-persist';

const persistedReducer = createRootReducer();

const enhancers = [];
const middlewares = [thunk];
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const composedEnhancers = composeEnhancers(
  applyMiddleware(...middlewares),
  ...enhancers,
);

function configureStore(initialState) {
  const store = createStore(
    persistedReducer, // root reducer with router state
    initialState,
    composedEnhancers,
  );
  return { store, persistor: persistStore(store) };
}

export default configureStore;
