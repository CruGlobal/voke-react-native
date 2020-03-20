import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

class Triangle extends Component {
  render() {
    const { width, height, slant, flip, color, style } = this.props;
    if (!height || !width) return;
    let customStyles;

    if (slant === 'down') {
      if (flip) {
        customStyles = {
          borderLeftWidth: width,
          borderRightWidth: width,
          borderBottomWidth: 0,
          borderTopWidth: height,
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        };
      } else {
        // todo
      }
    } else {
      if (flip) {
        //todo
      } else {
        customStyles = {
          borderLeftWidth: width,
          borderRightWidth: width,
          borderBottomWidth: height,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        };
      }
    }
    return <View style={[customStyles, styles.triangle, style]} />;
  }
}

export default Triangle;

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
});
