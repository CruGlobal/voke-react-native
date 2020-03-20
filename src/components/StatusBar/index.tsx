import React from 'react';
import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';

const StatusBar = (props: StatusBarProps) => {
  return <RNStatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} {...props} />;
};

StatusBar.displayName = 'StatusBar';
export default StatusBar;
