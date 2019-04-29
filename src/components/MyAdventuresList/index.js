import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, View } from 'react-native';
import { translate } from 'react-i18next';
import moment from 'moment';

import st from '../../st';
import {
  Flex,
  Text,
  Touchable,
  RefreshControl,
  VokeIcon,
  Button,
} from '../common';
import { momentUtc, keyExtractorId } from '../../utils/common';

export const THUMBNAIL_HEIGHT = 78;
export const THUMBNAIL_WIDTH = 64;

const TIMER_INTERVAL = 60;

function getExpiredTime(date) {
  const diff = momentUtc(date).diff(moment());
  const diffDuration = moment.duration(diff);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();
  // const seconds = diffDuration.seconds();

  const str = `${days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}${
    hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''
  }${minutes >= 0 ? `${minutes} min ` : ''}`;
  return { str, isExpired: diff < 0 };
}

class InviteCard extends Component {
  state = { isExpired: false, time: '' };

  componentDidMount() {
    this.interval = setInterval(this.setTime, TIMER_INTERVAL * 1000);
    this.setTime();
  }

  componentWillUnmount() {
    this.clear();
  }

  clear() {
    clearInterval(this.interval);
  }

  setTime = () => {
    const { str, isExpired } = getExpiredTime(this.props.item.expires_at);
    // Clear the interval when it is expired
    if (isExpired && !this.state.isExpired) {
      this.clear();
    }
    this.setState({ isExpired, time: str });
  };

  render() {
    const { t, item, onDelete, onResend, onSelect } = this.props;
    const { organization_journey, name, code } = item;
    const { isExpired, time } = this.state;

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
      >
        <Flex>
          <Image
            source={{ uri: organization_journey.image.small }}
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
            {t('waitingForFriend', { name })}
          </Text>
          <Flex direction="row" align="center" style={[st.pb6]}>
            {!isExpired ? (
              <Text numberOfLines={1} style={[st.white, st.fs6]}>
                {t('expiresIn', { time })}
              </Text>
            ) : (
              <Button
                text={t('resend')}
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
              {t('code')}
            </Text>
            <Text selectable={true} style={[st.white, st.fs6, st.bold]}>
              {code}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <Touchable onPress={() => onSelect(item)} style={[st.pd(7)]}>
            <Text style={[st.bold, st.fs6, st.tac]}>GET {'\n'}STARTED</Text>
          </Touchable>
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
}

// Optimization
const ProgressDots = React.memo(function({ isFilled }) {
  return (
    <View
      style={[
        isFilled ? st.bgBlue : [st.bgTransparent, st.bw1, st.borderCharcoal],
        st.mr6,
        st.circle(10),
      ]}
    />
  );
});

function MyAdventureCard({ t, me, item, onSelect, onClickProfile }) {
  const {
    conversation,
    progress,
    name,
    item: { content: { thumbnails: { small } } },
  } = item;
  const unreadCount = conversation.unread_messages;
  const hasUnread = unreadCount > 0;
  const available = progress.total;
  const totalSteps = new Array(available).fill(1);
  const completed = progress.completed;

  const messengers = conversation.messengers;

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
      >
        <Flex>
          <Image
            source={{ uri: small }}
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
            {name}
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
              {isSolo ? t('me') : otherUser.first_name}
            </Text>
          </Flex>
          <Flex direction="row" align="center">
            {totalSteps.map((i, index) => (
              <ProgressDots key={index} isFilled={index < completed} />
            ))}
            <Text numberOfLines={2} style={[st.ml6, st.charcoal, st.fs5]}>
              {completed}/{available} {t('complete')}
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
            {isSolo ? t('1player') : t('2player')}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  );
}

class MyAdventuresList extends Component {
  state = {
    refreshing: false,
  };

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
      t,
      me,
      onSelect,
      onResendInvite,
      onDeleteInvite,
      onClickProfile,
    } = this.props;
    if (item.code) {
      return (
        <InviteCard
          t={t}
          onResend={onResendInvite}
          onDelete={onDeleteInvite}
          item={item}
          onSelect={onSelect}
        />
      );
    }

    return (
      <MyAdventureCard
        t={t}
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
        keyExtractor={keyExtractorId}
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

export default translate('advenutesList', { wait: true, withRef: true })(
  MyAdventuresList,
);
