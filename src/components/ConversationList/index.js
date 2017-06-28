
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';
import theme from '../../theme';

import { Flex, Icon, Text, Touchable, Separator } from '../../components/common';

function formatConversations(c) {
  return Object.keys(c).map((k) => c[k]);
}
const ITEM_HEIGHT = 60 + theme.separatorHeight;

class ConversationList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      // dataSource: ds.cloneWithRows(formatConversations(props.items)),
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow({ item }) {
    const conversation = item;
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
              <Icon name="arrow-right" size={20} />
            </Flex>
          </Flex>
        </View>
      </Touchable>
    );
  }

  render() {
    const conversations = formatConversations(this.props.items);
    return (
      <FlatList
        ItemSeparatorComponent={() => <Separator />}
        initialNumToRender={15}
        stickySectionHeadersEnabled={true}
        data={conversations}
        renderItem={this.renderRow}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
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
