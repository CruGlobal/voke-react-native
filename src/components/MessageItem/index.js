import React, { PureComponent } from 'react';
import { Image, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-native-spinkit';

import i18n from '../../i18n';
import theme from '../../theme';
import styles from './styles';
import { Flex, Text, Icon, Avatar, DateComponent, Touchable } from '../common';
import { momentUtc, getInitials } from '../../utils/common';
import TO_CHAT from '../../../images/newShare.png';
import Analytics from '../../utils/analytics';

class MessageItem extends PureComponent {
  constructor(props) {
    super(props);

    // Find messenger where 'bot' is true
    let vb = props.messengers.find(m => m.bot);

    // If there are no messengers with 'bot' set to true, find the name Voke from a messenger
    if (!vb) {
      // This is a silly fallback and should never happen
      vb = props.messengers.find(m => m.first_name === 'Voke');
    }
    this.vokebotMessenger = vb || {};
  }

  getOther() {
    const messengers = this.props.messengers;
    const user = this.props.user;
    return messengers.find(m => !m.bot && user.id != m.id);
  }

  shareVideo = () => {
    if (this.props.item && this.props.item.item && this.props.onShareVideo) {
      this.props.onShareVideo(this.props.item.item);
    }
  };

  renderText() {
    const message = this.props.item;
    const isVoke = message.messenger_id === this.vokebotMessenger.id;
    const isOnlyVoke = this.props.messengers.length < 3;

    const isMe = this.props.item.messenger_id === this.props.user.id;
    const isTypeState = message.type === 'typeState';

    return (
      <Flex
        style={[
          styles.row,
          isMe || (isVoke && !isOnlyVoke) ? styles.me : styles.otherPerson,
          isVoke && !isOnlyVoke ? styles.vokebot : null,
        ]}
        direction="row"
        align="center"
        justify="start"
        ref={x => Analytics.markSensitive(x)}
      >
        {!isTypeState ? (
          <Text
            selectable={true}
            style={[
              styles.message,
              isMe ? styles.meText : styles.otherText,
              isVoke && !isOnlyVoke ? styles.vokeText : null,
            ]}
          >
            {message.content}
          </Text>
        ) : (
          <Flex>
            <Spinner color={theme.accentColor} size={25} type="ThreeBounce" />
          </Flex>
        )}
      </Flex>
    );
  }

  renderVideoImage(style) {
    return (
      <Touchable
        isAndroidOpacity={true}
        activeOpacity={0.7}
        onPress={this.props.onSelectVideo}
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: this.props.item.item.media.thumbnails.large }}
          style={style}
        >
          <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
        </ImageBackground>
      </Touchable>
    );
  }

  renderVideoAndText() {
    const message = this.props.item;
    const isTypeState = message.type === 'typeState';

    return (
      <Flex direction="column">
        <Flex value={1} direction="row" align="center" justify="start">
          {this.renderVideoImage([styles.video, styles.otherPersonVideo])}
          {this.renderShareVideo()}
        </Flex>
        <Flex
          style={[styles.row, styles.otherPerson]}
          direction="row"
          align="center"
          justify="start"
        >
          {!isTypeState ? (
            <Text selectable={true} style={[styles.message, styles.otherText]}>
              {message.content}
            </Text>
          ) : (
            <Flex>
              <Spinner color={theme.accentColor} size={25} type="ThreeBounce" />
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  }

  renderShareVideo() {
    const SIZE = 55;
    return (
      <Touchable
        isAndroidOpacity={true}
        onPress={this.shareVideo}
        activeOpacity={0.6}
        style={[styles.shareCircleButton]}
      >
        <Image
          resizeMode="cover"
          source={TO_CHAT}
          style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
        />
      </Touchable>
    );
  }

  renderVideo() {
    const message = this.props.item;
    const isVoke = message.messenger_id === this.vokebotMessenger.id;
    const isOnlyVoke = this.props.messengers.length < 3;
    const isMe = message.messenger_id === this.props.user.id;

    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        justify={isMe ? 'end' : 'start'}
      >
        {isMe ? this.renderShareVideo() : null}
        {this.renderVideoImage([
          styles.video,
          isMe || (isVoke && !isOnlyVoke)
            ? styles.meVideo
            : styles.otherPersonVideo,
        ])}
        {!isMe ? this.renderShareVideo() : null}
      </Flex>
    );
  }

  renderAvatar() {
    const message = this.props.item;
    const user = this.props.user;
    const isVoke = message.messenger_id === this.vokebotMessenger.id;
    const isMe = message.messenger_id === this.props.user.id;

    if (isMe) {
      return (
        <Avatar
          size={28}
          image={user.avatar ? user.avatar.small : null}
          text={getInitials(user.initials)}
        />
      );
    } else if (isVoke) {
      return (
        <Avatar
          size={28}
          image={
            this.vokebotMessenger.avatar
              ? this.vokebotMessenger.avatar.small
              : null
          }
          text={getInitials(this.vokebotMessenger.initials)}
        />
      );
    } else {
      const otherMessenger = this.getOther();
      if (!otherMessenger) return null;
      return (
        <Avatar
          image={
            otherMessenger &&
            otherMessenger.avatar &&
            otherMessenger.avatar.small.indexOf('/avatar.jpg') < 0
              ? otherMessenger.avatar.small
              : null
          }
          size={28}
          text={getInitials(otherMessenger.initials)}
        />
      );
    }
  }

  render() {
    const message = this.props.item;
    const isTypeState = message.type === 'typeState';
    const isVoke = message.messenger_id === this.vokebotMessenger.id;

    const isOnlyVoke = this.props.messengers.length < 3;
    const isMe = message.messenger_id === this.props.user.id;
    const isVideo = message.item;
    const isVideoAndText = message.item && message.content;
    const time = message.created_at;
    const momentTime = momentUtc(time)
      .local()
      .format('LL');
    const momentNow = moment()
      .local()
      .format('LL');
    const separatorTime =
      momentTime === momentNow ? i18n.t('today') : momentTime;

    let content;
    if (isVideoAndText) {
      content = this.renderVideoAndText();
    } else if (isVideo) {
      content = this.renderVideo();
    } else {
      content = this.renderText();
    }

    return (
      <Flex
        direction="column"
        style={{ margin: 6 }}
        animation="fadeIn"
        align={isMe || (isVoke && !isOnlyVoke) ? 'end' : 'start'}
      >
        {this.props.item.isLatestForDay ? (
          <Flex align="center" justify="center" style={styles.dateSeparator}>
            <Text style={styles.timeText}>{separatorTime}</Text>
          </Flex>
        ) : null}
        <Flex direction="row" style={{ marginHorizontal: 5 }}>
          {(isOnlyVoke && isVoke) || (!isMe && !isVoke) ? (
            <Flex self="end" style={styles.avatar}>
              {this.renderAvatar()}
            </Flex>
          ) : null}
          <Flex
            self="end"
            style={[
              styles.triangle,
              (!isMe && !isVideo && !isVoke) ||
              ((!isVideo || isVideoAndText) && (isOnlyVoke && isVoke))
                ? styles.otherTriangle
                : null,
            ]}
          />
          {content}
          <Flex
            self="end"
            style={[
              styles.triangle,
              !isVideo && (isMe || (isVoke && !isOnlyVoke))
                ? styles.meTriangle
                : null,
              !isVideo && isVoke && !isOnlyVoke ? styles.vokeTriangle : null,
            ]}
          />
          {isMe || (isVoke && !isOnlyVoke) ? (
            <Flex self="end" style={styles.avatar}>
              {this.renderAvatar()}
            </Flex>
          ) : null}
        </Flex>
        {isTypeState ? null : (
          <Flex
            align={
              !(isOnlyVoke && isVoke) && (isMe || isVoke) ? 'end' : 'start'
            }
            justify="start"
            style={[
              styles.time,
              (isMe || isVoke) && !(isOnlyVoke && isVoke)
                ? styles.meTime
                : styles.otherPersonTime,
            ]}
          >
            <DateComponent
              style={styles.timeText}
              date={message.created_at}
              format="h:mm A"
            />
          </Flex>
        )}
      </Flex>
    );
  }
}

MessageItem.propTypes = {
  item: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messengers: PropTypes.array.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  onShareVideo: PropTypes.func.isRequired,
};

export default MessageItem;
