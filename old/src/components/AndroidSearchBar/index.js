import React, { Component } from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { COLORS } from '../../theme';
import { Flex } from '../../components/common';

class AndroidSearchBar extends Component {
  render() {
    const { t, value, onChange } = this.props;
    return (
      <Flex style={styles.container} align="center">
        <TextInput
          value={value}
          autoFocus={true}
          placeholder={t('placeholder.search')}
          placeholderTextColor="rgba(240, 240, 240, 0.6)"
          style={styles.input}
          autoCorrect={false}
          onChangeText={onChange}
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

export default translate()(AndroidSearchBar);
