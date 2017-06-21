
import React, { Component, PropTypes } from 'react';
import { ListView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Icon, Text, Separator, RefreshControl } from '../../components/common';

function formatConversations(c) {
  return Object.keys(c).map((k) => c[k]);
}

class SettingsList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.text !== r2.text,
    });
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows(formatConversations(props.items)),
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(formatConversations(nextProps.items)) });
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
      <TouchableOpacity activeOpacity={0.6} onPress={setting.onPress}>
        <Flex style={styles.container} direction="row" align="center" justify="center">
          <Flex value={2} style={styles.avatarWrapper} align="center" justify="start">
            <Flex style={styles.avatar}></Flex>
          </Flex>
          <Flex value={15}>
            <Flex value={1} direction="column">
              <Text style={styles.conversationName}>{setting.name}</Text>
            </Flex>
          </Flex>
          <Flex value={1} style={styles.conversationArrow} align="center" justify="center">
            <Icon name="arrow-right" size={15} />
          </Flex>
        </Flex>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ListView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh} />}
        style={{ flex: 1 }}
        renderSeparator={(sectionID, rowID) => <Separator key={rowID} />}
        enableEmptySections={true}
        contentContainerStyle={styles.content}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

SettingsList.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.object.isRequired, // Redux
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(SettingsList);
