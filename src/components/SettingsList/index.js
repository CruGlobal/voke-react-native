import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Touchable, Text, Separator } from '../common';
import SafeArea from '../SafeArea';

class SettingsList extends Component {
  renderRow = ({ item }) => {
    return (
      <Touchable highlight={true} activeOpacity={0.6} onPress={item.onPress}>
        <Flex style={styles.row} direction="row" align="center">
          <Text style={styles.link}>{item.name}</Text>
        </Flex>
      </Touchable>
    );
  };

  render() {
    return (
      <SafeArea style={{ flex: 1 }} bg="white">
        <FlatList
          initialNumToRender={20}
          data={this.props.items}
          ItemSeparatorComponent={() => (
            <Separator style={styles.settingsSeparator} />
          )}
          renderItem={this.renderRow}
          keyExtractor={item => item.name.replace(/\s/gi, '')}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
        />
      </SafeArea>
    );
  }
}

SettingsList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default translate()(SettingsList);
