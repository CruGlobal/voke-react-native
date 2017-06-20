import React, { PropTypes } from 'react';
import { View } from 'react-native';

import styles from './styles';

import { Touchable, Text, Icon } from '../common';

export default function Button({ onPress, text, icon, children, disabled, style = {}, buttonStyle = {}, iconStyle = {}, ...rest }) {
  let content = children;
  if (!children) {
    if (text) {
      content = (
        <Text style={[styles.buttonText, buttonStyle]}>
          {text}
        </Text>
      );
    } else if (icon) {
      content = (
        <Icon name={icon} style={[styles.icon, iconStyle]} />
      );
    }
  }
  return (
    <Touchable onPress={disabled ? undefined : onPress} {...rest}>
      <View style={[styles.button, disabled ? styles.disabled : null, style]}>
        {content}
      </View>
    </Touchable>
  );
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  buttonStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
};
