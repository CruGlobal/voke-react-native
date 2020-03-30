import React from 'react';
import Image from '../Image';
import st from '../../st';
import Flex from '../Flex';
import Text from '../Text';
import Touchable from '../Touchable';
import moment from 'moment';
import { momentUtc } from '../../utils';
import DateComponent from '../DateComponent';
import VokeIcon from '../VokeIcon';
import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../../constants';

function renderText(item) {
  const notification = item;

  if (!notification || !notification.content) return null;
  return (
    <Flex
      style={[st.ph4, st.pv5, st.br5, st.m5, st.mr1, st.ml0, st.bgWhite]}
      direction="row"
      align="center"
      justify="start"
    >
      <Text selectable={true} style={[st.fs16, st.lh(22), st.blue]}>
        {notification.content}
      </Text>
    </Flex>
  );
}

function renderVideoImage(message) {
  const thumbnail =
    ((((message || {}).item || {}).media || {}).thumbnails || {}).large ||
    undefined;
  return (
    <Touchable
      isAndroidOpacity={true}
      activeOpacity={0.7}
      onPress={this.props.onSelectVideo}
    >
      <Image
        resizeMode="cover"
        source={{ uri: thumbnail }}
        style={[st.w(VIDEO_WIDTH * 0.9), st.h(VIDEO_HEIGHT * 0.9), st.br5]}
      />
      <VokeIcon
        name="play"
        size={40}
        style={[{ backgroundColor: 'rgba(255,255,255,0.75)' }]}
      />
    </Touchable>
  );
}

function renderVideoAndText(message) {
  if (!message || !message.content) return null;

  return (
    <Flex direction="column">
      <Flex value={1} direction="row" align="center" justify="start">
        {renderVideoImage(message)}
        {renderShareVideo(message)}
      </Flex>
      <Flex
        style={[st.ph4, st.pv5, st.br5, st.m5, st.mr1, st.ml0, st.bgWhite]}
        direction="row"
        align="center"
        justify="start"
      >
        <Text selectable={true} style={[st.fs16, st.lh(22), st.blue]}>
          {message.content}
        </Text>
      </Flex>
    </Flex>
  );
}

function renderShareVideo() {
  const SIZE = 55;
  return (
    <Touchable
      isAndroidOpacity={true}
      onPress={this.shareVideo}
      activeOpacity={0.6}
      style={[]}
    >
      <VokeIcon
        name="to-chat"
        type="image"
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
      />
    </Touchable>
  );
}

function renderVideo(message) {
  if (!message) return null;
  return (
    <Flex value={1} direction="row" align="center" justify={'start'}>
      {renderVideoImage(message)}
      {renderShareVideo(message)}
    </Flex>
  );
}

function NotificationItem({ item }) {
  const message = item;
  const isVideo = message.item && message.kind !== 'question';
  const isVideoAndText =
    message.item && message.content && message.kind !== 'question';
  const time = message.created_at;
  const momentTime = momentUtc(time)
    .local()
    .format('LL');
  const momentNow = moment()
    .local()
    .format('LL');
  const separatorTime = momentTime === momentNow ? 'today' : momentTime;
  if (message.kind === 'answer') return null;
  let content;
  if (isVideoAndText) {
    content = renderVideoAndText(message);
  } else if (isVideo) {
    content = renderVideo(message);
  } else {
    content = renderText(message);
  }

  return (
    <Flex
      direction="column"
      style={{ margin: 6 }}
      animation="fadeIn"
      align={'start'}
    >
      <Flex align="center" justify="center" style={[st.asc, st.pv5]}>
        <Text style={[st.fs12, st.white]}>{separatorTime}</Text>
      </Flex>
      <Flex direction="row" style={[st.mh6]}>
        <Flex self="end" style={[st.mb5]}>
          <VokeIcon
            name="vokebot_avatar"
            type="image"
            style={[st.w(25), st.h(25)]}
          />
        </Flex>
        <Flex
          self="end"
          style={[
            st.w(17),
            st.h(0),
            st.mb4,
            st.brWhite,
            st.btTransparent,
            st.pl6,
            {
              borderTopWidth: 10,
              borderRightWidth: 13,
            },
          ]}
        />
        {content}
        {/* <Flex
          self="end"
          style={[styles.triangle, !isVideo ? styles.vokeTriangle : null]}
        /> */}
      </Flex>
      <Flex align="end" justify="start" style={[st.mr1]}>
        <DateComponent
          style={[st.fs12, st.white]}
          date={message.created_at}
          format="h:mm A"
        />
      </Flex>
    </Flex>
  );
}

export default NotificationItem;
