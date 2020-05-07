import React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { StyleProp, ImageStyle } from 'react-native';
import { vokeImages } from '../../utils/iconMap';
import icoMoonConfig from '../../utils/selection.json';
import Image from '../Image';
import st from '../../st';

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'icoMoon',
  'icomoon.ttf',
);

type VokeIconProps = {
  name: string;
  type: string;
  style: StyleProp<ImageStyle>;
  [x: string]: any; // ..rest
}

const VokeIcon = ({ name, type, style, ...rest }: VokeIconProps) => {
  if (type === 'image' && !vokeImages[name]) return null;
  if (type === 'image') {
    return (
      <Image
        resizeMode="contain"
        style={style}
        source={vokeImages[name]}
        {...rest}
      />
    );
  } else {
    return (
      <CustomIcon
        name={name}
        style={[{ color: st.colors.white }, style]}
        {...rest}
      />
    );
  }
}

export default VokeIcon;