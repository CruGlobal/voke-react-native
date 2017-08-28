import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import styles from './styles';

import { Text, Flex } from '../common';

export default class Avatar extends Component {

  render() {
    const { text, image, size, style = {}, avatarTextStyle = {}, imageStyle = {}, ...rest } = this.props;
    let content = null;

    if (image) {
      content = (
        <Image resizeMode="cover" source={{uri: image}} style={[imageStyle, {width: size, height: size, borderRadius: size/2}]} />
      );
    } else if (text) {
      content = (
        <Text style={[styles.textStyle, avatarTextStyle]}>
          {text}
        </Text>
      );
    }

    return (
      <Flex style={[{width: size, height: size, borderRadius: size/2}, styles.avatar, style]} align="center" justify="center">
        {content}
      </Flex>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Avatar.propTypes = {
  text: PropTypes.string,
  image: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.oneOfType(styleTypes),
  avatarTextStyle: PropTypes.oneOfType(styleTypes),
  imageStyle: PropTypes.oneOfType(styleTypes),
};
