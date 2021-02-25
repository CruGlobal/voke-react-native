import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { YellowBox } from 'react-native';
import { registerLogs } from 'utils';

import configureStore from './store';
import App from './App';
import ToastManager from './components/ToastManager';
import './i18n';

const { store, persistor } = configureStore();
// While waiting for fix here: https://github.com/archriss/react-native-snap-carousel/issues/672
YellowBox.ignoreWarnings(['FlatList:', '']);
YellowBox.ignoreWarnings(['Require cycle:', 'Warning: componentWill']);

const Root = () => {
  registerLogs();

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/* Delay the rendering of UI until the persisted state
            has been retrieved and saved to redux */}
        <PersistGate persistor={persistor}>
          <App />
          <ToastManager />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Root;
