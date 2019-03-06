import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

// See this file for the names of all the voke icons
import { vokeImages, vokeIcons } from '../../utils/iconMap';
import { Icon } from '../common';

export default class VokeIcon extends Component {
  render() {
    const { name, type, ...rest } = this.props;
    if (type === 'image' && !vokeImages[name]) return null;
    if (type === 'image') {
      return <Image resizeMode="contain" {...rest} source={vokeImages[name]} />;
    } else {
      return (
        <Icon name={name} type="Voke" style={{ color: 'white' }} {...rest} />
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
