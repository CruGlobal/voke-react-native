import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import { COLORS } from '../../theme';

import styles from './styles';

import { Text, Flex } from '../common';

export default class Avatar extends Component {

  render() {
    const { present, text, image, size, style = {}, avatarTextStyle = {}, imageStyle = {}, ...rest } = this.props;
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
        {
          present ? (
            <Flex style={{width: 8, height: 8, backgroundColor: COLORS.GREEN, borderRadius: 4, position: 'absolute', bottom: 0, right: 0}} />
          ) : null
        }
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
