// import React, { Component } from 'react';
import React, { Component, useState, useEffect } from 'react';
import '@react-native-firebase/crashlytics';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { YellowBox } from 'react-native';
import LoadingRedux from './components/LoadingRedux';
import configureStore from './store';
import App from './App';
import ToastManager from './components/ToastManager';
import { registerLogs } from './utils';
import './actions/AppStateActions';
// import ModalHandler from './containers/ModalHandler';

const { store, persistor } = configureStore();
// While waiting for fix here: https://github.com/archriss/react-native-snap-carousel/issues/672
YellowBox.ignoreWarnings(['FlatList:', '']);
YellowBox.ignoreWarnings(['Require cycle:', 'Warning: componentWill']);


const Root = () => {
  const [showLoader, setShowLoader] = useState( true );
  registerLogs();
  const onBeforeLift = () => {
    // Add any actions here to run before the loading gate lifts...
    // Delay for at least one second to reduce loading gate flashing.
    setTimeout(() => {
      setShowLoader( false );
    }, 1000);
  }

  return(
    <SafeAreaProvider>
      <Provider store={store}>
        {/* Delay the rendering of UI until the persisted state
            has been retrieved and saved to redux */}
        <PersistGate
          // loading={<LoadingRedux />}
          persistor={persistor} onBeforeLift={onBeforeLift}>
            { showLoader ? <LoadingRedux /> :  <App />}
          <ToastManager />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Root;
