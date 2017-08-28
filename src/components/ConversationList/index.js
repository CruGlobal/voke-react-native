
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, ListView, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import ARROW from '../../../images/chat_name_arrow.png';
import DELETE_ICON from '../../../images/deleteChatIcon.png';
import BLOCK_ICON from '../../../images/blockChatIcon.png';
import theme, {COLORS} from '../../theme';

import { Flex, Icon, Text, Touchable, Separator, Avatar } from '../common';

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
      rowFocused: null,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getSenderName = this.getSenderName.bind(this);
    this.getConversationParticipant = this.getConversationParticipant.bind(this);
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

  handleFocus(id) {
    this.setState({ rowFocused: id });
  }

  handleBlur() {
    this.setState({ rowFocused: null });
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  getSenderName(conversation) {
    if (conversation.messengers[0] && conversation.messengers[0].id) {
      if (conversation.messengers[0].id != this.props.me.id) {
        if (conversation.messengers[0].first_name) {
          return conversation.messengers[0].first_name;
        }
        return 'Other';
      }
    }
    return 'you';
  }

  getConversationParticipant(conversation) {
    let voke = conversation.messengers.find((a)=>{
      return a.bot;
    });

    let otherPerson = conversation.messengers.find((a)=>{
      return a.id != this.props.me.id && !a.bot;
    });
    if (conversation.messengers.length ===2) {
      return voke;
    }
    return otherPerson;
  }

  renderRow(item) {
    const conversation = item;
    const contentCreator = this.getSenderName(conversation);
    const otherPerson = this.getConversationParticipant(conversation);


    return (
      <Touchable highlight={true} underlayColor={COLORS.TRANSPARENT} onShowUnderlay={()=> this.handleFocus(item.id)} onHideUnderlay={this.handleBlur} activeOpacity={1} onPress={() => this.props.onSelect(conversation)}>
        <View>
          <Flex style={[styles.container, this.state.rowFocused === item.id ? {backgroundColor: theme.accentColor} : null]} direction="row" align="center" justify="center">
            <Flex value={2} align="center" justify="start">
              <Avatar
                size={30}
                style={this.state.rowFocused === item.id ? { backgroundColor: theme.primaryColor } : null}
                text={otherPerson.initials}
              />
            </Flex>
            <Flex value={15} justify="start">
              <Flex direction="column" justify="center">
                <Text style={styles.conversationName}>{otherPerson.first_name} {otherPerson.last_name}</Text>
                <Flex direction="row" align="center">
                  <Text style={styles.messagePreviewText} numberOfLines={2}>
                    <Text style={styles.creatorText}>{contentCreator}</Text>
                    <Image source={ARROW} resizeMode="contain" style={{width: 20, height: 7}} />
                    {conversation.messagePreview || '...'}
                  </Text>
                </Flex>
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
              activeOpacity={0.9}
              onPress={() => {
                this.handleDelete(data);
                rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
              }}
            >
              <Flex direction="column" align="center" justify="center">
                <Image source={DELETE_ICON} style={{height: 40}} />
              </Flex>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => {
                this.handleBlock(data);
                rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
              }}
            >
              <Flex direction="column" align="center" justify="center">
                <Image source={BLOCK_ICON} style={{height: 40}} />
              </Flex>
            </TouchableOpacity>
          </View>
        )}
        initialListSize={15}
        pageSize={10}
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
  me: PropTypes.object.isRequired, // Redux
};

export default ConversationList;
