import React, { Component } from 'react';
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

class TouchableAndroid extends Component {
  render() {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(COLORS.GREY_FADE, false)}
        {...this.props}
      />
    );
  }
}

const Touchable = Platform.OS === 'android' ? TouchableAndroid : TouchableIOS;

export default Touchable;
