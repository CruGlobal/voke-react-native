import React, { Component } from 'react';
import PropTypes from 'prop-types';

// See this file for the names of all the voke icons
import { vokeImages, vokeIcons } from '../../utils/iconMap';
import { Image, Icon } from '../common';
import theme from '../../theme';

export default class VokeIcon extends Component {
  render() {
    const { name, type, style, ...rest } = this.props;
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
        <Icon
          name={name}
          type="Voke"
          {...rest}
          style={[{ color: theme.white }, style]}
        />
      );
    }
  }
}

VokeIcon.propTypes = {
  name: PropTypes.oneOf([...Object.keys(vokeImages), ...Object.keys(vokeIcons)])
    .isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};
