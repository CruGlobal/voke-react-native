import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
import FAGlyphs from 'react-native-vector-icons/glyphmaps/FontAwesome.json';
import MaterialGlyphs from 'react-native-vector-icons/glyphmaps/MaterialIcons.json';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { vokeIcons } from '../../utils/iconMap';
import icoMoonConfig from '../../utils/selection.json';
const VokeIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'icoMoon',
  'icomoon.ttf',
);
import PLATFORM_MAP from './mapping';

const ICON_TYPES = ['Material', 'FontAwesome', 'Voke'];

export default class Icon extends Component {
  render() {
    const { name, type, size = 18, style = {} } = this.props;
    // Default style options
    let iconName = name;
    let iconType = type;

    // Get any platform specific icons
    if (PLATFORM_MAP[name] && PLATFORM_MAP[name][Platform.OS]) {
      iconName = PLATFORM_MAP[name][Platform.OS].name;
      iconType = PLATFORM_MAP[name][Platform.OS].type;
    }

    // Set the type of icon to be rendered
    let Tag;
    if (iconType === 'FontAwesome') Tag = FontAwesome;
    else if (iconType === 'Voke') Tag = VokeIcon;
    else Tag = Material;

    return <Tag name={iconName} style={[{ fontSize: size }, style]} />;
  }
}

Icon.propTypes = {
  name: PropTypes.oneOf([
    ...Object.keys(FAGlyphs),
    ...Object.keys(MaterialGlyphs),
    ...Object.keys(vokeIcons),
  ]).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  type: PropTypes.oneOf(ICON_TYPES),
  size: PropTypes.number,
};

Icon.defaultProps = {
  type: 'Material',
};
