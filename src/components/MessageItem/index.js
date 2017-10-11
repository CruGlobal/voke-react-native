import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from 'react-native-spinkit';

import theme from '../../theme';
import styles from './styles';
import { Flex, Text, Icon, Avatar, DateComponent } from '../common';
import { momentUtc, getInitials } from '../../utils/common';

class MessageItem extends Component {

  getVokeBot() {
    const messengers = this.props.messengers;
    return messengers.find((m) => m.bot);
  }

  getOther() {
    const messengers = this.props.messengers;
    const user = this.props.user;
    return messengers.find((m) => !m.bot && (user.id != m.id));
  }

  renderText() {
    const message = this.props.item;
    const isVoke = message.direct_message;
    const isMe = this.props.item.messenger_id === this.props.user.id;
    const isTypeState = message.type === 'typeState';

    return (
      <Flex
        style={[
          styles.row,
          isMe || isVoke ? styles.me : styles.otherPerson,
          isVoke ? styles.vokebot : null,
        ]}
        direction="row"
        align="center"
        justify="start"
      >
        {
          !isTypeState ? (
            <Text
              style={[
                styles.message,
                isMe ? styles.meText : styles.otherText,
                isVoke ? styles.vokeText: null,
              ]}
            >
              {message.content}
            </Text>
          ) : (
            <Flex>
              <Spinner
                color={theme.accentColor}
                size={25}
                type="ThreeBounce"
              />
            </Flex>
          )
        }
      </Flex>
    );
  }

  renderVideoAndText() {
    const message = this.props.item;
    const isTypeState = message.type === 'typeState';

    return (
      <Flex direction="column">
        <Flex
          value={1}
          direction="row"
          align="center"
          justify="start"
        >
          <TouchableOpacity activeOpacity={0.7} onPress={this.props.onSelectVideo}>
            <Image
              resizeMode="cover"
              source={{uri: message.item.media.thumbnails.large}}
              style={[
                styles.video,
                styles.otherPersonVideo,
              ]}>
              <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
            </Image>
          </TouchableOpacity>
        </Flex>
        <Flex
          style={[
            styles.row,
            styles.otherPerson,
          ]}
          direction="row"
          align="center"
          justify="start"
        >
          {
            !isTypeState ? (
              <Text
                style={[
                  styles.message,
                  styles.otherText,
                ]}
              >
                {message.content}
              </Text>
            ) : (
              <Flex>
                <Spinner
                  color={theme.accentColor}
                  size={25}
                  type="ThreeBounce"
                />
              </Flex>
            )
          }
        </Flex>
      </Flex>
    );
  }

  renderVideo() {
    const message = this.props.item;
    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id;

    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        justify={isMe ? 'end' : 'start'}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={this.props.onSelectVideo}>
          <Image
            resizeMode="cover"
            source={{uri: message.item.media.thumbnails.large}}
            style={[
              styles.video,
              isMe || isVoke ? styles.meVideo : styles.otherPersonVideo,
            ]}>
            <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
          </Image>
        </TouchableOpacity>
      </Flex>
    );
  }

  renderAvatar() {
    const message = this.props.item;
    const user = this.props.user;
    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id;

    if (isMe) {
      return (
        <Avatar
          size={28}
          image={user.avatar.small}
          text={getInitials(user.initials)}
        />
      );
    } else if (isVoke) {
      const vokebotMessenger = this.getVokeBot();
      if (!vokebotMessenger) return null;
      return (
        <Avatar
          size={28}
          image={vokebotMessenger.avatar.small}
          text={getInitials(vokebotMessenger.initials)}
        />
      );
    } else {
      const otherMessenger = this.getOther();
      if (!otherMessenger) return null;
      return (
        <Avatar
          image={otherMessenger && otherMessenger.avatar.small.indexOf('/avatar.jpg') < 0 ? otherMessenger.avatar.small : null}
          size={28}
          text={getInitials(otherMessenger.initials)}
        />
      );
    }
  }

  render() {
    const message = this.props.item;
    const isTypeState = message.type === 'typeState';

    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id;
    const isVideo = message.item;
    const isVideoAndText = message.item && message.content;
    const time = message.created_at;
    const momentTime = momentUtc(time).local().format('LL');
    const momentNow = moment().local().format('LL');
    const separatorTime = momentTime === momentNow ? 'Today' : momentTime;

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
        align={isMe || isVoke ? 'end' : 'start'}
      >
        {
          this.props.item.isLatestForDay ? (
            <Flex align="center" justify="center" style={styles.dateSeparator}>
              <Text style={styles.timeText}>{separatorTime}</Text>
            </Flex>
          ) : null
        }
        <Flex direction="row" style={{ marginHorizontal: 5 }} align="center" justify="center">
          {
            !isMe && !isVoke ? (
              <Flex self="end" style={styles.avatar}>
                {this.renderAvatar()}
              </Flex>
            ) : null
          }
          <Flex
            self="end"
            style={[
              styles.triangle,
              !isMe && !isVideo && !isVoke ? styles.otherTriangle : null,
            ]}
          />
          {content}
          <Flex
            self="end"
            style={[
              styles.triangle,
              (isMe || isVoke) && !isVideo ? styles.meTriangle : null,
              !isVideo && isVoke ? styles.vokeTriangle : null,
            ]}
          />
          {
            (isMe || isVoke) ? (
              <Flex self="end" style={styles.avatar}>
                {this.renderAvatar()}
              </Flex>
            ) : null
          }
        </Flex>
        {
          isTypeState ? null : (
            <Flex align={(isMe || isVoke) ? 'end' : 'start'} justify="start" style={[styles.time, (isMe || isVoke) ? styles.meTime : styles.otherPersonTime]}>
              <DateComponent style={styles.timeText} date={message.created_at} format="h:mm A" />
            </Flex>
          )
        }
      </Flex>
    );
  }
}

MessageItem.propTypes = {
  item: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messengers: PropTypes.array.isRequired,
};

export default MessageItem;
