
import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Text, Touchable, Icon } from '../common';


class MessageItem extends Component {

  renderText() {
    const message = this.props.item;
    const isVoke = message.sender === '3';
    const isMe = isVoke || message.sender === '1';
    return (
      <Flex
        value={1}
        style={[
          styles.row,
          isMe ? styles.me : styles.otherPerson,
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
          {message.text}
        </Text>
      </Flex>
    );
  }

  renderVideo() {
    const message = this.props.item;
    const isVoke = message.sender === '3';
    const isMe = isVoke || message.sender === '1';
    return (
      <Flex
        value={1}
        direction="row"
        align="center"
        justify={isMe ? 'end' : 'start'}
      >
        <Touchable onPress={this.props.onSelectVideo}>
          <Image
            resizeMode="contain"
            source={require('../../../images/vokeLogo.png')}
            style={[
              styles.video,
              isMe ? styles.meVideo : styles.otherPersonVideo,
            ]} >
            <Icon name="play-circle-filled" size={40} style={styles.playIcon} />
          </Image>
        </Touchable>
      </Flex>
    );
  }

  render() {
    const message = this.props.item;
    const isVoke = message.sender === '3';
    const isMe = isVoke || message.sender === '1';
    const isVideo = message.type === 'video';

    return (
      <Flex direction="column" style={{margin: 6}}>
        <Flex direction="row" style={{marginHorizontal: 5}} align="center" justify="center">
          {
            !isMe ? (
              <Flex self="end" style={styles.avatar}></Flex>
            ) : null
          }
          <Flex
            self="end"
            style={[
              styles.triangle,
              !isMe && !isVideo ? styles.otherTriangle : null,
            ]}
          />
          {
            !isVideo ? this.renderText() : this.renderVideo()
          }
          <Flex
            self="end"
            style={[
              styles.triangle,
              isMe && !isVideo ? styles.meTriangle : null,
              isMe && !isVideo && isVoke ? styles.vokeTriangle : null,
            ]}
          />
          {
            isMe ? (<Flex self="end" style={styles.avatar}></Flex>) : null
          }
        </Flex>
        <Flex align={isMe ? 'end' : 'start'} justify="start" style={[styles.time, isMe ? styles.meTime : styles.otherPersonTime]}>
          <Text style={styles.timeText}>{message.id}</Text>
        </Flex>
      </Flex>
    );
  }
}

MessageItem.propTypes = {
  item: PropTypes.object.isRequired, // Redux
};

export default MessageItem;
