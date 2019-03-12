import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';

import theme from '../../theme';

function getColor(bg) {
  if (theme[bg]) {
    return { backgroundColor: theme[bg] };
  }
  return {};
}

class SafeArea extends Component {
  setNativeProps(nativeProps) {
    this._view.setNativeProps(nativeProps);
  }
  ref = c => (this._view = c);

  render() {
    const { bg, top, style, children } = this.props;
    let color = getColor(bg);
    const content = (
      <SafeAreaView ref={this.ref} style={[color, style]}>
        {children}
      </SafeAreaView>
    );
    // Make the top a different color than the bottom
    if (top) {
      return (
        <Fragment>
          <SafeAreaView style={[getColor(top), { flex: 0 }]} />
          {content}
        </Fragment>
      );
    }
    return content;
  }
}

const bgTypes = ['white', 'primary', 'secondary', 'transparent', 'deepBlack'];

SafeArea.propTypes = {
  bg: PropTypes.oneOf(bgTypes),
  top: PropTypes.oneOf(bgTypes),
};

export default SafeArea;
