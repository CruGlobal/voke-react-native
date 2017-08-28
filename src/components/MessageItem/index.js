
import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Text, Touchable, Icon, Avatar, DateComponent } from '../common';

class MessageItem extends Component {

  getVokeBot() {
    const messengers = this.props.messengers;
    return messengers.find((m) => m.bot);
  }

  renderText() {
    const message = this.props.item;
    const isVoke = message.direct_message;
    const isMe = this.props.item.messenger_id === this.props.user.id ? true : false;
    const isOtherPerson = !isMe && !isVoke;

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
        <Text
          style={[
            styles.message,
            isMe ? styles.meText : styles.otherText,
            isVoke ? styles.vokeText: null,
          ]}
        >
          {message.content}
        </Text>
      </Flex>
    );
  }

  renderVideo() {
    const message = this.props.item;
    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id ? true : false;
    const isOtherPerson = !isMe && !isVoke;

    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        justify={isMe ? 'end' : 'start'}
      >
        <Touchable onPress={this.props.onSelectVideo}>
          <Image
            resizeMode="cover"
            source={{uri: message.item.media.thumbnails.large}}
            style={[
              styles.video,
              isMe || isVoke ? styles.meVideo : styles.otherPersonVideo,
            ]} >
            <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
          </Image>
        </Touchable>
      </Flex>
    );
  }

  renderAvatar() {
    const message = this.props.item;
    const user = this.props.user;
    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id ? true : false;
    
    if (isMe) {
      return (
        <Avatar
          size={28}
          image={user.avatar.large}
          text={user.initials}
        />
      );
    } else if (isVoke) {
      const vokebotMessenger = this.getVokeBot();
      if (!vokebotMessenger) return null;
      return (
        <Avatar
          size={28}
          image={vokebotMessenger.avatar.large}
          text={vokebotMessenger.initials}
        />
      );
    }
    return null;
  }

  render() {
    const message = this.props.item;
    const isVoke = message.direct_message;
    const isMe = message.messenger_id === this.props.user.id ? true : false;
    const isVideo = message.item;
    

    return (
      <Flex
        direction="column"
        style={{ margin: 6 }}
        animation="fadeIn"
        align={isMe || isVoke ? 'end' : 'start'}
      >
        <Flex direction="row" style={{ marginHorizontal: 5 }} align="center" justify="center">
          {
            !isMe && !isVoke ? (
              <Flex self="end" style={styles.avatar}></Flex>
            ) : null
          }
          <Flex
            self="end"
            style={[
              styles.triangle,
              !isMe && !isVideo && !isVoke ? styles.otherTriangle : null,
            ]}
          />
          {
            !isVideo ? this.renderText() : this.renderVideo()
          }
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
        <Flex align={(isMe || isVoke) ? 'end' : 'start'} justify="start" style={[styles.time, isMe ? styles.meTime : styles.otherPersonTime]}>
          <DateComponent style={styles.timeText} date={message.created_at} />
        </Flex>
      </Flex>
    );
  }
}

MessageItem.propTypes = {
  item: PropTypes.object.isRequired,
  user: PropTypes.object.isRequred,
  messengers: PropTypes.array.isRequred,
};

export default MessageItem;
