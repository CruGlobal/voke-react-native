
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';

import styles from './styles';
import { Flex, Touchable, Text, Separator } from '../common';

class SettingsList extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  renderRow({ item }) {
    return (
      <Touchable highlight={true} activeOpacity={0.6} onPress={item.onPress}>
        <Flex style={styles.row} direction="row" align="center">
          <Text style={styles.link}>{item.name}</Text>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender={10}
          data={this.props.items}
          ItemSeparatorComponent={() => <Separator style={styles.settingsSeparator} />}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.name.replace(/\s/ig, '')}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
        />
      </View>
    );
  }
}

SettingsList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SettingsList;
