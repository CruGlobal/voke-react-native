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

// TODO: Add loading stuff with redux persist
class App extends Component {
  state = { store: null };

  componentDidMount() {
    Analytics.setup();
    getStore(store => {
      this.setState({ store });
    });
  }

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
          </View>
        </I18nextProvider>
      </Provider>
    );
  }
}

export default App;
