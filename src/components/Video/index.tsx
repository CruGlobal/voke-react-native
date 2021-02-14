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
import { useDispatch } from 'react-redux';
import { useMount, youtubeParser, lockToPortrait } from 'utils';
import useInterval from 'utils/useInterval';
import st from 'utils/st';
import theme from 'utils/theme';
import { ui } from 'assets';
import { TStep } from 'utils/types';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Touchable from 'components/Touchable';
import Text from 'components/Text';

import BackButton from '../BackButton';
import { updateVideoIsPlayingState } from '../../actions/requests';

import styles from './styles';

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

interface Props {
  onOrientationChange?: (orientation: string) => void;
  onPlay?: () => void;
  onStop?: () => void;
  hideBack?: boolean;
  item: TStep['item']['content'];
  onCancel?: () => void;
  hideInsets?: boolean;
  autoPlay?: boolean;
  lockOrientation?: boolean;
  children?: any; // Used to create custom overlay/play button. Ex: "Watch Trailer".
  containerStyles?: any;
  [x: string]: any;
}

function Video({
  onOrientationChange = (orientation: string) => {
    //void
  },
  onPlay = () => {},
  onStop = () => {},
  hideBack = false,
  item,
  onCancel,
  hideInsets,
  autoPlay = false,
  // fullscreenOrientation = 'all',
  lockOrientation = false,
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
  containerStyles = {},
  ...rest
}: Props) {
  // Don't even bother if there is no info about video provided.
  if (!item) {
    return <></>;
  }
  console.log( "🐸 item:", item );
  let youtubeVideo = useRef<RefYouTube>(null);
  let arclightVideo = useRef<RefArcLight>(null);
  const lockOrientationRef = useRef<boolean>(lockOrientation);

  // System lock (android only).
  // const [rotationLock, setRotationLock] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState<string>(
    'portrait',
  );
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenOrientation, setFullscreenOrientation] = useState(
    'landscape',
  );
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const window = useWindowDimensions();
  const dispatch = useDispatch();

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
    dispatch(updateVideoIsPlayingState(isPlaying));
    if (!youtubeVideo.current) return;
    setRefreshInterval(isPlaying ? 1000 : null);
  }, [isPlaying]);

  const getPlayerDimensions = () => {
    let shortSize = window.width;
    if (window.width > window.height) {
      shortSize = window.height;
    }
    const currentWidth = lockOrientation ? shortSize : window.width;

    return {
      width: currentWidth,
      height:
        !lockOrientation && screenOrientation === 'landscape'
          ? window.height
          : item?.type === 'youtube'
          ? currentWidth / 1.7
          : currentWidth / 1.7,
    };
  };

  function getLandscapeOrPortrait(orientation: string) {
    let newOrientation = screenOrientation;
    if (
      lockOrientationRef.current ||
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
    if (lockOrientation) {
      lockToPortrait();
    }

    if (autoPlay && !lockOrientation) {
      if (Platform.OS === 'ios') {
        Orientation.lockToAllOrientationsButUpsideDown(); // iOS only
      } else {
        Orientation.unlockAllOrientations();
      }
      const initial = Orientation.getInitialOrientation();
      onOrientationChange(getLandscapeOrPortrait(initial)); // TODO: Add delay here.
    } else {
      lockToPortrait();
      onOrientationChange('portrait');
    }

    /* if (Platform.OS === 'android' && Platform.Version < 26 ) { */
    if (Platform.OS === 'android') {
      // Only Device Orientation Listener works on older Android models.
      Orientation.addDeviceOrientationListener(handleOrientationChange);
    } else {
      Orientation.addOrientationListener(handleOrientationChange);
    }

    return function cleanup() {
      Orientation.removeOrientationListener(handleOrientationChange);
      Orientation.lockToPortrait();
    };
  });

  useEffect(() => {
    lockOrientationRef.current = lockOrientation;
    if (lockOrientation) {
      lockToPortrait();
      handleOrientationChange('PORTRAIT'); // Need for Android.
    } else {
      if (Platform.OS === 'ios') {
        Orientation.lockToAllOrientationsButUpsideDown(); // iOS only
      } else {
        Orientation.unlockAllOrientations();
      }

      Orientation.getOrientation(orientation => {
        onOrientationChange(getLandscapeOrPortrait(orientation));
      });
    }
  }, [lockOrientation]);

  useEffect(() => {
    if (screenOrientation === 'portrait') {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  }, [screenOrientation]);

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
    if (!lockOrientationRef.current) {
      onOrientationChange(getLandscapeOrPortrait(orientation));
    } else {
      onOrientationChange(getLandscapeOrPortrait('PORTRAIT'));
    }
  };

  function handleVideoStateChange(event: string) {
    switch (event) {
      case 'buffering':
        setIsBuffering(true);
        break;
      case 'paused':
        setIsPlaying(false);
        setIsBuffering(false);
        if (started) {
          // Send an interaction when the user press pause.
          onStop();
        }
        break;
      case 'play':
      case 'playing':
        setIsPlaying(true);
        setIsBuffering(false);
        if (!started) {
          setStarted(true);
        }
        onPlay();
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
          width: getPlayerDimensions().width,
          height: getPlayerDimensions().height,
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
          videoId={youtubeParser(item?.url)}
          width={getPlayerDimensions().width}
          height={getPlayerDimensions().height}
          play={isPlaying}
          onChangeState={(state): void => {
            handleVideoStateChange(state);
          }}
          onReady={(): void => {
            handleVideoStateChange('ready');
          }}
          onError={(e): void => {
            setIsPlaying(false);
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
            width: getPlayerDimensions().width,
            height: getPlayerDimensions().height,
            opacity: videoReady ? 1 : 0,
          }}
        />
      ) : (
        <RNVideo
          ref={arclightVideo}
          source={{
            uri: item.hls.replace('http:', 'https:') || item.url.replace('http:', 'https:'),
            type: item.hls ? 'm3u8' : undefined,
          }}
          onLoad={e => {
            handleVideoStateChange('ready');
          }}
          paused={!isPlaying}
          onProgress={e => {
            if (e.currentTime !== sliderValue) {
              setSliderValue(e.currentTime);
            }
          }}
          onEnd={e => {
            if (sliderValue >= 1) {
              handleVideoStateChange('paused');
              setSliderValue(0);
            }
          }}
          onError={e => {
            console.log('🆘 onError e:', e);
          }}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          // resizeMode="cover"
          repeat={true}
          style={{
            position: 'absolute',
            top:
              screenOrientation === 'portrait' || lockOrientation
                ? getPlayerDimensions().width / -10 // Small video (Portrait)
                : getPlayerDimensions().width / -20, // Fullscreen video.
            bottom:
              screenOrientation === 'portrait' || lockOrientation
                ? getPlayerDimensions().width / -10 // Small video (Portrait)
                : getPlayerDimensions().width / -20, // Fullscreen video.
            left:
              screenOrientation === 'portrait' || lockOrientation
                ? 0 // Small video (Portrait)
                : getPlayerDimensions().width / -20, // Fullscreen video.
            right:
              screenOrientation === 'portrait' || lockOrientation
                ? 0 // Small video (Portrait)
                : getPlayerDimensions().width / -20, // Fullscreen video.
          }}
          // fullscreen={false} // Platforms: iOS - Controls whether the player enters fullscreen on play.
          fullscreenOrientation={fullscreenOrientation} // Platforms: iOS - all / landscape / portrait
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
                    style={isPlaying ? styles.iconPlay : styles.iconPause}
                    testID="ctaPlayerPlay"
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
                    style={styles.icon}
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
                    Platform.OS === 'android' ? undefined : ui.videoSlider
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
        {onCancel ? (
          <BackButton
            onPress={onCancel}
            size={18}
            isClose={true}
            style={{ zIndex: 99 }}
          />
        ) : null}
      </Flex>
    </View>
  );
}

export default Video;
