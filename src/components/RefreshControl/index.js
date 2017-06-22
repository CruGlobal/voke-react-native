import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import { COLORS } from '../../theme';

export default class MyRefreshControl extends Component {
  render() {
    return (
      <RefreshControl
        progressBackgroundColor={COLORS.WHITE}
        colors={[COLORS.DARK_BLUE, COLORS.BLUE]}
        tintColor={COLORS.WHITE}
        title="Refreshing"
        titleColor={COLORS.WHITE}
        {...this.props}
      />
    );
  }
}

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
