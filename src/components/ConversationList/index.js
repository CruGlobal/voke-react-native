
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ListView } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import styles from './styles';
import theme, { COLORS } from '../../theme';
import { momentUtc, getInitials } from '../../utils/common';

import { Flex, VokeIcon, Text, Touchable, Separator, Avatar, RefreshControl } from '../common';
import CONSTANTS from '../../constants';

// const ITEM_HEIGHT = 60 + theme.separatorHeight;
const SLIDE_ROW_WIDTH = 130;

class ConversationList extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 || r1.id !== r2.id || r1.hasUnread !== r2.hasUnread || r1.messagePreview !== r2.messagePreview || r1.updated_at !== r2.updated_at,
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.items),
      rowFocused: null,
    };

    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getSenderName = this.getSenderName.bind(this);
    this.getConversationParticipant = this.getConversationParticipant.bind(this);
    this.getPresence = this.getPresence.bind(this);
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
    const otherPerson = this.getConversationParticipant(data);
    this.props.onBlock(otherPerson, data);
  }

  getSenderName(conversation) {
    const messenger = conversation.messengers[0];
    if (messenger && messenger.id && messenger.id !== this.props.me.id) {
      return messenger.first_name || 'Other';
    }
    return 'you';
  }

  getConversationParticipant(conversation) {
    const myId = this.props.me.id;
    const voke = conversation.messengers.find((a) => a.bot);

    const otherPerson = conversation.messengers.find((a) => a.id !== myId && !a.bot);
    if (voke && conversation.messengers.length === 2) {
      return voke;
    }
    return otherPerson;
  }

  getPresence(messenger) {
    const today = new Date().valueOf();
    const presence = messenger && messenger.present_at ? momentUtc(messenger.present_at).valueOf() : null;
    if (presence && (today - presence < 1000 * 60 * 5)) {
      return true;
    }
    return false;
  }

  renderRow(item) {
    const conversation = item;
    const contentCreator = this.getSenderName(conversation);
    const otherPerson = this.getConversationParticipant(conversation);
    const isPresent = this.getPresence(otherPerson);
    const initials = otherPerson ? otherPerson.initials : 'VB';
    // LOG('initials', initials, getInitials(initials));

    return (
      <Touchable
        highlight={true}
        underlayColor={COLORS.TRANSPARENT}
        androidRippleColor={COLORS.DARK_BLUE}
        onShowUnderlay={() => this.setState({ rowFocused: item.id })}
        onHideUnderlay={() => this.setState({ rowFocused: null })}
        activeOpacity={1}
        onPress={() => this.props.onSelect(conversation)}>
        <View style={[styles.container, this.state.rowFocused === item.id ? { backgroundColor: theme.accentColor } : null]}>
          <Flex direction="row" align="center" justify="center">
            <Avatar
              size={30}
              image={otherPerson && otherPerson.avatar && otherPerson.avatar.small.indexOf('/avatar.jpg') < 0 ? otherPerson.avatar.small : null}
              style={[
                styles.avatar,
                this.state.rowFocused === item.id ? { backgroundColor: theme.primaryColor } : null,
              ]}
              text={getInitials(initials)}
              present={isPresent}
            />
            <Flex value={1} justify="start">
              <Flex direction="column" justify="center">
                <Text style={styles.conversationName}>
                  {otherPerson ? otherPerson.first_name : 'Vokebot'}
                  {' '}
                  {otherPerson ? otherPerson.last_name : ''}
                </Text>
                <Flex direction="row" align="center">
                  <Text style={styles.messagePreviewWrapper} numberOfLines={2}>
                    <Text style={styles.creatorText}>{contentCreator}</Text>
                    {Platform.OS === 'android' ? ' ' : null}
                    <VokeIcon name="arrow" style={styles.arrowImage} />
                    {Platform.OS === 'android' ? ' ' : null}
                    <Text style={styles.messagePreviewText}>
                      {conversation.messagePreview || '...'}
                    </Text>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex style={styles.conversationArrow} align="center" justify="center">
              <VokeIcon name={conversation.hasUnread && this.props.unreadCount > 0 ? 'unread-arrow' : 'read-arrow'} />
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
        directionalDistanceChangeThreshold={Platform.OS === 'android' ? 12 : undefined}
        renderHiddenRow={(data, sectionID, rowID, rowMap) => (
          <View style={styles.rowBack}>
            <Flex direction="row" align="center" justify="center" style={{ width: SLIDE_ROW_WIDTH }}>
              <Touchable
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => {
                  this.handleDelete(data);
                  rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
                }}
              >
                <Flex align="center" justify="center" style={styles.rowBackButton}>
                  <VokeIcon name="delete" style={{ height: 40 }} />
                </Flex>
              </Touchable>
              <Touchable
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => {
                  this.handleBlock(data);
                  rowMap[`${sectionID}${rowID}`] && rowMap[`${sectionID}${rowID}`].closeRow();
                }}
              >
                <Flex align="center" justify="center" style={styles.rowBackButton}>
                  <VokeIcon name="block" style={{ height: 40 }} />
                </Flex>
              </Touchable>
            </Flex>
          </View>
        )}
        initialListSize={CONSTANTS.PAGE_SIZE}
        pageSize={CONSTANTS.PAGE_SIZE}
        enableEmptySections={true}
        onEndReached={this.handleNextPage}
        onEndReachedThreshold={50}
        renderSeparator={(sectionID, rowID) => <Separator key={rowID} />}
        rightOpenValue={SLIDE_ROW_WIDTH * -1}
        disableLeftSwipe={false}
        disableRightSwipe={true}
        recalculateHiddenLayout={true}
        removeClippedSubviews={false}
        refreshControl={<RefreshControl
          refreshing={this.props.refreshing}
          onRefresh={this.props.onRefresh}
        />}
      />
    );
  }
}

ConversationList.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onBlock: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  unreadCount: PropTypes.number.isRequired,
  me: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
};

export default ConversationList;
