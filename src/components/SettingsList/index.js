
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Touchable, Text, Separator, RefreshControl } from '../../components/common';


class SettingsList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.name !== r2.name,
    });
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows(props.items),
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.dispatch(newSuggestionAction());
      this.setState({ refreshing: false });
    }, 500);
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
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
          style={{ flex: 1 }}
          renderSeparator={(sectionID, rowID) => <Separator key={rowID} />}
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
  dispatch: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(SettingsList);
