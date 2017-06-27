
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Touchable, Text, Separator, RefreshControl } from '../../components/common';


class MessageItem extends Component { // eslint-disable-line

  render() {
    const message = this.props.item;
    const isVoke = message.sender === '3';
    const isMe = isVoke || message.sender === '1';

    return (
      <Flex direction="column" style={{margin: 6}}>
        <Flex direction="row" style={{marginHorizontal: 5}} align="center" justify="center">
          {
            !isMe ? (
              <Flex self="end" style={styles.avatar}></Flex>
            ) : null
          }
          { !isMe ? <Flex self="end" style={[styles.triangle, styles.otherTriangle]}></Flex> : null }
          <Flex
            value={1}
            style={[
              styles.row,
              isMe ? styles.me : styles.otherPerson,
              isVoke ? styles.vokebot : null,
            ]}
            direction="row"
            align="center"
            justify="center"
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
          { isMe ? <Flex self="end" style={[styles.triangle, styles.meTriangle, isVoke ? styles.vokeTriangle : null]}></Flex> : null }
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

export default (MessageItem);
