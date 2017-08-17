import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import Spinner from 'react-native-spinkit';

import theme from '../../theme';

export default class Loading extends Component {
  render() {
    return (
      <Spinner
        color={theme.loadingColor}
        size={40}
        type="Bounce"
        {...this.props}
      />
    );
  }
}
