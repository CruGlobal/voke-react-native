import React, { useState, useRef, useEffect } from 'react';
import RNVideo from 'react-native-video';
// https://github.com/react-native-community/react-native-video#usage
import YoutubePlayer from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import {
  View,
  useWindowDimensions,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';

import BackButton from '../BackButton';
import { useMount, youtube_parser, lockToPortrait } from '../../utils';
import useInterval from '../../utils/useInterval';
import {
  VIDEO_HEIGHT,
  VIDEO_LANDSCAPE_HEIGHT,
  VIDEO_LANDSCAPE_WIDTH,
} from '../../constants';
import st from '../../st';
import theme from '../../theme';
import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import SLIDER_THUMB from '../../assets/sliderThumb.png';

function convertTime(time): string {
  const roundedTime = Math.round(time);
  const seconds = '00' + (roundedTime % 60);
  const minutes = '00' + Math.floor(roundedTime / 60);
  let hours = '';
  let str = `${minutes.substr(-2)}:${seconds.substr(-2)}`;
  if (time / 3600 >= 1) {
    hours = Math.floor(time / 3600);
    str = `${hours}:${str}`;
  }
  return str;
}

interface RefYouTube {
  current: object | null;
  seekTo: (value: number) => void;
  getCurrentTime: () => Promise<void>;
}

interface RefArcLight {
  current: object | null;
  seek: (value: number) => void;
}

function Video({
  onOrientationChange = () => {},
  onPlay = () => {},
  hideBack = false,
  item,
  onCancel,
  hideInsets,
  autoPlay = false,
  fullscreen = false,
  fullscreenOrientation = 'all',
  lockOrientation = false,
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
  containerStyles = {},
  ...rest
}) {
  // Don't even bother if there is no info about video provided.
  if (!item) {
    return <></>;
  }
  let youtubeVideo = useRef<RefYouTube>(null);
  let arclightVideo = useRef<RefArcLight>(null);

  // System lock (android only).
  // const [rotationLock, setRotationLock] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState<string>(
    'portrait',
  );
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const window = useWindowDimensions();

  // const time = youtubeVideo.current.getCurrentTime();
  // const duration = youtubeVideo.current.getDuration();

  // Update progress slider every second.
  useInterval(() => {
    if (!youtubeVideo.current) return;
    youtubeVideo.current.getCurrentTime().then((currentTime: void | number) => {
      setCurrentTime(currentTime ? currentTime : 0);
      setSliderValue(currentTime ? currentTime : 0);
    });
  }, refreshInterval);

  useEffect(() => {
    if (!youtubeVideo.current) return;
    setRefreshInterval(isPlaying ? 1000 : null);
  }, [isPlaying]);

  const getDimensions = () => {
    return {
      width: window.width,
      height:
        item?.type === 'youtube' ? window.width / 1.7 : window.width / 1.8,
    };
  };

  function getLandscapeOrPortrait(orientation: string) {
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
    setScreenOrientation(newOrientation);
    return newOrientation;
  }

  useMount(() => {
    Orientation.unlockAllOrientations();
    const initial = Orientation.getInitialOrientation();
    onOrientationChange(getLandscapeOrPortrait(initial));
    // Check if the system autolock is enabled or not (android only).
    // TODO: NOT WOKRING PROPERLY IN IOS.
    /* Orientation.getAutoRotateState( systemRotationLock =>
      setRotationLock(systemRotationLock),
    ); */
    // Orientation.addOrientationListener(handleOrientationChange);
    Orientation.addDeviceOrientationListener(handleOrientationChange);

    if (lockOrientation) {
      lockToPortrait();
    }

    return function cleanup() {
      Orientation.removeOrientationListener(handleOrientationChange);
      Orientation.lockToPortrait();
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
        youtubeVideo = null;
        arclightVideo = null;
      };
    }, []),
  );

  const handleOrientationChange = (orientation: OrientationType): void => {
    onOrientationChange(getLandscapeOrPortrait(orientation));
  };

  function handleVideoStateChange(event: string) {
    switch (event) {
      case 'buffering':
        setIsBuffering(true);
        break;
      case 'paused':
        setIsPlaying(false);
        setIsBuffering(false);
        break;
      case 'play':
      case 'playing':
        setIsPlaying(true);
        setIsBuffering(false);
        if (!started) {
          setStarted(true);
          // Send an interaction when the user press play.
          onPlay();
        }
        break;
      case 'ready':
        setVideoReady(true);
        // AUTOPLAY.
        if (!started && autoPlay) {
          handleVideoStateChange('play');
        }
        break;
      // default:
      // break;
    }
  }

  function togglePlayState() {
    handleVideoStateChange(isPlaying ? 'paused' : 'play');
  }

  function handleSliderChange(value: number) {
    if (youtubeVideo.current) {
      youtubeVideo.current.seekTo(value);
    } else if (arclightVideo.current) {
      arclightVideo.current.seek(value);
    }
    setSliderValue(value);
  }

  return (
    <View
      style={[
        /*  st.h(
         dimensions.height === VIDEO_HEIGHT && !hideInsets
            ? dimensions.height + insets.top
            : dimensions.height, 

        ), */
        // st.w(dimensions.width), - NOT WORKING RIGHT
        st.bgDeepBlack,
        {
          ...containerStyles,
          overflow: 'hidden',
          width: window.width,
          height:
            screenOrientation === 'portrait'
              ? getDimensions().height
              : window.height,
          // width: '100%',
          // paddingTop: topInset,
          // marginTop: item?.type === 'youtube' ? 0 : -20
          /* paddingTop:
            dimensions.height === VIDEO_HEIGHT && !hideInsets ? insets.top : 0, */
        },
      ]}
    >
      {!started && (
        // || !isPlaying && ( sliderValue < 1 || sliderValue >= item.duration )
        // || isPlaying && sliderValue < .05
        <ImageBackground
          resizeMode="cover"
          source={{ uri: item.thumbnails.large }}
          style={[
            st.aic,
            st.jcc,
            st.bgDeepBlack,
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            },
          ]}
        />
      )}
      {item?.type === 'youtube' ? (
        <YoutubePlayer
          ref={youtubeVideo}
          videoId={youtube_parser(item?.url)}
          width={window.width}
          height={getDimensions().height}
          play={isPlaying}
          onChangeState={(state): void => {
            handleVideoStateChange(state);
          }}
          onReady={(): void => {
            handleVideoStateChange('ready');
          }}
          onError={(e): void => {
            setIsPlaying(false);
            console.log('🐸 YouTube player error:', e);
          }}
          onPlaybackQualityChange={(q): void => console.log(q)}
          onEnd={(): void => {
            console.log('Player -> onEnd');
          }}
          volume={100}
          initialPlayerParams={{
            controls: false,
            showClosedCaptions: false,
            modestbranding: true,
          }}
          webViewStyle={{
            width: window.width,
            height: getDimensions().height,
            opacity: videoReady ? 1 : 0,
          }}
        />
      ) : (
        <RNVideo
          ref={arclightVideo}
          source={{
            uri: item.hls || item.url,
            type: item.hls ? 'm3u8' : undefined,
          }}
          onLoad={e => {
            console.log('🐸 onLoad:', e);
            handleVideoStateChange('ready');
          }}
          paused={!isPlaying}
          onProgress={e => {
            if (e.currentTime !== sliderValue) {
              setSliderValue(e.currentTime);
            }
          }}
          onEnd={e => {
            console.log('🐸 onEnd:', e);
            if (sliderValue >= 1) {
              handleVideoStateChange('paused');
              setSliderValue(0);
            }
          }}
          onBuffer={e => {}} // Callback when remote video is buffering
          onError={e => {}}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          resizeMode="cover"
          repeat={true}
          style={{
            position: 'absolute',
            top: screenOrientation === 'portrait' ? window.width / -9 : 0,
            bottom: screenOrientation === 'portrait' ? window.width / -9 : 0,
            left: 0,
            right: 0,
          }}
          fullscreen={fullscreen}
          fullscreenOrientation={fullscreenOrientation}
        />
      )}
      <Flex
        direction="column"
        style={[
          st.absblr,
          st.bgTransparent,
          st.w100,
          {
            top: 0,
            bottom: 0,
            zIndex: 2,
          },
        ]}
        self="stretch"
      >
        {onCancel ? (
          <BackButton
            onPress={onCancel}
            size={18}
            isClose={true}
            style={{ zIndex: 99 }}
          />
        ) : null}
        {/* Custom overlay to be used instead of play/pause button. */}
        {children ? (
          <Touchable
            onPress={togglePlayState}
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              zIndex: 10,
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
                  top: 0,
                  bottom: 0,
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
                isAndroidOpacity
                style={[
                  st.f1,
                  st.aic,
                  {
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    zIndex: 10,
                  },
                ]}
                onPress={togglePlayState}
              >
                {!videoReady || (isBuffering && !started) ? (
                  <ActivityIndicator
                    size="large"
                    color="rgba(255,255,255,0.6)"
                  />
                ) : (
                  <VokeIcon
                    name={isPlaying ? 'pause' : 'play-circle'}
                    size={50}
                    style={{
                      marginTop: 25,
                      color: isPlaying
                        ? st.colors.transparent
                        : 'rgba(255,255,255,0.6)',
                    }}
                  />
                )}
              </Touchable>
            </Flex>
            <Flex
              direction="row"
              justify="between"
              align="center"
              style={[
                st.ph5,
                {
                  backgroundColor:
                    item?.type === 'youtube'
                      ? 'rgba(0,0,0,1)'
                      : 'rgba(0,0,0,0.4)',
                  opacity: isPlaying ? 0 : 1,
                  minHeight: 50,
                },
              ]}
            >
              <Flex value={1}>
                <Touchable onPress={togglePlayState}>
                  <VokeIcon
                    name={isPlaying ? 'pause' : 'play-full'}
                    size={20}
                    style={{color: theme.colors.white}}
                  />
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
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={st.colors.lightGrey}
                  onValueChange={(value: number): void =>
                    handleSliderChange(value)
                  }
                  value={sliderValue}
                  style={{
                    marginRight: 15,
                  }}
                  thumbTintColor={
                    Platform.OS === 'android' ? theme.colors.primary : undefined
                  }
                  thumbImage={
                    Platform.OS === 'android' ? undefined : SLIDER_THUMB
                  }
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
