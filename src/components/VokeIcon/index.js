import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

// See this file for the names of all the voke icons
import { vokeIcons } from '../../utils/iconMap';

export default class Icon extends Component {
  render() {
    const { name, ...rest } = this.props;
    if (!vokeIcons[name]) return null;
    return <Image resizeMode="contain" {...rest} source={vokeIcons[name]} />;
  }
}

Icon.propTypes = {
  name: PropTypes.oneOf([...Object.keys(vokeIcons)]).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};
