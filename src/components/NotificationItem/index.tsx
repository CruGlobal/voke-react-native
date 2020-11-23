import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import theme from 'utils/theme';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import st from 'utils/st';
import { momentUtc } from 'utils';

import Image from '../Image';
import Flex from '../Flex';
import Text from '../Text';
import Touchable from '../Touchable';
import DateComponent from '../DateComponent';
import VokeIcon from '../VokeIcon';

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
      <Text selectable={true} style={[st.fs16, st.lh(22)]}>
        {notification.content}
      </Text>
    </Flex>
  );
}

function renderVideoImage(message, onSelectVideo) {
  const window = useWindowDimensions();
  const VIDEO_HEIGHT = ((window.width - 20) * 1) / 2;
  const thumbnail =
    ((((message || {}).item || {}).media || {}).thumbnails || {}).large ||
    undefined;
  return (
    <Touchable
      isAndroidOpacity={true}
      activeOpacity={0.7}
      onPress={() => onSelectVideo(message)}
      style={{
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        resizeMode="cover"
        source={{ uri: thumbnail }}
        style={[{ width: '100%' }, st.h(VIDEO_HEIGHT), st.br5]}
      />
      <VokeIcon
        name="play-full"
        size={40}
        style={[
          {
            color: 'rgba(255,255,255,0.75)',
          },
          st.abs,
        ]}
      />
    </Touchable>
  );
}

function renderVideoAndText(message, onSelectVideo, handleShare) {
  if (!message || !message.content) return null;

  return (
    <Flex direction="column" style={{ width: '100%' }}>
      <Flex
        direction="row"
        align="center"
        justify="start"
        style={{ width: '100%' }}
      >
        {renderVideoImage(message, onSelectVideo)}
        {renderShareVideo(handleShare)}
      </Flex>
      <Flex style={[st.ph4, st.pv5, st.br5, st.bgWhite]}>
        <Text selectable={true} style={[st.fs16, st.lh(22)]}>
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
      style={{
        position: 'absolute',
        right: SIZE * -0.5,
        width: SIZE * 1.25,
        height: SIZE * 1.25,
      }}
    >
      <VokeIcon
        name="to-chat"
        type="image"
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          color: theme.colors.white,
        }}
      />
    </Touchable>
  );
}

function renderVideo(message, onSelectVideo, handleShare) {
  if (!message) return null;
  return (
    <Flex value={1} direction="row" align="center" justify={'end'}>
      {renderVideoImage(message, onSelectVideo)}
      {renderShareVideo(handleShare)}
    </Flex>
  );
}

function NotificationItem({ item, onSelectVideo }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  function handleShare(): void {
    navigation.navigate('AdventureName', {
      item: item?.item,
      withGroup: false,
      isVideoInvite: true,
    });
  }
  const message = item;
  const isVideo = message.item && message.kind !== 'question';
  const isVideoAndText =
    message.item && message.content && message.kind !== 'question';
  const time = message.created_at;
  const momentTime = momentUtc(time).local().format('LL');
  const momentNow = moment().local().format('LL');
  const separatorTime = momentTime === momentNow ? t('today') : momentTime;
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
    <Flex direction="column" style={{}} align={'start'}>
      <Flex align="center" justify="center" style={[st.asc, st.pv5]}>
        <Text style={[st.fs12, st.white]}>{separatorTime}</Text>
      </Flex>
      <Flex
        direction="row"
        style={{
          width: '100%',
          paddingHorizontal: theme.spacing.m,
        }}
      >
        <Flex self="end" align="center" style={{}}>
          <Flex value={1} />
          <Flex style={{ paddingRight: 10 }}>
            <VokeIcon
              name="vokebot_avatar"
              type="image"
              style={[
                {
                  // position: 'absolute',
                },
                st.w(30),
                st.h(30),
                st.white,
              ]}
            />
          </Flex>
          <Flex
            self="end"
            style={[
              st.w(17),
              st.h(0),
              // st.mb4,
              st.brWhite,
              st.btTransparent,
              st.pl6,
              {
                marginTop: -10,
                borderTopWidth: 10,
                borderRightWidth: 13,
              },
            ]}
          />
          <Flex align="end" justify="start" style={[]}>
            <DateComponent
              style={[
                {
                  paddingTop: 10,
                  paddingRight: 6,
                },
                st.fs12,
                st.white,
              ]}
              date={message.created_at}
              format="h:mm A"
            />
          </Flex>
        </Flex>
        <Flex value={1}>{content}</Flex>
      </Flex>
    </Flex>
  );
}

export default NotificationItem;
