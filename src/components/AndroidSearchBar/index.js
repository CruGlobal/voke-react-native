import React, { Component } from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { COLORS } from '../../theme.js';
import { Flex } from '../../components/common';

class AndroidSearchBar extends Component {
  render() {
    return (
      <Flex style={styles.container} align="center">
        <TextInput
          value={this.props.value}
          autoFocus={true}
          placeholder="Search"
          placeholderTextColor="rgba(240, 240, 240, 0.6)"
          style={styles.input}
          autoCorrect={false}
          onChangeText={this.props.onChange}
          underlineColorAndroid={COLORS.WHITE}
        />
      </Flex>
    );
  }
}

AndroidSearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default AndroidSearchBar;
