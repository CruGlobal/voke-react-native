import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import theme from '../../theme';

class MyStatusBar extends Component {
  render() {
    return (
      <StatusBar
        backgroundColor={theme.headerBackgroundColor}
        barStyle="light-content"
        {...this.props}
      />
    );
  }
}

export default MyStatusBar;
