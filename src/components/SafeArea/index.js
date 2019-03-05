import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';

import theme from '../../theme';

class SafeArea extends Component {
  setNativeProps(nativeProps) {
    this._view.setNativeProps(nativeProps);
  }
  ref = c => (this._view = c);

  render() {
    const { bg, style, children } = this.props;
    let color = {};
    if (bg === 'white') {
      color.backgroundColor = theme.white;
    } else if (bg === 'primary') {
      color.backgroundColor = theme.primaryColor;
    } else if (bg === 'secondary') {
      color.backgroundColor = theme.secondaryColor;
    } else if (bg === 'transparent') {
      color.backgroundColor = theme.transparent;
    }
    return (
      <SafeAreaView ref={this.ref} style={[color, style]}>
        {children}
      </SafeAreaView>
    );
  }
}

SafeArea.propTypes = {
  bg: PropTypes.oneOf(['white', 'primary', 'secondary', 'transparent']),
};

export default SafeArea;
