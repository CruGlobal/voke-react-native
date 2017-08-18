import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from './styles';

import { Text, Icon, Flex } from '../common';

export default class Avatar extends Component {

  renderContent() {
  }

  render() {
    const { text, icon, size, style = {}, avatarTextStyle = {}, iconStyle = {}, ...rest } = this.props;
    let textComp = null;
    let iconComp = null;

    if (icon) {
      iconComp = (
        <Icon name={icon} style={[iconStyle, styles.icon]} />
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
          iconComp ? iconComp : textComp ? textComp : null
        }
      </Flex>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Avatar.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.oneOfType(styleTypes),
  avatarTextStyle: PropTypes.oneOfType(styleTypes),
  iconStyle: PropTypes.oneOfType(styleTypes),
};
