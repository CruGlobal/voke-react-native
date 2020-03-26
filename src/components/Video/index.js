import React, { useState } from 'react';
import { View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import st from '../../st';
import ModalBackButton from '../ModalBackButton';
import { useMount } from '../../utils';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_LANDSCAPE_HEIGHT,
  VIDEO_LANDSCAPE_WIDTH,
} from '../../constants';

function Video({
  onOrientationChange,
  hideBack = false,
  blockRotation = false,
  ...rest
}) {
  const insets = useSafeArea();

  const [rotationLock, setRotationLock] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  });

  function getLandscapeOrPortrait(orientation) {
    if (orientation !== 'PORTRAIT' && orientation !== 'UNKNOWN') {
      return 'landscape';
    }
    return 'portrait';
  }

  useMount(() => {
    if (!blockRotation) {
      Orientation.unlockAllOrientations();
      var initial = Orientation.getInitialOrientation();
      onOrientationChange(getLandscapeOrPortrait(initial));
      Orientation.getAutoRotateState(rotationLock =>
        setRotationLock(rotationLock),
      );
      Orientation.addOrientationListener(handleOrientationChange);
    }
    return function cleanup() {
      if (!blockRotation) {
        Orientation.removeOrientationListener(handleOrientationChange);
        Orientation.lockToPortrait();
      }
    };
  });

  function handleOrientationChange(orientation) {
    if (rotationLock) {
      return;
    }
    if (orientation !== 'PORTRAIT' && orientation !== 'UNKNOWN') {
      setDimensions({
        width: VIDEO_LANDSCAPE_WIDTH,
        height: VIDEO_LANDSCAPE_HEIGHT,
      });
    } else {
      setDimensions({ width: VIDEO_WIDTH, height: VIDEO_HEIGHT });
    }
    onOrientationChange(getLandscapeOrPortrait(orientation));
  }

  return (
    <View
      style={[
        st.h(
          dimensions.height === VIDEO_HEIGHT
            ? dimensions.height + insets.top
            : dimensions.height,
        ),
        st.w(dimensions.width),
        st.bgBlack,
        { paddingTop: dimensions.height === VIDEO_HEIGHT ? insets.top : 0 },
      ]}
    >
      {hideBack ? null : (
        <View>
          <ModalBackButton />
        </View>
      )}
    </View>
  );
}

export default Video;
