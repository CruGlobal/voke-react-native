import React, { PropTypes } from 'react';
import { Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAGlyphs from 'react-native-vector-icons/glyphmaps/FontAwesome.json';
import MaterialGlyphs from 'react-native-vector-icons/glyphmaps/MaterialIcons.json';
import IoniconsGlyphs from 'react-native-vector-icons/glyphmaps/Ionicons.json';

import styles from './styles';

const ICON_TYPES = ['Material', 'FontAwesome', 'Ionicons'];

// Pick different icons based on the platform
const PLATFORM_ICONS = {
  'arrow-back': {
    android: { type: 'Material', name: 'arrow-back' },
    ios: { type: 'Ionicons', name: 'ios-arrow-back' },
  },
  'arrow-right': {
    android: { type: 'Material', name: 'keyboard-arrow-right' },
    ios: { type: 'Ionicons', name: 'ios-arrow-forward' },
  },
  search: {
    android: { type: 'Material', name: 'search' },
    ios: { type: 'Ionicons', name: 'ios-search' },
  },
};

export default function Icon({ name, type, size = 18, style = {} }) {
  // Default style options
  let iconName = name;
  let iconType = type;

  // Get any platform specific icons
  if (PLATFORM_ICONS[name] && PLATFORM_ICONS[name][Platform.OS]) {
    iconName = PLATFORM_ICONS[name][Platform.OS].name;
    iconType = PLATFORM_ICONS[name][Platform.OS].type;
  }

  // Set the type of icon to be rendered
  let Tag;
  if (iconType === 'FontAwesome') Tag = FontAwesome;
  else if (iconType === 'Ionicons') Tag = Ionicons;
  else Tag = Material;

  return (
    <Tag name={iconName} style={[styles.icon, { fontSize: size }, style]} />
  );
}

Icon.propTypes = {
  name: PropTypes.oneOf([
    ...Object.keys(FAGlyphs),
    ...Object.keys(MaterialGlyphs),
    ...Object.keys(IoniconsGlyphs),
  ]).isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  type: PropTypes.oneOf(ICON_TYPES),
  size: PropTypes.number,
};

Icon.defaultProps = {
  type: 'Material',
};
