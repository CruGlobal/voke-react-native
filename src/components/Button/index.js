import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from './styles';

import { Touchable, Text, Icon, Flex } from '../common';

const TYPES = ['transparent', 'header'];
function getTypeStyle(type) {
  if (type === 'transparent') {
    return styles.transparent;
  } else if (type === 'header') {
    return styles.header;
  }
  return styles.button;
}
function getTextStyle(type) {
  return type === 'header' ? styles.textHeader : styles.buttonText;
}
function getIconStyle(type) {
  return type === 'header' ? styles.iconHeader : styles.icon;
}

export default class Button extends Component {
  render() {
    const { onPress, type, text, icon, children, disabled, style = {}, buttonTextStyle = {}, iconStyle = {}, ...rest } = this.props;
    let content = children;
    if (!children) {
      let textComp = null;
      let iconComp = null;
      if (text) {
        textComp = (
          <Text style={[getTextStyle(type), buttonTextStyle]}>
            {text}
          </Text>
        );
      }
      if (icon) {
        iconComp = (
          <Icon name={icon} style={[getIconStyle(type), iconStyle]} />
        );
      }
      if (icon && text) {
        content = (
          <Flex direction="row" align="center" justify="start">
            {iconComp}
            {textComp}
          </Flex>
        );
      } else {
        content = textComp || iconComp;
      }
    }
    return (
      <Touchable onPress={disabled ? undefined : onPress} {...rest}>
        <View style={[getTypeStyle(type), disabled ? styles.disabled : null, style]}>
          {content}
        </View>
      </Touchable>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf(TYPES),
  text: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
  iconStyle: PropTypes.oneOfType(styleTypes),
};
