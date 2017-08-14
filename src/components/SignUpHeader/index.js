import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { Flex, Text } from '../common';

class SignUpHeader extends Component {
  render() {
    return (
      <Flex align="center" justify="center" style={styles.wrap}>
        <Text style={styles.title}>{this.props.title}</Text>
        {
          this.props.description ? (
            <Text style={styles.description}>{this.props.description}</Text>
          ) : null
        }
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 30,
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
};

export default SignUpHeader;
