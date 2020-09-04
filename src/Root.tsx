// import React, { Component } from 'react';
import React, { Component, useState, useEffect } from 'react';
// import './wdyr'; // Why Did You Render? tool.
// import '@react-native-firebase/crashlytics';
// import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from '@sentry/react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { YellowBox, Platform } from 'react-native';
import LoadingRedux from './components/LoadingRedux';
import configureStore from './store';
import App from './App';
import ToastManager from './components/ToastManager';
import { registerLogs } from './utils';
import './i18n';
// import ModalHandler from './containers/ModalHandler';

const { store, persistor } = configureStore();
// While waiting for fix here: https://github.com/archriss/react-native-snap-carousel/issues/672
YellowBox.ignoreWarnings(['FlatList:', '']);
YellowBox.ignoreWarnings(['Require cycle:', 'Warning: componentWill']);

Sentry.init({
  dsn: 'https://401fa3e64ad84da38e311892898dd0ba@o430868.ingest.sentry.io/5380383',
  release: Platform.OS + ' ' + Platform.Version,
});

/* Sentry.configureScope(function(scope) {
  scope.setExtra("character.name", "Mighty Fighter");
}); */

const Root = () => {
  const [showLoader, setShowLoader] = useState( true );
  console.log( "🐸 showLoader:", showLoader );
  registerLogs();

  const onBeforeLift = () => {
    console.log( "🐸 onBeforeLift" );
    // crashlytics().recordError(37,"Test Error");
    // crashlytics().log('App mounted. 13:17');
    // crashlytics().setAttribute('test', '1317'),
    // crashlytics().sendUnsentReports();
    // crashlytics().recordError(new Error('Something Else!'));
    // console.log( "🐸 crashlytics:", crashlytics() );
    // console.log( crashlytics().recordError(new Error('I did a woopsie')) );
    // Add any actions here to run before the loading gate lifts...
    // Delay for at least one second to reduce loading gate flashing.
    setTimeout(() => {
      setShowLoader(false);
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
            <App />
          <ToastManager />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Root;
