import React from 'react';
import { vokeImages, vokeIcons } from '../../utils/iconMap';
import Image from '../Image';
import st from '../../st';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../utils/selection.json';
const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'icoMoon',
  'icomoon.ttf',
);

function VokeIcon({ name, type, style, ...rest }) {
  if (type === 'image' && !vokeImages[name]) return null;
  if (type === 'image') {
    return (
      <Image
        resizeMode="contain"
        {...rest}
        style={style}
        source={vokeImages[name]}
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
