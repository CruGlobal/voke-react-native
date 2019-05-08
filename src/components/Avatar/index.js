import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles';
import { Image, Text, Flex } from '../common';

export default class Avatar extends Component {
  render() {
    const {
      present,
      text,
      image,
      size,
      style,
      avatarTextStyle,
      imageStyle,
      isVoke,
    } = this.props;
    let content = null;

    const sizeObj = { width: size, height: size, borderRadius: size / 2 };

    if (image) {
      content = (
        <Image
          resizeMode="cover"
          source={{ uri: image }}
          style={[imageStyle, sizeObj]}
        />
      );
    } else if (text) {
      content = <Text style={[styles.textStyle, avatarTextStyle]}>{text}</Text>;
    }

    return (
      <Flex
        style={[sizeObj, styles.avatar, style, isVoke ? styles.rotateVoke : '']}
        align="center"
        justify="center"
      >
        {content}
        {present ? <Flex style={styles.present} /> : null}
      </Flex>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Avatar.propTypes = {
  text: PropTypes.string,
  image: PropTypes.string,
  size: PropTypes.number,
  present: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  avatarTextStyle: PropTypes.oneOfType(styleTypes),
  imageStyle: PropTypes.oneOfType(styleTypes),
};
