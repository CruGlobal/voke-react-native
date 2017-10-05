import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';

import { IS_SMALL_ANDROID } from '../../constants';
import theme, { DEFAULT } from '../../theme';
import { Flex, Text, Touchable } from '../common';

class SignUpHeader extends Component {
  render() {
    return (
      <Touchable isAndroidOpacity={false} activeOpacity={1} highlight={false} onPress={this.props.onPress ? this.props.onPress : undefined}>
        <Flex align="center" justify="center" style={styles.wrap}>
          <Text style={styles.title}>{this.props.title}</Text>
          {
            this.props.description ? (
              <Text style={styles.description}>{this.props.description}</Text>
            ) : null
          }
        </Flex>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: IS_SMALL_ANDROID ? 8 : 30,
  },
  title: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 28,
    color: theme.accentColor,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 60,
    fontSize: 16,
  },
});

SignUpHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onPress: PropTypes.func,
};

export default SignUpHeader;
