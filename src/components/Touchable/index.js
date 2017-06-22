import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { COLORS } from '../../theme';

class TouchableIOS extends Component {
  render() {
    const { highlight, ...rest } = this.props;
    if (highlight) {
      return (
        <TouchableHighlight
          accessibilityTraits="button"
          underlayColor={COLORS.convert({ color: COLORS.DARK_BLUE, alpha: 0.3 })}
          {...rest}
        />
      );
    }
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        {...rest}
      />
    );
  }
}
TouchableIOS.propTypes = {
  highlight: PropTypes.bool,
};

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
        background={background}
        {...rest}
      />
    );
  }
}
TouchableAndroid.propTypes = {
  borderless: PropTypes.bool,
};

const Touchable = Platform.OS === 'android' ? TouchableAndroid : TouchableIOS;

export default Touchable;
