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
import { useNavigation } from '@react-navigation/native';

function renderText(item) {
  const notification = item;

  if (!notification || !notification.content) return null;
  return (
    <Flex
      style={[st.ph4, st.pv5, st.br5, st.ml0, st.bgWhite]}
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

function renderVideoImage(message, onSelectVideo) {
  const thumbnail =
    ((((message || {}).item || {}).media || {}).thumbnails || {}).large ||
    undefined;
  return (
    <Touchable
      isAndroidOpacity={true}
      activeOpacity={0.7}
      onPress={() => onSelectVideo(message)}
      style={[st.aic, st.jcc]}
    >
      <Image
        resizeMode="cover"
        source={{ uri: thumbnail }}
        style={[st.w(VIDEO_WIDTH * 0.7), st.h(VIDEO_HEIGHT * 0.7), st.br5]}
      />
      <VokeIcon
        name="play"
        size={40}
        style={[{ color: 'rgba(255,255,255,0.75)' }, st.abs]}
      />
    </Touchable>
  );
}

function renderVideoAndText(message, onSelectVideo, handleShare) {
  if (!message || !message.content) return null;

  return (
    <Flex direction="column" style={[st.w(st.fullWidth - 80)]}>
      <Flex direction="row" align="center" justify="start">
        {renderVideoImage(message, onSelectVideo)}
        {renderShareVideo(handleShare)}
      </Flex>
      <Flex style={[st.ph4, st.pv5, st.br5, st.m5, st.ml0, st.bgWhite]}>
        <Text selectable={true} style={[st.fs16, st.lh(22), st.blue]}>
          {message.content}
        </Text>
      </Flex>
    </Flex>
  );
}

function renderShareVideo(handleShare) {
  const SIZE = 55;
  return (
    <Touchable
      isAndroidOpacity={true}
      onPress={handleShare}
      activeOpacity={0.6}
      style={[st.ml5]}
    >
      <VokeIcon
        name="to-chat"
        type="image"
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
      />
    </Touchable>
  );
}

function renderVideo(message, onSelectVideo, handleShare) {
  if (!message) return null;
  return (
    <Flex value={1} direction="row" align="center" justify={'start'}>
      {renderVideoImage(message, onSelectVideo)}
      {renderShareVideo(handleShare)}
    </Flex>
  );
}

function NotificationItem({ item, onSelectVideo }) {
  const navigation = useNavigation();
  function handleShare() {
    navigation.navigate('NameAdventureModal', {
      item,
      withGroup: false,
      isVideoInvite: true,
    });
  }
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
    content = renderVideoAndText(message, onSelectVideo, handleShare);
  } else if (isVideo) {
    content = renderVideo(message, onSelectVideo, handleShare);
  } else {
    content = renderText(message);
  }

  return (
    <Flex direction="column" style={{ margin: 6 }} align={'start'}>
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
      </Flex>
      <Flex align="end" justify="start" style={[]}>
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
