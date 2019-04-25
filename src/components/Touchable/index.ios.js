import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableHighlight } from 'react-native';

import { COLORS } from '../../theme';

class TouchableIOS extends Component {
  state = {
    clickedDisabled: false,
  };

  componentWillUnmount() {
    // Make sure to clear the timeout when the Button unmounts
    clearTimeout(this.clickDisableTimeout);
  }

  handlePress = (...args) => {
    if (this.state.clickedDisabled) {
      return;
    }
    requestAnimationFrame(() => {
      // Prevent the user from being able to click twice
      this.setState({ clickedDisabled: true });
      // Re-enable the button after the timeout
      this.clickDisableTimeout = setTimeout(() => {
        this.setState({ clickedDisabled: false });
      }, 1000);
      // Call the users click function with all the normal click parameters

      this.props.onPress(...args);
    });
  };

  render() {
    const { highlight, ...rest } = this.props;
    const { clickedDisabled } = this.state;
    // Remove Android props
    if (rest.borderless !== undefined) delete rest.borderless;
    if (rest.isAndroidOpacity !== undefined) delete rest.isAndroidOpacity;
    if (rest.androidRippleColor !== undefined) delete rest.androidRippleColor;

    if (highlight) {
      return (
        <TouchableHighlight
          accessibilityTraits="button"
          underlayColor={COLORS.convert({
            color: COLORS.DARK_BLUE,
            alpha: 0.3,
          })}
          {...rest}
          onPress={clickedDisabled ? () => {} : this.handlePress}
        />
      );
    }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        {...rest}
        onPress={clickedDisabled ? () => {} : this.handlePress}
      />
    );
  }
}

TouchableIOS.propTypes = {
  highlight: PropTypes.bool,
};

export default TouchableIOS;
