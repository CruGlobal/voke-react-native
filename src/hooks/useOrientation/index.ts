import { useState, useCallback, useLayoutEffect } from 'react';
import { Platform } from 'react-native';
import Orientation, { OrientationType } from 'react-native-orientation-locker';

type Orientations = 'portrait' | 'landscape';

const useOrientation = (): Orientations => {
  const [screenOrientation, setScreenOrientation] = useState<Orientations>(
    'portrait',
  );

  const getLandscapeOrPortrait = useCallback(
    (orientation: string): Orientations => {
      let newOrientation: Orientations = 'portrait';

      if (
        orientation === 'PORTRAIT' ||
        orientation === 'PORTRAIT-UPSIDEDOWN' // ot supported on iOS
      ) {
        newOrientation = 'portrait';
      } else if (
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT'
      ) {
        newOrientation = 'landscape';
      }

      return newOrientation;
    },
    [],
  );

  const handleOrientationChange = useCallback(
    (orientation: OrientationType): void => {
      setScreenOrientation(getLandscapeOrPortrait(orientation));
    },
    [getLandscapeOrPortrait],
  );

  useLayoutEffect(() => {
    // Only Device Orientation Listener works on older Android models.
    // Looks like fixed now and not needed anymore.
    // Orientation.addDeviceOrientationListener(handleOrientationChange);
    Orientation.addOrientationListener(handleOrientationChange);

    return function cleanup() {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, [handleOrientationChange]);

  return screenOrientation;
};

export default useOrientation;
