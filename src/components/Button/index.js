import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Spinner from 'react-native-spinkit';

import styles from './styles';

import { View, Image, Touchable, Text, Icon, Flex } from '../common';
import theme from '../../theme';

const TYPES = ['transparent', 'header', 'filled', 'disabled'];
function getTypeStyle(type) {
  if (type === 'transparent') {
    return styles.transparent;
  } else if (type === 'header') {
    return styles.header;
  } else if (type === 'filled') {
    return styles.filled;
  } else if (type === 'disabled') {
    return styles.disabled;
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
    this.clickDisableTimeout = setTimeout(() => {
      this.setState({ clickedDisabled: false });
    }, this.props.preventTimeout);
    // Call the users click function with all the normal click parameters
    this.props.onPress(...args);
  }

  render() {
    const {
      type,
      hitSlop,
      image,
      text,
      icon,
      iconType,
      children,
      disabled,
      preventTimeout, // eslint-disable-line
      isLoading,
      style,
      buttonTextStyle,
      iconStyle,
      textProps = {},
      touchableStyle,
      ...rest
    } = this.props;
    let content = children;
    if (!children) {
      let textComp = null;
      let iconComp = null;
      let imageComp = null;
      if (text) {
        textComp = (
          <Text style={[getTextStyle(type), buttonTextStyle]} {...textProps}>
            {text}
          </Text>
        );
      }
      if (icon) {
        iconComp = (
          <Icon
            name={icon}
            type={iconType ? iconType : null}
            style={[getIconStyle(type), iconStyle]}
          />
        );
      }
      if (image) {
        imageComp = <Image source={image} style={styles.imageStyle} />;
      }
      if ((icon && text) || (image && text)) {
        content = (
          <Flex direction="row" align="center" justify="start">
            {icon ? iconComp : null}
            {image ? imageComp : null}
            {textComp}
          </Flex>
        );
      } else {
        content = textComp || iconComp || imageComp;
      }
    }

    if (isLoading) {
      content = <Spinner color={theme.white} size={26} type="ThreeBounce" />;
    }
    const isDisabled = disabled || this.state.clickedDisabled || isLoading;
    return (
      <Touchable
        {...rest}
        style={touchableStyle}
        disabled={isDisabled}
        onPress={isDisabled ? () => {} : this.handlePress}
      >
        <View
          hitSlop={hitSlop}
          style={[
            getTypeStyle(type),
            disabled || isLoading ? styles.disabled : null,
            style,
          ]}
        >
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
  hitSlop: PropTypes.object,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  preventTimeout: PropTypes.number,
  textProps: PropTypes.object,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
  iconStyle: PropTypes.oneOfType(styleTypes),
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  touchableStyle: PropTypes.oneOfType(styleTypes),
};

Button.defaultProps = {
  style: {},
  buttonTextStyle: {},
  iconStyle: {},
  preventTimeout: 400,
};
