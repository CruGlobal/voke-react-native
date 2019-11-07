import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles';
import { Image, Text, Flex } from '../common';

export default function Avatar({
  present,
  text,
  image,
  size,
  style,
  avatarTextStyle,
  imageStyle,
  isVoke,
  isLocal,
}) {
  let content = null;

  const sizeObj = { width: size, height: size, borderRadius: size / 2 };

  if (!image && !text) return null;

  if (image) {
    if (isLocal) {
      content = (
        <Image
          resizeMode="cover"
          source={image}
          style={[imageStyle, sizeObj, isVoke ? styles.rotateVoke : '']}
        />
      );
    } else {
      content = (
        <Image
          resizeMode="cover"
          source={{ uri: image }}
          style={[imageStyle, sizeObj, isVoke ? styles.rotateVoke : '']}
        />
      );
    }
  } else if (text) {
    content = <Text style={[styles.textStyle, avatarTextStyle]}>{text}</Text>;
  }

  return (
    <Flex
      style={[sizeObj, styles.avatar, style]}
      align="center"
      justify="center"
    >
      {content}
      {present ? <Flex style={styles.present} /> : null}
    </Flex>
  );
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Avatar.propTypes = {
  text: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.number,
  present: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  avatarTextStyle: PropTypes.oneOfType(styleTypes),
  imageStyle: PropTypes.oneOfType(styleTypes),
};
