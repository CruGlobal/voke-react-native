import React from 'react';

import { Text, Touchable } from '../../components/common';


// Coordinate helpers
const vCenter = (height, size) => height / 2 - size / 2;
const hCenter = (width, size) => width / 2 - size / 2;
const coord = (width, height, x, y, size) => ({
  top: vCenter(height, size) + y,
  left: hCenter(width, size) + x,
});

export default function AdventureMarker({
  width,
  height,
  x = 0,
  y = 0,
  size = 50,
  onPress,
  style,
  children,
}) {
  return (
    <Touchable
      isAndroidOpacity={true}
      onPress={onPress}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'green',
          borderRadius: size / 2,
        },
        style,
        {
          position: 'absolute',
          width: size,
          height: size,
          ...coord(width, height, x, y, size),
        },
      ]}>
      {
        children ? children : (
          <Text style={{ color: 'white', fontSize: 12 }}>
            {x},{y}
          </Text>
        )
      }
    </Touchable>
  );
}
