import React, { Component } from 'react';
import { StatusBar, Platform } from 'react-native';
import theme from '../../theme';

class MyStatusBar extends Component {
  render() {
    return (
      <StatusBar
        backgroundColor={theme.statusBarColor}
        barStyle={Platform.OS === 'android' ? undefined : 'light-content'}
        {...this.props}
      />
    );
  }
}

export default MyStatusBar;
