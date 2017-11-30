import React, { Component } from 'react';
// import { View, Text } from 'react-native';
import { Provider } from 'react-redux';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';
import Analytics from './utils/analytics';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';

// TODO: Add loading stuff with redux persist
class App extends Component {
  state = { store: null };

  componentDidMount() {
    Analytics.setup();
    getStore((store) => {
      this.setState({ store });
    });
  }

  render() {
    if (!this.state.store) {
      return <LoadingScreen />;
    }
    return (
      <Provider store={this.state.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default App;