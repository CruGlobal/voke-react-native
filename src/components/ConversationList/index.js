
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, ListView, TouchableOpacity } from 'react-native';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';

import theme from '../../theme';

import { Flex, Icon, Text, Touchable, Separator } from '../common';

function formatConversations(c) {
  return Object.keys(c).map((k) => c[k]);
}
const ITEM_HEIGHT = 60 + theme.separatorHeight;

class ConversationList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 || r1.id !== r2.id,
    });
    this.state = {
      dataSource: ds.cloneWithRows(formatConversations(props.items)),
      refreshing: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: formatConversations(nextProps.items),
    });
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow(item) {
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
    // const conversations = formatConversations(this.props.items);
    return (
      <SwipeListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHiddenRow={(data, sectionID, rowID, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => {
                this.handleDelete(data);
                rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
              }}
            >
              <Flex direction="column" align="center" justify="center">
                <Icon size={24} type="FontAwesome" name="times-circle-o" style={styles.icon} />
                <Text style={styles.backTextWhite}>Delete</Text>
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => {
                this.handleEdit(data);
                rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
              }}
            >
              <Flex direction="column" align="center" justify="center">
                <Icon size={24} type="FontAwesome" name="ban" style={styles.icon} />
                <Text style={styles.backTextWhite}>Block</Text>
              </Flex>
            </TouchableOpacity>
          </View>
        )}
        initialListSize={7}
        pageSize={5}
        enableEmptySections={true}
        onEndReached={this.handleNextPage}
        onEndReachedThreshold={250}
        renderSeparator={(sectionID, rowID) => <Separator key={rowID} />}
        rightOpenValue={-130}
        disableLeftSwipe={false}
        disableRightSwipe={true}
        recalculateHiddenLayout={true}
      />
    );
  }
}
// <FlatList
//   ItemSeparatorComponent={() => <Separator />}
//   initialNumToRender={15}
//   data={conversations}
//   renderItem={this.renderRow}
//   keyExtractor={(item) => item.id}
//   getItemLayout={(data, index) => ({
//     length: ITEM_HEIGHT,
//     offset: ITEM_HEIGHT * index,
//     index,
//   })}
//   refreshing={this.state.refreshing}
//   onRefresh={this.handleRefresh}
//   />

ConversationList.propTypes = {
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.object.isRequired, // Redux
};

export default ConversationList;
