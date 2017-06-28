
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView } from 'react-native';

import styles from './styles';
import { Flex, Touchable, Text, Separator } from '../../components/common';

class SettingsList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.name !== r2.name,
    });
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows(props.items),
    };

    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
  }

  renderRow(setting) {
    return (
      <Touchable highlight={true} activeOpacity={0.6} onPress={setting.onPress}>
        <Flex style={styles.row} direction="row" align="center" justify="center">
          <Flex value={1} direction="column">
            <Text style={styles.link}>{setting.name}</Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    // TODO: Change this to a FlatList
    return (
      <View style={styles.container}>
        <ListView
          style={{ flex: 1 }}
          renderSeparator={(sectionID, rowID) => <Separator style={styles.settingsSeparator} key={rowID} />}
          enableEmptySections={true}
          contentContainerStyle={styles.content}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

SettingsList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SettingsList;
