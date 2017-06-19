import React from 'react';
import { Provider } from 'react-redux';

import getStore from './store';

import AppWithNavigationState from './NavConfig';

export default function() {
  const store = getStore();
  return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
  );
}