import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import theme from '../../theme';

export default class MyText extends Component {
  setNativeProps(nativeProps) {
    this._text.setNativeProps(nativeProps);
  }
  render() {
    const { children, animation, style, ...rest } = this.props;
    const Tag = animation ? Animatable.Text : Text;
    return (
      <Tag
        ref={c => (this._text = c)}
        {...rest}
        animation={animation}
        style={[styles.text, style]}
      >
        {children}
      </Tag>
    );
  }
}

MyText.propTypes = Text.propTypes;
MyText.defaultProps = Text.defaultProps;

const styles = StyleSheet.create({
  text: {
    color: theme.textColor,
    fontFamily: 'TitilliumWeb-Regular',
  },
});
