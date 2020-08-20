import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Image from '../Image';
import st from '../../st';
import theme from '../../theme';
import Button from '../Button';
import Flex from '../Flex';
import Text from '../Text';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';

const THUMBNAIL_HEIGHT = ((st.fullWidth - 20) * 1) / 2;

function formatDuration(seconds) {
  if (!seconds) return '00:00';
  // Hours, minutes and seconds
  const hrs = ~~(seconds / 3600);
  const mins = ~~((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`;
  }

  ret += `${mins}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
}

function VideoItem({ id = null, category = 'allVideos' }) {
  if (!id) return <></>;
  const navigation = useNavigation();
  const { t } = useTranslation('videos');
  const video = useSelector(({ data }: any) => data[category].byId[id]) || {};
  if (Object.keys(video).length === 0) return <></>;
  const thumbnail = ((video.media || {}).thumbnails || {}).large || undefined;
  const description = (video.description || '').replace(/^\s+|\s+$/g, '');

  function handleShare() {
    navigation.navigate('AdventureName', {
      item: video,
      withGroup: false,
      isVideoInvite: true,
    });
  }
  return (
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('VideoDetails', { item: video })}
    >
      <Flex
        style={[st.bgWhite, st.mv5, st.mh5]}
        direction="column"
        align="start"
        justify="center"
        animation="slideInUp"
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: thumbnail }}
          style={[
            st.aic,
            st.jcc,
            st.h(THUMBNAIL_HEIGHT),
            st.w(st.fullWidth - 20),
            st.bgBlack,
          ]}
        >
          <VokeIcon
            name="play-full"
            size={64}
            style={[st.bgTransparent, st.white]}
          />
          <Flex
            direction="row"
            align="center"
            justify="center"
            style={[
              st.h(20),
              st.w100,
              st.absblr,
              { backgroundColor: 'rgba(0,0,0,0.6)' },
            ]}
          >
            <Flex value={1} align="start">
              <Text style={[st.fs10, st.white, st.ph5]}>
                {formatDuration(video.media.duration)}
              </Text>
            </Flex>
            <Flex value={2} align="end">
              <Text
                numberOfLines={1}
                style={[st.fs10, st.white, st.ph5, { paddingRight: 100 }]}
              >
                {t('shares', { total: video.shares })}
              </Text>
            </Flex>
          </Flex>
        </ImageBackground>
        <Flex
          direction="column"
          align="start"
          justify="start"
          style={[st.h(100), st.p5, st.w100]}
        >
          <Button
            type="transparent"
            isAndroidOpacity
            onPress={handleShare}
            activeOpacity={0.6}
            touchableStyle={[st.abs, st.mh5, { right: 15, top: -35 }]}
          >
            <VokeIcon
              type="image"
              name="to-chat"
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                color: theme.colors.white,
              }}
            />
          </Button>
          <Text numberOfLines={1} style={[st.blue, st.fs20]}>
            {video.name}
          </Text>
          <Text numberOfLines={2} style={[st.black, st.fs16]}>
            {description}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  );
}

export default VideoItem;
