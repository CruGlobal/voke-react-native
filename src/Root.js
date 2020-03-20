import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingRedux from './components/LoadingRedux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import configureStore from './store';
import { YellowBox } from 'react-native';
// import ModalHandler from './containers/ModalHandler';

const { store, persistor } = configureStore();
YellowBox.ignoreWarnings(['Require cycle:', 'Warning: componentWill']);

export default class Root extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingRedux />} persistor={persistor}>
            <App />
            {/* <ModalHandler /> */}
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
