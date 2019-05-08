import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import './utils/globals';
import Analytics from './utils/analytics';
import i18n from './i18n';

import LoadingScreen from './containers/LoadingScreen';
import VokeOverlays from './containers/VokeOverlays';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';
import st from './st';
import ToastManager from './containers/ToastManager';
console.disableYellowBox = true;

class App extends Component {
  state = { store: null };

  componentDidMount() {
    this.initializeErrorHandling();
    Analytics.setup();
    getStore(store => {
      this.setState({ store });
    });
  }

  initializeErrorHandling() {
    // Handle all unhandled promise rejections
    window.onunhandledrejection = ({ reason }) => {
      this.handleError(reason);
    };

    // This is a global react-native utility
    ErrorUtils.setGlobalHandler(this.handleError);
  }

  handleError = e => {
    // TODO: log error to crashlytics
    // const { apiError } = e;

    // if (apiError) {
    //   if (
    //     apiError.errors &&
    //     apiError.errors[0] &&
    //     apiError.errors[0].detail &&
    //     (apiError.errors[0].detail === EXPIRED_ACCESS_TOKEN ||
    //       apiError.errors[0].detail === INVALID_ACCESS_TOKEN)
    //   ) {
    //     return;
    //   } else if (apiError.error === INVALID_GRANT) {
    //     return;
    //   } else if (apiError.message === NETWORK_REQUEST_FAILED) {
    //     this.showOfflineAlert();
    //     return;
    //   } else {
    //     rollbar.error(
    //       Error(
    //         `API Error: ${e.key} ${e.method.toUpperCase()} ${
    //           e.endpoint
    //         }\n\nQuery Params:\n${JSON.stringify(
    //           e.query,
    //           null,
    //           2,
    //         )}\n\nResponse:\n${JSON.stringify(e.apiError, null, 2)}`,
    //       ),
    //     );
    //   }
    // } else if (e instanceof Error) {
    //   rollbar.error(e);
    // } else {
    //   rollbar.error(Error(`Unknown Error:\n${JSON.stringify(e, null, 2)}`));
    // }

    LOG(e);
  };

  render() {
    if (!this.state.store) {
      return <LoadingScreen />;
    }
    return (
      <Provider store={this.state.store}>
        <I18nextProvider i18n={i18n}>
          <View style={[st.f1]}>
            <AppWithNavigationState />
            <VokeOverlays />
            <ToastManager />
          </View>
        </I18nextProvider>
      </Provider>
    );
  }
}

export default App;
