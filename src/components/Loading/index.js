import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';

import theme from '../../theme';

export default class Loading extends Component {
  render() {
    return (
      <ActivityIndicator
        color={theme.loadingColor}
        size="large"
        {...this.props}
      />
    );
  }
}
