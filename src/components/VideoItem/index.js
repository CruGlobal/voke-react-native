import React from 'react';
import { View, ImageBackground } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Button from '../Button';
import Flex from '../Flex';
import Text from '../Text';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import { useNavigation } from '@react-navigation/native';

const THUMBNAIL_HEIGHT = ((st.fullWidth - 20) * 1) / 2;

function formatDuration(seconds) {
  if (!seconds) return '00:00';
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600);
  var mins = ~~((seconds % 3600) / 60);
  var secs = seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
}

function VideoItem({ item }) {
  const navigation = useNavigation();
  const video = item || {};

  const thumbnail = ((video.media || {}).thumbnails || {}).large || undefined;
  const description = (video.description || '').replace(/^\s+|\s+$/g, '');

  function handleShare() {
    navigation.navigate('AdventureName', {
      item,
      withGroup: false,
      isVideoInvite: true,
    });
  }
  return (
    <Touchable
      highlight={false}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('VideoDetails', { item })}
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
          <VokeIcon name="play" size={64} style={[st.bgTransparent]} />
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
                Shares {video.shares}
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
            isAndroidOpacity={true}
            onPress={handleShare}
            activeOpacity={0.6}
            touchableStyle={[st.abs, st.mh5, { right: 15, top: -35 }]}
          >
            <VokeIcon
              type="image"
              name="to-chat"
              style={{ width: 50, height: 50, borderRadius: 25 }}
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
