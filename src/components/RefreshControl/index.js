import React from 'react';
import { RefreshControl } from 'react-native';
import { COLORS } from '../../theme';

export default function MyRefreshControl(props) {
  return (
    <RefreshControl
      progressBackgroundColor={COLORS.WHITE}
      colors={[COLORS.BLUE, COLORS.RED, COLORS.GREEN]}
      tintColor={COLORS.WHITE}
      title="Refreshing"
      titleColor={COLORS.WHITE}
      {...props}
    />
  );
}

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
