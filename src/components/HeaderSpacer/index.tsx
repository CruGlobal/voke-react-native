import React, { ReactElement, useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';

// https://github.com/react-navigation/react-navigation/blob/a484c1d7834f195ac0cfccda6a9f905218bc2274/packages/stack/src/views/Header/HeaderSegment.tsx#L66
// Unlike function in the React Navigation,
// our implementation ignores statusBarHeight to make it compatible
// with SafeAreaView that we are using on every screen.
const getHeaderHeight = (windowWidth: number, windowHeight: number): number => {
  const isLandscape = windowWidth > windowHeight;
  let headerHeight;

  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      headerHeight = 32;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight;
};

function HeaderSpacer(): ReactElement {
  const { width, height } = Dimensions.get('window');
  const [headerHeight, setHeaderHeight] = useState(
    getHeaderHeight(width, height),
  );

  useEffect(() => {
    // Update header height if device orientation changes.
    setHeaderHeight(getHeaderHeight(width, height));
  }, [width, height]);

  return (
    <View
      style={{
        minHeight: headerHeight,
      }}
    />
  );
}

export default HeaderSpacer;
