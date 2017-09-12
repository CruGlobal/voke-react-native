import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, Platform } from 'react-native';

import { COLORS } from '../../theme';

class TouchableAndroid extends Component {
  render() {
    const { borderless = false, ...rest } = this.props;
    let background;
    // Android > 5.0 support
    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.Ripple(COLORS.convert({
        color: COLORS.GREY,
        alpha: 0.5,
      }), borderless);
    } else {
      background = TouchableNativeFeedback.SelectableBackground();
    }
    return (
      <TouchableNativeFeedback
        accessibilityTraits="button"
        background={background}
        {...rest}
      />
    );
  }
}

TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
};

export default TouchableAndroid;
