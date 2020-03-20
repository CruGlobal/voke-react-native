import React from 'react';
import { View } from 'react-native';
import Image from '../Image';
import st from '../../st';

function Triangle({ width, height, slant, flip, color, style }) {
  if (!height || !width) return;
  let customStyles;

  if (slant === 'down') {
    if (flip) {
      customStyles = {
        borderLeftWidth: width,
        borderRightWidth: width,
        borderBottomWidth: 0,
        borderTopWidth: height,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      };
    } else {
      // todo
    }
  } else {
    if (flip) {
      //todo
    } else {
      customStyles = {
        borderLeftWidth: width,
        borderRightWidth: width,
        borderBottomWidth: height,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      };
    }
  }
  return (
    <View
      style={[
        customStyles,
        {
          width: 0,
          height: 0,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
        },
        style,
      ]}
    />
  );
}

export default Triangle;
