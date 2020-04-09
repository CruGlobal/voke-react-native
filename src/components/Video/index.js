import React, { useState, useRef } from 'react';
import YouTube from 'react-native-youtube';
import RNVideo from 'react-native-video';
import Slider from '@react-native-community/slider';

import { View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import st from '../../st';
import ModalBackButton from '../ModalBackButton';
import { useMount, youtube_parser } from '../../utils';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_LANDSCAPE_HEIGHT,
  VIDEO_LANDSCAPE_WIDTH,
} from '../../constants';
import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import SLIDER_THUMB from '../../assets/sliderThumb.png';

function convertTime(time) {
  const roundedTime = Math.round(time);
  let seconds = '00' + (roundedTime % 60);
  let minutes = '00' + Math.floor(roundedTime / 60);
  let hours = '';
  let str = `${minutes.substr(-2)}:${seconds.substr(-2)}`;
  if (time / 3600 >= 1) {
    hours = Math.floor(time / 3600);
    str = `${hours}:${str}`;
  }
  return str;
}

function Video({
  onOrientationChange,
  hideBack = false,
  blockRotation = false,
  item,
  onCancel,
  hideInsets,
  ...rest
}) {
  const insets = useSafeArea();
  const youtubeVideo = useRef();
  const arclightVideo = useRef();

  const [rotationLock, setRotationLock] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  });
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  function getLandscapeOrPortrait(orientation) {
    if (orientation !== 'PORTRAIT' && orientation !== 'UNKNOWN') {
      return 'landscape';
    }
    return 'portrait';
  }

  useMount(() => {
    if (!blockRotation) {
      Orientation.unlockAllOrientations();
      var initial = Orientation.getInitialOrientation();
      onOrientationChange(getLandscapeOrPortrait(initial));
      Orientation.getAutoRotateState(rotationLock =>
        setRotationLock(rotationLock),
      );
      Orientation.addOrientationListener(handleOrientationChange);
    }
    return function cleanup() {
      if (!blockRotation) {
        Orientation.removeOrientationListener(handleOrientationChange);
        Orientation.lockToPortrait();
      }
    };
  });

  function handleOrientationChange(orientation) {
    if (rotationLock) {
      return;
    }
    if (orientation !== 'PORTRAIT' && orientation !== 'UNKNOWN') {
      setDimensions({
        width: VIDEO_LANDSCAPE_WIDTH,
        height: VIDEO_LANDSCAPE_HEIGHT,
      });
    } else {
      setDimensions({ width: VIDEO_WIDTH, height: VIDEO_HEIGHT });
    }
    onOrientationChange(getLandscapeOrPortrait(orientation));
  }

  function handleVideoStateChange(event) {
    if (event.state === 'playing') {
      setIsPlaying(true);
    }
    if (event.state === 'paused') {
      setIsPlaying(false);
    }
  }

  function togglePlayState() {
    setIsPlaying(!isPlaying);
  }

  function handleSliderChange(value) {
    if (item.type === 'youtube') {
      youtubeVideo.current.seekTo(value);
    } else {
      arclightVideo.current.seek(value);
    }
    setSliderValue(value);
  }

  return (
    <View
      style={[
        st.h(
          dimensions.height === VIDEO_HEIGHT && !hideInsets
            ? dimensions.height + insets.top
            : dimensions.height,
        ),
        st.w(dimensions.width),
        st.bgDeepBlack,
        {
          paddingTop:
            dimensions.height === VIDEO_HEIGHT && !hideInsets ? insets.top : 0,
        },
      ]}
    >
      {item.type === 'youtube' ? (
        <YouTube
          ref={youtubeVideo}
          videoId={youtube_parser(item.url)}
          play={isPlaying}
          // loop={true}
          controls={2}
          onChangeState={e => handleVideoStateChange(e)}
          onError={e => setIsPlaying(false)}
          onProgress={e => setSliderValue(e.currentTime)}
          style={[
            st.h(
              dimensions.height === VIDEO_HEIGHT
                ? dimensions.height + insets.top
                : dimensions.height,
            ),
            st.w(dimensions.width),
          ]}
        />
      ) : (
        <RNVideo
          ref={arclightVideo}
          source={{
            uri: item.hls || item.url,
            type: !!item.hls ? 'm3u8' : undefined,
          }}
          paused={!isPlaying}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          style={[
            st.h(
              dimensions.height === VIDEO_HEIGHT
                ? dimensions.height + insets.top
                : dimensions.height,
            ),
            st.w(dimensions.width),
          ]}
        />
      )}
      <Flex
        direction="column"
        style={[st.absblr, st.bgTransparent, st.w100, st.h100]}
        self="stretch"
      >
        {hideBack ? null : (
          <View style={[]}>
            <ModalBackButton />
          </View>
        )}
        {onCancel ? (
          <View style={[]}>
            <ModalBackButton onPress={onCancel} size={15} isClose={true} />
          </View>
        ) : null}
        <Flex value={1} style={[]} justify="center" align="center">
          <Touchable style={[st.f1, st.aic, st.jcc]} onPress={togglePlayState}>
            <VokeIcon
              name={isPlaying ? 'pause' : 'play'}
              size={50}
              style={[
                {
                  color: isPlaying
                    ? st.colors.transparent
                    : 'rgba(255,255,255,0.6)',
                },
              ]}
            />
          </Touchable>
        </Flex>
        <Flex
          direction="row"
          justify="between"
          align="center"
          style={[st.ph5, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
        >
          <Flex value={1}>
            <Touchable onPress={togglePlayState}>
              <VokeIcon name={isPlaying ? 'pause' : 'play'} size={20} />
            </Touchable>
          </Flex>
          <Flex value={1}>
            <Text style={[st.white, st.fs12]}>{convertTime(sliderValue)}</Text>
          </Flex>
          <Flex value={5}>
            <Slider
              minimumValue={0}
              maximumValue={item.duration}
              step={1}
              minimumTrackTintColor={st.colors.blue}
              maximumTrackTintColor={st.colors.lightGrey}
              onValueChange={value => handleSliderChange(value)}
              value={sliderValue}
              style={[st.mr4]}
              thumbImage={SLIDER_THUMB}
            />
          </Flex>
          <Flex value={1}>
            <Text style={[st.white, st.fs12]}>
              {convertTime(item.duration)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
}

export default Video;