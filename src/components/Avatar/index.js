import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import styles from './styles';

import { Text, Flex } from '../common';

export default class Avatar extends Component {

  renderContent() {
  }

  render() {
    const { text, image, size, style = {}, avatarTextStyle = {}, imageStyle = {}, ...rest } = this.props;
    let textComp = null;
    let imageComp = null;

    if (image) {
      imageComp = (
        <Image resizeMode="cover" source={{uri: image}} style={[imageStyle, {width: size, height: size, borderRadius: size/2}]} />
      );
    }
    if (text) {
      textComp = (
        <Text style={[styles.textStyle, avatarTextStyle, {lineHeight: size}]}>
          {text}
        </Text>
      );
    }

    return (
      <Flex style={[{width: size, height: size, borderRadius: size/2}, styles.avatar, style]} align="center" justify="start">
        {
          imageComp ? imageComp : textComp ? textComp : null
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
  style: PropTypes.oneOfType(styleTypes),
  avatarTextStyle: PropTypes.oneOfType(styleTypes),
  imageStyle: PropTypes.oneOfType(styleTypes),
};
