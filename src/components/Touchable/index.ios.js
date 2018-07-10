import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TouchableHighlight } from 'react-native';

import { COLORS } from '../../theme';

class TouchableIOS extends Component {
  render() {
    const { highlight, ...rest } = this.props;
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

export default TouchableIOS;
