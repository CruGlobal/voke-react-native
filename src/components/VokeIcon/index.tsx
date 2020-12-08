import React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { StyleProp, ImageStyle, TextStyle } from 'react-native';
import icoMoonConfig from 'utils/selection.json';

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'icoMoon',
  'icomoon.ttf',
);

type VokeIconProps = {
  name: string;
  type?: string;
  style: StyleProp<ImageStyle | TextStyle>;
  [x: string]: any; // ..rest
};

const VokeIcon = ({ name, type, style, ...rest }: VokeIconProps) => {
  return <CustomIcon name={name} style={style} {...rest} />;
};

export default React.memo(VokeIcon);
