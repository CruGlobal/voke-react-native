import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';

import getStore from './store';
import { Flex } from './components/common';

import AppWithNavigationState from './NavConfig';

class AppNav extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      store: getStore(() => this.setState({ isLoading: false })),
    };
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