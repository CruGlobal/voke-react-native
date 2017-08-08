import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import theme from '../../theme';

export default class MyText extends Component {
  setNativeProps(nativeProps) {
    this._text.setNativeProps(nativeProps);
  }
  render() {
    const { children, style, ...rest } = this.props;
    return (
      <Animatable.Text ref={(c) => this._text = c} {...rest} style={[styles.text, style]}>
        {children}
      </Animatable.Text>
    );
  }
}

MyText.propTypes = { ...Text.propTypes };
MyText.defaultProps = { ...Text.defaultProps };

const styles = StyleSheet.create({
  text: {
    color: theme.textColor,
  },
});
