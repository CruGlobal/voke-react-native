
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, ListView, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import ARROW from '../../../images/chat_name_arrow.png';
// import theme from '../../theme';

import { Flex, Icon, Text, Touchable, Separator } from '../common';

// const ITEM_HEIGHT = 60 + theme.separatorHeight;

class ConversationList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 || r1.id !== r2.id,
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.items),
      refreshing: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.items),
    });
  }

  handleNextPage() {
    this.props.onLoadMore();
  }

  handleDelete(data) {
    this.props.onDelete(data);
  }

  handleBlock(data) {
    this.props.onBlock(data);
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
    const latestMessage = conversation.messages ? conversation.messages[conversation.messages.length - 1] : {};
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
                <Text style={styles.messagePreviewText} numberOfLines={2}>
                  {latestMessage.sender === 'me' ? (<Text>You</Text>) : latestMessage.sender}
                  <Image source={ARROW} resizeMode="contain" style={{width: 20, height: 7}} />
                  {latestMessage.text}
                </Text>
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
                this.handleBlock(data);
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
        onEndReachedThreshold={50}
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
  onDelete: PropTypes.func.isRequired, // Redux
  onBlock: PropTypes.func.isRequired, // Redux
  onLoadMore: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

export default ConversationList;
