import React, { PropTypes } from 'react';
import { View } from 'react-native';

import styles from './styles';

import { Touchable, Text, Icon, Flex } from '../common';

export default function Button({ onPress, type, text, icon, children, disabled, style = {}, buttonTextStyle = {}, iconStyle = {}, ...rest }) {
  let content = children;
  if (!children) {
    if (text && !icon) {
      content = (
        <Text style={[styles.buttonText, buttonTextStyle]}>
          {text}
        </Text>
      );
    } else if (icon && !text) {
      content = (
        <Icon name={icon} style={[styles.icon, iconStyle]} />
      );
    } else if (icon && text) {
      content = (
        <Flex direction="row" align="center" justify="start">
          <Icon name={icon} style={[styles.icon, iconStyle]} />
          <Text style={[styles.buttonText, buttonTextStyle]}>
            {text}
          </Text>
        </Flex>
      );
    }
  }
  if (type === 'transparent') {
    return (
      <Touchable onPress={disabled ? undefined : onPress} {...rest}>
        <View style={[styles.transparent, disabled ? styles.disabled : null, style]}>
          {content}
        </View>
      </Touchable>
    );
  } else {
    return (
      <Touchable onPress={disabled ? undefined : onPress} {...rest}>
        <View style={[styles.button, disabled ? styles.disabled : null, style]}>
          {content}
        </View>
      </Touchable>
    );
  }
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
