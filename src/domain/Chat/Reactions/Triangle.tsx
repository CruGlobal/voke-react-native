import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
  color?: string;
  rotate?: number;
  size?: number;
  style?: ViewStyle;
}

const Triangle = (props: Props): ReactElement => {
  const { color = '#fff', rotate = 0, size = 1, style = {} } = props;

  const chevronTriangle = {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderTopWidth: 5 * size,
    borderLeftWidth: 5 * size,
    borderColor: 'transparent',
    borderLeftColor: color,
  };

  return (
    <View
      style={[
        {
          width: 10 * size,
          height: 10 * size,
          transform: [{ rotate: `${rotate}deg` }],
        },
        style,
      ]}
    >
      <View
        style={[
          chevronTriangle,
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: [{ scale: -1 }],
          },
        ]}
      />
      <View
        style={[
          chevronTriangle,
          {
            position: 'absolute',
            bottom: 0,
            right: 0,
            transform: [{ scaleY: -1 }],
          },
        ]}
      />
    </View>
  );
};

export default Triangle;
