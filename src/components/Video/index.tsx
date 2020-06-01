import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-native-youtube';
import RNVideo from 'react-native-video';
import Slider from '@react-native-community/slider';

import { View, useWindowDimensions, ImageBackground } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import st from '../../st';
import BackButton from '../BackButton';
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
  onPlay,
  hideBack = false,
  blockRotation = false,
  item,
  onCancel,
  hideInsets,
  autoPlay = false,
  fullscreen = false,
  fullscreenOrientation = 'all',
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
  ...rest
}) {
  // Don't even bother if there is no info about video provided.
  if (!item) {
    return <></>;
  }
  const insets = useSafeArea();
  const youtubeVideo = useRef();
  const arclightVideo = useRef();

  // System lock (android only).
  const [rotationLock, setRotationLock] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  });
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [screenOrientation, setScreenOrientation] = useState('portrait');

  function getLandscapeOrPortrait(orientation) {
    let newOrientation = screenOrientation;
    if (
      orientation === 'PORTRAIT' ||
      orientation === 'PORTRAIT-UPSIDEDOWN' // ot supported on iOS
    ) {
      newOrientation = 'portrait';
    } else if (
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT'
    ) {
      newOrientation = 'landscape';
    }
    // In all other cases (FACE-UP,FACE-DOWN,UNKNOWN) leave current value as is.
    setScreenOrientation( newOrientation );
    return newOrientation;
  }

  useMount(() => {
    if (!blockRotation) {
      Orientation.unlockAllOrientations();
      var initial = Orientation.getInitialOrientation();
      onOrientationChange(getLandscapeOrPortrait(initial));
      // Check if the system autolock is enabled or not (android only).
      // TODO: NOT WOKRING PROPERLY IN IOS.
      /* Orientation.getAutoRotateState( systemRotationLock =>
        setRotationLock(systemRotationLock),
      ); */
      Orientation.addOrientationListener(handleOrientationChange);
    }
    return function cleanup() {
      if (!blockRotation) {
        Orientation.removeOrientationListener(handleOrientationChange);
        Orientation.lockToPortrait();
      }
    };
  });

  // Events firing when user leaves the screen with player or comes back.
  useFocusEffect(
    // eslint-disable-next-line arrow-body-style
    React.useCallback(() => {
      // When the screen with player is focused:
      // - Do something here.
      return (): void => {
        // When the screen with a player is unfocused:
        // - Pause video.
        setIsPlaying(false);
      };
    }, [])
  );

  const handleOrientationChange = (orientation) => {
    const newOrientation = getLandscapeOrPortrait(orientation);
    if (newOrientation === 'landscape') {
      setDimensions({
        width: VIDEO_LANDSCAPE_WIDTH,
        height: VIDEO_LANDSCAPE_HEIGHT,
      });
    } else {
      setDimensions({ width: VIDEO_WIDTH, height: VIDEO_HEIGHT });
    }
    onOrientationChange(newOrientation);
  }

  function handleVideoStateChange(event) {
    if (event.state === 'paused') {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }

  function togglePlayState() {
    // Send an interaction when the user press play.
    if( !isPlaying ) {
      onPlay();
    }
    setIsPlaying(!isPlaying);
  }

  function handleSliderChange(value) {
    if (item?.type === 'youtube') {
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
          /* dimensions.height === VIDEO_HEIGHT && !hideInsets
            ? dimensions.height + insets.top
            : dimensions.height, */
          dimensions.height,
        ),
        // st.w(dimensions.width), - NOT WORKING RIGHT
        st.bgDeepBlack,
        {
          width: useWindowDimensions().width,
          // width: '100%',
          // paddingTop: -insets.top,
          /* paddingTop:
            dimensions.height === VIDEO_HEIGHT && !hideInsets ? insets.top : 0, */
        },
      ]}
    >
      { !isPlaying && sliderValue < 1 && <ImageBackground
        resizeMode="cover"
        source={{ uri: item.thumbnails.large }}
        style={[
          st.aic,
          st.jcc,
          st.bgBlack,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width:'100%',
            height: '100%',
            zIndex:1,
          }
        ]}
      ></ImageBackground>
      }
        {item?.type === 'youtube' ? (
          <YouTube
            ref={youtubeVideo}
            videoId={youtube_parser(item.url)}
            play={isPlaying}
            // loop={true}
            controls={2}
            onChangeState={e => handleVideoStateChange(e)}
            onError={e => setIsPlaying(false)}
            onProgress={e => setSliderValue(e.currentTime)}
            style={{
              // st.w(dimensions.width), NOT WORKING RIGHT
              width: useWindowDimensions().width,
              height: dimensions.height,
            }}
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
            onProgress={e => setSliderValue(e.currentTime)}
            style={{
              /* st.w(dimensions.width), NOT WORKING RIGHT */
              width: useWindowDimensions().width,
              height: dimensions.height,
            }}
            fullscreen={fullscreen}
            fullscreenOrientation={fullscreenOrientation}
          />
        )}
        <Flex
          direction="column"
          style={[st.absblr, st.bgTransparent, st.w100, st.h100, {
            zIndex:2,
          }]}
          self="stretch"
        >
          {onCancel ? (
            <View style={{zIndex:1}}>
              <BackButton onPress={onCancel} size={15} isClose={true} />
            </View>
          ) : null}
          {/* Custom overlay to be used instead of play/pause button. */}
          { children ? (
            <Touchable
              onPress={togglePlayState}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <View
                style={[
                  {
                    // Can't apply opacity to Touchable!
                    // https://stackoverflow.com/a/47984095/655381
                    opacity: isPlaying ? 0 : 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                  },
                ]}
              >
                <Flex align="center">{children}</Flex>
              </View>
            </Touchable>
          ) : (
            <>
              <Flex value={1} style={[]} justify="center" align="center">
                <Touchable
                  style={[st.f1, st.aic, st.jcc]}
                  onPress={togglePlayState}
                >
                  <VokeIcon
                    name={isPlaying ? 'pause' : 'play-circle'}
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
                    <VokeIcon name={isPlaying ? 'pause' : 'play-full'} size={20} />
                  </Touchable>
                </Flex>
                <Flex value={1}>
                  <Text style={[st.white, st.fs12]}>
                    {convertTime(sliderValue)}
                  </Text>
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
            </>
          )}
        </Flex>
    </View>
  );
}

export default Video;
