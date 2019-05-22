import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import { COLORS } from '../../theme';

class TouchableAndroid extends Component {
  state = {
    clickDisabled: false,
  };

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    clearTimeout(this.clickDisableTimeout);
  }

  handlePress = (...args) => {
    const { onPress } = this.props;
    if (this.state.clickedDisabled || !onPress) {
      return;
    }
    requestAnimationFrame(() => {
      // Prevent the user from being able to click twice
      this.setState({ clickDisabled: true });
      // Re-enable the button after the timeout
      this.clickDisableTimeout = setTimeout(() => {
        this.setState({ clickDisabled: false });
      }, 1000);
      // Call the users click function with all the normal click parameters

      onPress(...args);
    });
  };

  render() {
    const {
      borderless = false,
      isAndroidOpacity,
      androidRippleColor,
      ...rest
    } = this.props;
    const { clickDisabled } = this.state;

    if (isAndroidOpacity) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          activeOpacity={0.6}
          {...rest}
          onPress={clickDisabled ? () => {} : this.handlePress}
        />
      );
    }
    let background;
    // Android > 5.0 support
    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.Ripple(
        COLORS.convert({
          color: androidRippleColor || COLORS.GREY,
          alpha: 0.5,
        }),
        borderless,
      );
    } else {
      background = TouchableNativeFeedback.SelectableBackground();
    }
    return (
      <TouchableNativeFeedback
        accessibilityTraits="button"
        background={background}
        {...rest}
        onPress={clickDisabled ? () => {} : this.handlePress}
      />
    );
  }
}

TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
  isAndroidOpacity: PropTypes.bool,
  androidRippleColor: PropTypes.string,
};

export default TouchableAndroid;
