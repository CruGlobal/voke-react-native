import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { translate } from 'react-i18next';

import styles from './styles';
import theme, { COLORS } from '../../theme';
import { getInitials } from '../../utils/common';

import {
  Flex,
  VokeIcon,
  Text,
  Touchable,
  Avatar,
  RefreshControl,
} from '../common';
import LoadMore from '../LoadMore';
import NotificationToast from '../../containers/NotificationToast';
import CONSTANTS from '../../constants';

const SLIDE_ROW_WIDTH = 130;

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      rowFocused: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.items,
    });
  }

  handleDelete = data => {
    this.props.onDelete(data);
  };

  handleBlock = data => {
    const otherPerson = this.getConversationParticipant(data);
    this.props.onBlock(otherPerson, data);
  };

  getSenderName = conversation => {
    const { t, me } = this.props;
    const messenger = conversation.messengers[0]
      ? conversation.messengers[0]
      : {};
    if (messenger && messenger.id && messenger.id !== me.id) {
      return messenger.first_name || t('other');
    }
    return t('you');
  };

  getConversationParticipant = conversation => {
    const myId = this.props.me.id;
    const voke = conversation.messengers.find(a => a.bot);

    const otherPerson = conversation.messengers.find(
      a => a.id !== myId && !a.bot,
    );
    if (voke && conversation.messengers.length === 2) {
      return voke;
    }
    return otherPerson;
  };

  renderNotificationPrompt = () => {
    return <NotificationToast />;
  };

  renderLoadMore = () => {
    if (this.props.hasMore) {
      return (
        <LoadMore
          isLoading={this.props.isLoading}
          onLoad={this.props.onLoadMore}
        />
      );
    }
    return null;
  };

  renderRow = ({ item }) => {
    const { t, unreadCount } = this.props;
    const conversation = item;
    const contentCreator = this.getSenderName(conversation);
    const otherPerson = this.getConversationParticipant(conversation);
    const initials = otherPerson ? otherPerson.initials : t('vokebotInitials');

    return (
      <Touchable
        highlight={true}
        underlayColor={COLORS.TRANSPARENT}
        androidRippleColor={COLORS.DARK_BLUE}
        onShowUnderlay={() => this.setState({ rowFocused: item.id })}
        onHideUnderlay={() => this.setState({ rowFocused: null })}
        activeOpacity={1}
        onPress={() => this.props.onSelect(conversation)}
      >
        <View
          style={[
            styles.container,
            this.state.rowFocused === item.id
              ? { backgroundColor: theme.accentColor }
              : null,
            { borderBottomWidth: 1, borderBottomColor: theme.separatorColor },
          ]}
        >
          <Flex direction="row" align="center" justify="center">
            <Avatar
              size={30}
              image={
                otherPerson &&
                otherPerson.avatar &&
                otherPerson.avatar.small.indexOf('/avatar.jpg') < 0
                  ? otherPerson.avatar.small
                  : null
              }
              style={[
                styles.avatar,
                this.state.rowFocused === item.id
                  ? { backgroundColor: theme.primaryColor }
                  : null,
              ]}
              text={getInitials(initials)}
              present={conversation.isPresent}
            />
            <Flex value={1} justify="start">
              <Flex direction="column" justify="center">
                <Text style={styles.conversationName}>
                  {otherPerson ? otherPerson.first_name : t('vokebot')}{' '}
                  {otherPerson ? otherPerson.last_name : ''}
                </Text>
                <Flex direction="row" align="center">
                  <Text style={styles.messagePreviewWrapper} numberOfLines={2}>
                    <Text style={styles.creatorText}>{contentCreator}</Text>
                    {theme.isAndroid ? ' ' : null}
                    <VokeIcon name="arrow" style={styles.arrowImage} />
                    {theme.isAndroid ? ' ' : null}
                    <Text style={styles.messagePreviewText}>
                      {conversation.messagePreview || '...'}
                    </Text>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              style={styles.conversationArrow}
              align="center"
              justify="center"
            >
              <VokeIcon
                name={
                  conversation.hasUnread && unreadCount > 0
                    ? 'unread-arrow'
                    : 'read-arrow'
                }
              />
            </Flex>
          </Flex>
        </View>
      </Touchable>
    );
  };

  render() {
    return (
      <SwipeListView
        useFlatList={true}
        keyExtractor={item => item.id}
        data={this.props.items}
        renderItem={this.renderRow}
        directionalDistanceChangeThreshold={theme.isAndroid ? 12 : undefined}
        renderHiddenItem={({ item }, rowMap) => (
          <View style={styles.rowBack}>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={{ width: SLIDE_ROW_WIDTH }}
            >
              <Touchable
                activeOpacity={0.9}
                style={{ flex: 1 }}
                disabled={item.messengers.length === 2}
                onPress={() => {
                  this.handleDelete(item);
                  rowMap[item.id] && rowMap[item.id].closeRow();
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={[
                    styles.rowBackButton,
                    item.messengers.length === 2 ? styles.disabledButton : null,
                  ]}
                >
                  <VokeIcon name="delete" style={{ height: 40 }} />
                </Flex>
              </Touchable>
              <Touchable
                activeOpacity={0.9}
                style={{ flex: 1 }}
                disabled={item.messengers.length === 2}
                onPress={() => {
                  this.handleBlock(item);
                  rowMap[item.id] && rowMap[item.id].closeRow();
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={[
                    styles.rowBackButton,
                    item.messengers.length === 2 ? styles.disabledButton : null,
                  ]}
                >
                  <VokeIcon name="block" style={{ height: 40 }} />
                </Flex>
              </Touchable>
            </Flex>
          </View>
        )}
        initialListSize={CONSTANTS.CONVERSATIONS_PAGE_SIZE - 1}
        pageSize={CONSTANTS.CONVERSATIONS_PAGE_SIZE - 1}
        enableEmptySections={true}
        rightOpenValue={SLIDE_ROW_WIDTH * -1}
        disableLeftSwipe={false}
        disableRightSwipe={true}
        ListHeaderComponent={this.renderNotificationPrompt}
        ListFooterComponent={this.renderLoadMore}
        recalculateHiddenLayout={true}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
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
  hasMore: PropTypes.bool,
};

export default translate()(ConversationList);
