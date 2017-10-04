import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import { COLORS } from '../../theme';

export default class MyRefreshControl extends Component {
  render() {
    return <RefreshControl {...this.props} />;
  }
}

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
MyRefreshControl.defaultProps = {
  progressBackgroundColor: COLORS.WHITE,
  colors: [COLORS.WHITE],
  tintColor: COLORS.WHITE,
};
