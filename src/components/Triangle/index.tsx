import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Image from '../Image';
import st from '../../st';

type TriangleProps = {
  width: number,
  height: number,
  slant?: 'down' | null,
  flip?: boolean,
  color?: string,
  style?: StyleProp<ViewStyle>,
}
/**
 * Outputs custom decorative divider.
 * @param {number} width - Width of the divider.
 * @param {number} height - Height of the divider.
 * @param {string} slant - 'down' or empty.
 * @param {boolean} flip - true to flip.
 * @param {string} color - Color of the divider.
 * @param {object} style - Styles object.
 */
const Triangle = ({ width, height, slant, flip, color, style }:TriangleProps) => {
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
