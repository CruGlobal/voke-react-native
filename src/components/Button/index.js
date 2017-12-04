import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import debounce from 'lodash/debounce';

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
  constructor(props) {
    super(props);

    this.state = {
      clickedDisabled: false,
    };

    // Debounce this function so it doesn't get called too quickly in succession
    this.handlePress = debounce(this.handlePress.bind(this), 25);
  }

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    clearTimeout(this.clickDisableTimeout);
  }

  handlePress(...args) {
    // Prevent the user from being able to click twice
    this.setState({ clickedDisabled: true });
    // Re-enable the button after the timeout
    this.clickDisableTimeout = setTimeout(() => { this.setState({ clickedDisabled: false }); }, 400);
    // Call the users click function with all the normal click parameters
    this.props.onPress(...args);
  }

  render() {
    const { type, image, text, icon, iconType, children, disabled, style = {}, buttonTextStyle = {}, iconStyle = {}, ...rest } = this.props;
    let content = children;
    if (!children) {
      let textComp = null;
      let iconComp = null;
      let imageComp = null;
      if (text) {
        textComp = (
          <Text style={[getTextStyle(type), buttonTextStyle]}>
            {text}
          </Text>
        );
      }
      if (icon) {
        iconComp = (
          <Icon name={icon} type={iconType ? iconType : null} style={[getIconStyle(type), iconStyle]} />
        );
      }
      if (image) {
        imageComp = (
          <Image source={image} style={styles.imageStyle} />
        );
      }
      if (icon && text || (image && text)) {
        content = (
          <Flex direction="row" align="center" justify="start">
            {
              icon ? iconComp : null
            }
            {
              image ? imageComp : null
            }
            {textComp}
          </Flex>
        );
      } else {
        content = textComp || iconComp || imageComp;
      }
    }
    const isDisabled = disabled || this.state.clickedDisabled;
    return (
      <Touchable {...rest} disabled={isDisabled} onPress={this.handlePress}>
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
  iconType: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
  iconStyle: PropTypes.oneOfType(styleTypes),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
