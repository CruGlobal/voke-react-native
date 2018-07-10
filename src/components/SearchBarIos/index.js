import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import styles from './styles';
import theme from '../../theme';

import { Flex, Icon } from '../common';

class SearchBarIos extends Component {
  // eslint-disable-line
  state = { isFocus: false };

  render() {
    return (
      <Flex style={styles.inputWrap} align="center">
        <TextInput
          value={this.props.value}
          onFocus={() => this.setState({ isFocus: true })}
          onBlur={() => this.setState({ isFocus: false })}
          placeholder=""
          placeholderTextColor={theme.textColor}
          style={styles.searchBox}
          autoCorrect={false}
          onChangeText={this.props.onChange}
          clearButtonMode="always"
          blurOnSubmit={true}
          returnKeyType="done"
        />
        {this.props.value ? null : (
          <View style={styles.searchIconWrap} pointerEvents="none">
            <Icon style={styles.searchIcon} name="search" size={22} />
          </View>
        )}
      </Flex>
    );
  }
}

SearchBarIos.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchBarIos;
