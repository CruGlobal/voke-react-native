import React, { Component } from 'react';
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
