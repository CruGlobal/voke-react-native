
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, View } from 'react-native';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Icon, Text, Touchable, Separator, RefreshControl } from '../../components/common';

function formatConversations(c) {
  return Object.keys(c).map((k) => c[k]);
}

class ConversationList extends Component { // eslint-disable-line

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
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow(conversation) {
    const latestMessage = conversation.messages[conversation.messages.length - 1] || {};
    return (
      <Touchable highlight={true} activeOpacity={0.6} onPress={() => this.props.onSelect(conversation)}>
        <View>
          <Flex style={styles.container} direction="row" align="center" justify="center">
            <Flex value={2} style={styles.avatarWrapper} align="center" justify="start">
              <Flex style={styles.avatar}></Flex>
            </Flex>
            <Flex value={15}>
              <Flex direction="column">
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.messagePreviewText} numberOfLines={2}>Latest Message: {latestMessage.text}</Text>
              </Flex>
            </Flex>
            <Flex value={1} style={styles.conversationArrow} align="center" justify="center">
              <Icon name="arrow-right" size={15} />
            </Flex>
          </Flex>
        </View>
      </Touchable>
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

ConversationList.propTypes = {
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.object.isRequired, // Redux
};

export default ConversationList;
