import React, { Component, Fragment } from 'react';
import { ViewPropTypes, SafeAreaView } from 'react-native';

class SafeArea extends Component {
  setNativeProps(nativeProps) {
    this._view.setNativeProps(nativeProps);
  }
  ref = c => (this._view = c);

  render() {
    const { top, style, children } = this.props;
    const content = (
      <SafeAreaView ref={this.ref} style={[style]}>
        {children}
      </SafeAreaView>
    );
    // Make the top a different color than the bottom
    if (top) {
      return (
        <Fragment>
          <SafeAreaView style={[{ flex: 0 }, top]} />
          {content}
        </Fragment>
      );
    }
    return content;
  }
}

SafeArea.propTypes = {
  style: ViewPropTypes.style,
  top: ViewPropTypes.style,
};

export default SafeArea;