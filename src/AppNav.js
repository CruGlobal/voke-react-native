import React, { Component } from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { Provider } from 'react-redux';

import getStore from './store';
import { Flex } from './components/common';
import { backAction } from './actions/navigation';

import AppWithNavigationState from './NavConfig';

class AppNav extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      store: getStore(() => this.setState({ isLoading: false })),
    };

    this.backHandler = this.backHandler.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler() {
    const store = this.state.store;
    const { navigation } = store.getState();

    if (navigation && navigation.routes && navigation.routes.length <= 1) {
      return false;
    }
    store.dispatch(backAction());
    return true;
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Flex value={1} justify="center" align="center">
          <ActivityIndicator size="large" />
        </Flex>
      );
    }
    return (
      <Provider store={this.state.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default AppNav;