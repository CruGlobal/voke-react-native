import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactElement,
  MutableRefObject,
} from 'react';
import RNVideo from 'react-native-video';
// https://github.com/react-native-community/react-native-video#usage
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import Slider from '@react-native-community/slider';
import {
  View,
  useWindowDimensions,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount, youtubeParser, lockToPortrait } from 'utils';
import useInterval from 'utils/useInterval';
import st from 'utils/st';
import theme from 'utils/theme';
import { ui } from 'assets';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Touchable from 'components/Touchable';
import Text from 'components/Text';
import { TStep } from 'utils/types';
import useOrientation from 'hooks/useOrientation';

import BackButton from '../BackButton';
import { updateVideoIsPlayingState } from '../../actions/requests';

import styles from './styles';

function convertTime(time: number): string {
  const roundedTime = Math.round(time);
  const seconds = '00' + (roundedTime % 60);
  const minutes = '00' + Math.floor(roundedTime / 60);
  let str = `${minutes.substr(-2)}:${seconds.substr(-2)}`;
  if (time / 3600 >= 1) {
    str = `${Math.floor(time / 3600)}:${str}`;
  }
  return str;
}

interface RefYouTube {
  current: Record<string, unknown> | null;
  seekTo: (value: number) => void;
  getCurrentTime: () => Promise<void>;
}

interface RefArcLight {
  current: Record<string, unknown> | null;
  seek: (value: number) => void;
}

interface Props {
  onPlay?: (time: number) => void;
  onPause?: (time: number) => void;
  onStop?: (time: number) => void;
  item: TStep['item']['content'];
  onCancel?: () => void;
  autoPlay?: boolean;
  lockOrientation?: boolean;
  children?: React.ReactNode; // Used to create custom overlay/play button. Ex: "Watch Trailer".
}

function Video({
  onPlay = (): void => {
    //void
  },
  onPause = (): void => {
    //void
  },
  onStop = (): void => {
    //void
  },
  item,
  onCancel,
  autoPlay = false,
  lockOrientation = false,
  children, // Used to create custom overlay/play button. Ex: "Watch Trailer".
}: Props): ReactElement {
  const youtubeVideo = useRef<MutableRefObject<YoutubeIframeRef | null>>(null);
  const arclightVideo = useRef<RefArcLight>(null);

  const orientation = useOrientation();

  // System lock (android only).
  // const [rotationLock, setRotationLock] = useState(false);

  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const window = useWindowDimensions();
  const dispatch = useDispatch();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Update progress slider every second.
  useInterval(() => {
    if (!youtubeVideo.current) return;
    youtubeVideo.current.getCurrentTime().then((currentTime: void | number) => {
      setSliderValue(currentTime ? currentTime : 0);
    });
  }, refreshInterval);

  useEffect(() => {
    dispatch(updateVideoIsPlayingState(isPlaying));
    if (!youtubeVideo.current) return;
    setRefreshInterval(isPlaying ? 1000 : null);
  }, [dispatch, isPlaying]);

  const updateDimensions = useCallback(
    (newOrientation = orientation) => {
      const shortSize =
        window.width > window.height ? window.height : window.width;
      const longSize =
        window.width > window.height ? window.width : window.height;

      setWidth(newOrientation === 'portrait' ? shortSize : longSize);
      setHeight(newOrientation === 'portrait' ? shortSize / 1.75 : shortSize);
    },
    [orientation, window.height, window.width],
  );

  useEffect(() => {
    if (!lockOrientation) {
      updateDimensions(orientation);
    }
  }, [lockOrientation, orientation, updateDimensions]);

  useMount(() => {
    updateDimensions(orientation);

    if (lockOrientation) {
      lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }

    return function cleanup() {
      Orientation.lockToPortrait();
    };
  });
  // Events firing when user leaves the screen with player or comes back.
  useFocusEffect(
    React.useCallback(() => {
      // When the screen with player is focused:
      // - Do something here.
      return (): void => {
        // When the screen with a player is unfocused:
        // - Pause video.
        setIsPlaying(false);
      };
    }, []),
  );

  function handleVideoStateChange(event: string): void {
    switch (event) {
      case 'buffering':
        setIsBuffering(true);
        break;
      case 'paused':
        if (started && isPlaying && sliderValue <= item?.duration - 1) {
          // Send an interaction when the user press pause.
          onPause(sliderValue);
        }
        setIsPlaying(false);
        setIsBuffering(false);
        break;
      case 'play':
      case 'playing':
        setIsPlaying(true);
        setIsBuffering(false);
        if (!started) {
          setStarted(true);
        }
        if (event === 'play') {
          onPlay(sliderValue);
        }
        break;
      case 'ready':
        setVideoReady(true);
        // AUTOPLAY.
        if (!started && autoPlay) {
          handleVideoStateChange('play');
        }
        break;
      case 'ended':
        onStop(sliderValue);
        break;
      // default:
      // break;
    }
  }

  function togglePlayState(): void {
    handleVideoStateChange(isPlaying ? 'paused' : 'play');
  }

  function handleSliderChange(value: number): void {
    if (youtubeVideo.current) {
      youtubeVideo.current.seekTo(value);
    } else if (arclightVideo.current) {
      arclightVideo.current.seek(value);
    }
    setSliderValue(value);
  }

  // Don't even bother if there is no info about video provided.
  return !item ? (
    <></>
  ) : (
    <View
      style={{
        backgroundColor: '#000',
        overflow: 'hidden',
        width: width,
        height: height,
      }}
    >
      {item?.type === 'youtube' ? (
        <YoutubePlayer
          ref={youtubeVideo}
          useLocalHTML={true}
          videoId={youtubeParser(item?.url)}
          width={width}
          height={height}
          play={isPlaying}
          onChangeState={(state): void => {
            handleVideoStateChange(state as string);
          }}
          onReady={(): void => {
            handleVideoStateChange('ready');
          }}
          onError={(): void => {
            setIsPlaying(false);
          }}
          onPlaybackQualityChange={(q): void => console.log(q)}
          volume={100}
          initialPlayerParams={{
            controls: false,
            showClosedCaptions: false,
            modestbranding: true,
          }}
          webViewStyle={{
            width: width,
            height: height,
            opacity: videoReady ? 1 : 0,
          }}
        />
      ) : (
        <RNVideo
          ref={arclightVideo}
          source={{
            uri:
              item.hls.replace('http:', 'https:') ||
              item.url.replace('http:', 'https:'),
            type: item.hls ? 'm3u8' : undefined,
          }}
          onLoad={(): void => {
            handleVideoStateChange('ready');
          }}
          paused={!isPlaying}
          onProgress={(e): void => {
            if (e.currentTime !== sliderValue) {
              setSliderValue(e.currentTime);
            }
          }}
          onEnd={(): void => {
            if (sliderValue >= 1) {
              handleVideoStateChange('paused');
              setSliderValue(0);
              onStop(sliderValue);
            }
          }}
          onError={(e): void => {
            console.log('🆘 onError e:', e);
          }}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          // resizeMode="cover"
          repeat={true}
          style={{
            width: width,
            height: height,
          }}
          // fullscreen={false} // Platforms: iOS - Controls whether the player enters fullscreen on play.
          // fullscreenOrientation="landscape" // Platforms: iOS - all / landscape / portrait
        />
      )}
      {!isPlaying && (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: item?.thumbnails?.large }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.black,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )}
      <Flex
        direction="column"
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          width: '100%',
          top: 0,
          bottom: 0,
          zIndex: 2,
        }}
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
            <Flex value={1} justify="center" align="center">
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
              style={{
                paddingHorizontal: 10,
                backgroundColor:
                  item?.type === 'youtube'
                    ? 'rgba(0,0,0,1)'
                    : 'rgba(0,0,0,0.4)',
                opacity: isPlaying ? 0 : 1,
                minHeight: 50,
              }}
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
