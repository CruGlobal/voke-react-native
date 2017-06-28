
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import theme, { COLORS } from '../../theme';
// import { navigateAction } from '../../actions/navigation';

import { Flex, Touchable, Text, Icon, RefreshControl } from '../../components/common';


class SearchBarIos extends Component { // eslint-disable-line
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false,
    };

  }
  render() {

    return (
      <Flex style={styles.inputWrap} align="center" >
        <TextInput
          value={this.props.value}
          onFocus={() => this.setState({ isFocus: true })}
          onBlur={() => this.setState({ isFocus: false })}
          placeholder=""
          placeholderTextColor={theme.textColor}
          style={styles.searchBox}
          autoCorrect={true}
          onChangeText={this.props.onChange}
          clearButtonMode="always"
        />
        {
          this.state.isFocus ? null : (
            <View style={styles.searchIconWrap} pointerEvents="none">
              <Icon style={styles.searchIcon} name="search" size={22} />
            </View>
          )
        }
      </Flex>
    );
  }
}

SearchBarIos.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default (SearchBarIos);
