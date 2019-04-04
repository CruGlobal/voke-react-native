import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, View } from 'react-native';
import { translate } from 'react-i18next';

import st from '../../st';
import { Flex, Text, Touchable, RefreshControl, VokeIcon } from '../common';

const ITEM_HEIGHT = 64 + 20;
export const THUMBNAIL_HEIGHT = 78;
export const THUMBNAIL_WIDTH = 64;

class MyAdventuresList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.props
      .onRefresh()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  };

  scrollToBeginning(animated = true) {
    if (this.props.items.length > 0) {
      this.list.scrollToIndex({ index: 0, animated });
    }
  }

  renderProgress = (index, isFilled) => {
    return (
      <View
        key={index}
        style={[
          isFilled ? st.bgBlue : [st.bgTransparent, st.bw1, st.borderCharcoal],
          st.mr6,
          st.circle(10),
        ]}
      />
    );
  };

  renderInviteRow = item => {
    return (
      <Flex
        style={[
          st.mt6,
          st.w(st.fullWidth - 40),
          st.bgDarkBlue,
          st.br6,
          st.ovh,
          st.asc,
          { elevation: 2 },
        ]}
        direction="row"
        align="center"
        justify="start"
        animation="slideInUp"
      >
        <Flex>
          <Image
            source={{ uri: item.organization_journey.image.small }}
            style={[st.f1, st.w(THUMBNAIL_WIDTH), st.brbl6, st.brtl6]}
          />
        </Flex>
        <Flex
          value={1}
          direction="column"
          align="start"
          justify="start"
          style={[st.pv6, st.ph4]}
        >
          <Text numberOfLines={1} style={[st.white, st.fs4]}>
            Waiting for Ben to join...
          </Text>
          <Text numberOfLines={1} style={[st.pb6, st.white, st.fs5]}>
            Expires in...
          </Text>
        </Flex>
        <Flex align="center" justify="center" style={[st.tac, st.mr5]} />
      </Flex>
    );
  };

  renderRow = ({ item }) => {
    const { me } = this.props;

    const isInvite = !!item.code;
    if (isInvite) return this.renderInviteRow(item);

    const unreadCount = item.conversation.unread_messages;
    const hasUnread = unreadCount > 0;
    const available = item.progress.total;
    const totalSteps = new Array(available).fill(1);
    const completed = item.progress.completed;

    const messengers = item.conversation.messengers;

    const isSolo = messengers.length === 2;
    const myUser = messengers.find(i => i.id === me.id);
    const otherUser = messengers.find(
      i => i.id !== me.id && i.first_name !== 'VokeBot',
    );

    return (
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(item)}
      >
        <Flex
          style={[
            st.mt6,
            st.w(st.fullWidth - 40),
            st.bgWhite,
            st.br6,
            st.ovh,
            st.asc,
            { elevation: 2 },
          ]}
          direction="row"
          align="center"
          justify="start"
          animation="slideInUp"
        >
          <Flex>
            <Image
              source={{ uri: item.item.content.thumbnails.small }}
              style={[st.f1, st.w(THUMBNAIL_WIDTH), st.brbl6, st.brtl6]}
            />
          </Flex>
          <Flex
            value={1}
            direction="column"
            align="start"
            justify="start"
            style={[st.pv6, st.ph4]}
          >
            <Text numberOfLines={1} style={[st.pb6, st.blue, st.fs4]}>
              {item.name}
            </Text>
            <Flex direction="row" align="center" style={[st.pb6]}>
              <VokeIcon
                name="Chat"
                style={[hasUnread ? st.orange : st.charcoal]}
              />
              {hasUnread ? (
                <Flex
                  align="center"
                  justify="center"
                  style={[st.circle(20), st.bgOrange, st.ml6]}
                >
                  <Text>{unreadCount}</Text>
                </Flex>
              ) : null}
              <Text style={[st.charcoal, st.ml5, st.fs5]}>
                {isSolo ? 'Me' : otherUser.first_name}
              </Text>
            </Flex>
            <Flex direction="row" align="center">
              {totalSteps.map((i, index) =>
                this.renderProgress(index, index < completed),
              )}
              <Text numberOfLines={2} style={[st.ml6, st.charcoal, st.fs5]}>
                {completed}/{available} Complete
              </Text>
            </Flex>
          </Flex>
          <Flex align="center" justify="center" style={[st.tac, st.mr5]}>
            <Image
              source={{ uri: myUser.avatar.small }}
              style={[st.circle(36)]}
            />
            <Text style={[st.charcoal, st.tac]}>
              {isSolo ? '1 Player' : '2 Player'}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  };

  render() {
    return (
      <FlatList
        ref={c => (this.list = c)}
        initialNumToRender={10}
        data={this.props.items}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={[st.f1, st.mb5]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        onEndReached={this.props.onLoadMore}
        ListHeaderComponent={this.props.header}
      />
    );
  }
}

MyAdventuresList.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  header: PropTypes.func,
  me: PropTypes.object.isRequired,
};

export default translate('videos', { wait: true, withRef: true })(
  MyAdventuresList,
);
