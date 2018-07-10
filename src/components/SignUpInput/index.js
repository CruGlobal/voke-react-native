import React, { Component } from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import theme, { COLORS } from '../../theme';

class SignUpInput extends Component {
  state = { isFocused: false };

  focus() {
    return this.input.focus();
  }
  blur() {
    return this.input.blur();
  }
  clear() {
    return this.input.clear();
  }

  render() {
    const { style, onFocus, onBlur, ...rest } = this.props;
    const isFocused = this.state.isFocused;

    // Get the url for the voke image if it is a voke contact
    return (
      <TextInput
        ref={c => (this.input = c)}
        onFocus={() => {
          this.setState({ isFocused: true });
          onFocus && onFocus();
        }}
        onBlur={() => {
          this.setState({ isFocused: false });
          onBlur && onBlur();
        }}
        autoCapitalize="none"
        returnKeyType="done"
        multiline={false}
        blurOnSubmit={true}
        placeholderTextColor={isFocused ? theme.textColor : theme.accentColor}
        style={[styles.input, isFocused ? styles.active : null, style]}
        autoCorrect={false}
        underlineColorAndroid={COLORS.TRANSPARENT}
        selectionColor={COLORS.YELLOW}
        {...rest}
      />
    );
  }
}

SignUpInput.propTypes = {
  ...TextInput.propTypes,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
};

export default SignUpInput;
