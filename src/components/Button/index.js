import React, { PropTypes } from 'react';
import { View } from 'react-native';

import styles from './styles';

import { Touchable, Text, Icon, Flex } from '../common';

function getTypeStyle(type) {
  if (type === 'transparent') {
    return styles.transparent;
  }
  return styles.button;
}

export default function Button({ onPress, type, text, icon, children, disabled, style = {}, buttonTextStyle = {}, iconStyle = {}, ...rest }) {
  let content = children;
  if (!children) {
    let textComp = null;
    let iconComp = null;
    if (text) {
      textComp = (
        <Text style={[styles.buttonText, buttonTextStyle]}>
          {text}
        </Text>
      );
    }
    if (icon) {
      iconComp = (
        <Icon name={icon} style={[styles.icon, iconStyle]} />
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

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  buttonTextStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
};
