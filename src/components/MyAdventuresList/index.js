import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, View } from 'react-native';
import { translate } from 'react-i18next';
import moment from 'moment';
import lodashMemoize from 'lodash/memoize';

import st from '../../st';
import {
  Flex,
  Text,
  Touchable,
  RefreshControl,
  VokeIcon,
  Button,
} from '../common';
import { momentUtc } from '../../utils/common';

const ITEM_HEIGHT = 64 + 20;
export const THUMBNAIL_HEIGHT = 78;
export const THUMBNAIL_WIDTH = 64;

function getExpiredTimeFn(date) {
  const now = moment();
  const expiration = momentUtc(date);
  const diff = expiration.diff(now);
  const diffDuration = moment.duration(diff);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  const str = `Expires in ${
    days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''
  }${hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''}${
    minutes > 0 ? `${minutes} min ` : ''
  }`;
  return { str, isExpired: diff < 0 };
}
const getExpiredTime = lodashMemoize(getExpiredTimeFn);

function InviteCard({ item, onResend, onDelete }) {
  const { name, expires_at, code } = item;
  const { str, isExpired } = getExpiredTime(expires_at);

  return (
    <Flex
      style={[
        st.mt6,
        st.w(st.fullWidth - 40),
        st.bgDarkBlue,
        st.br6,
        st.ovh,
        st.asc,
        st.shadow,
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
          Waiting for {name || 'your friend'} to join...
        </Text>
        <Flex direction="row" align="center" style={[st.pb6]}>
          {!isExpired ? (
            <Text numberOfLines={1} style={[st.white, st.fs6]}>
              {str}
            </Text>
          ) : (
            <Button
              text="Resend"
              onPress={() => onResend(item)}
              style={[
                st.bgOrange,
                st.ph5,
                st.pv(2),
                st.bw0,
                st.br0,
                st.br3,
                st.aic,
              ]}
              buttonTextStyle={[st.fs6]}
            />
          )}
          <Text numberOfLines={1} style={[st.white, st.fs6]}>
            {'  '}·{'  '}Code:{' '}
          </Text>
          <Text selectable={true} style={[st.white, st.fs6, st.bold]}>
            {code}
          </Text>
        </Flex>
      </Flex>

      <Flex align="center" justify="center" style={[st.tac, st.mr4, st.ml6]}>
        {isExpired ? (
          <Touchable
            onPress={() => onDelete(item)}
            style={[st.br2, st.borderWhite, st.bw1, st.pd(7)]}
          >
            <VokeIcon name="close" style={[st.white, st.fs6]} />
          </Touchable>
        ) : null}
      </Flex>
    </Flex>
  );
}

function ProgressDots({ index, isFilled }) {
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
}

function MyAdventureCard({ me, item, onSelect, onClickProfile }) {
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
      onPress={() => onSelect(item)}
    >
      <Flex
        style={[
          st.mt6,
          st.w(st.fullWidth - 40),
          st.bgWhite,
          st.br6,
          st.ovh,
          st.asc,
          st.shadow,
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
            {totalSteps.map((i, index) => (
              <ProgressDots
                key={index}
                index={index}
                isFilled={index < completed}
              />
            ))}
            <Text numberOfLines={2} style={[st.ml6, st.charcoal, st.fs5]}>
              {completed}/{available} Complete
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={[st.tac, st.mr5]}>
          <Touchable onPress={() => onClickProfile()}>
            <Image
              source={{ uri: myUser.avatar.small }}
              style={[st.circle(36)]}
            />
          </Touchable>
          {!isSolo && otherUser && otherUser.avatar.small ? (
            <Image
              source={{ uri: otherUser.avatar.small }}
              style={[st.circle(36), st.abstl, { left: -10 }]}
            />
          ) : null}
          <Text
            style={[
              st.charcoal,
              st.tac,
              !isSolo ? { marginLeft: -10 } : { marginLeft: -3 },
            ]}
          >
            {isSolo ? '1 Player' : '2 Player'}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  );
}

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

  renderRow = ({ item }) => {
    const {
      me,
      onSelect,
      onResendInvite,
      onDeleteInvite,
      onClickProfile,
    } = this.props;
    if (item.code) {
      return (
        <InviteCard
          onResend={onResendInvite}
          onDelete={onDeleteInvite}
          item={item}
        />
      );
    }

    return (
      <MyAdventureCard
        me={me}
        item={item}
        onSelect={onSelect}
        onClickProfile={onClickProfile}
      />
    );
  };

  render() {
    const { items, onLoadMore, header } = this.props;
    return (
      <FlatList
        ref={c => (this.list = c)}
        initialNumToRender={10}
        data={items}
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
        onEndReached={onLoadMore}
        ListHeaderComponent={header}
        removeClippedSubviews={false}
      />
    );
  }
}

MyAdventuresList.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onResendInvite: PropTypes.func.isRequired,
  onClickProfile: PropTypes.func.isRequired,
  onDeleteInvite: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  header: PropTypes.func,
  me: PropTypes.object.isRequired,
};

export default translate('videos', { wait: true, withRef: true })(
  MyAdventuresList,
);
