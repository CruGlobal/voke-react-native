import React, { Component } from 'react';
import { Dimensions, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import debounce from 'lodash/debounce';
import Orientation from 'react-native-orientation';

import {
  navigateBack,
  navigatePush,
  navigateResetHome,
} from '../../actions/nav';
import { toastAction, shareVideo } from '../../actions/auth';
import { createVideoInteraction } from '../../actions/videos';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import StatusBar from '../../components/StatusBar';
import webviewStates from '../../components/WebviewVideo/common';
import { VokeIcon, Flex, Touchable, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VideoDetailsContent from '../VideoDetailsContent';
import OrgJourneyDetail from '../OrgJourneyDetail';
import JourneyDetail from '../JourneyDetail';
import JourneyStepDetail from '../JourneyStepDetail';
import st from '../../st';
import theme from '../../theme';
import FloatingButtonSingle from '../../components/FloatingButtonSingle';
import { isAndroid } from '../../constants';

export const VIDEO_CONTENT_TYPES = {
  VIDEODETAIL: 'VIDEODETAIL',
  ORGJOURNEY: 'ORGJOURNEY',
  JOURNEYDETAIL: 'JOURNEYDETAIL',
  JOURNEYSTEPDETAIL: 'JOURNEYSTEPDETAIL',
};

// Keep track of states that we want to make an API call if they happen
const INTERACTION_STATES = [
  webviewStates.STARTED,
  webviewStates.PAUSED,
  webviewStates.RESUMED,
  webviewStates.FINISHED,
];

const TYPE_CONFIGS = {
  [VIDEO_CONTENT_TYPES.VIDEODETAIL]: {
    topColor: st.bgDeepBlack,
    bgColor: st.bgWhite,
  },
  [VIDEO_CONTENT_TYPES.ORGJOURNEY]: {
    videoProps: { forceNoAutoPlay: true },
    topColor: st.bgDeepBlack,
    bgColor: st.bgBlue,
  },
  [VIDEO_CONTENT_TYPES.JOURNEYDETAIL]: {
    videoProps: { forceNoAutoPlay: true },
    topColor: st.bgDeepBlack,
    bgColor: st.bgBlue,
  },
  [VIDEO_CONTENT_TYPES.JOURNEYSTEPDETAIL]: {
    videoProps: { forceNoAutoPlay: true },
    topColor: st.bgDeepBlack,
    bgColor: st.bgBlue,
  },
};

function getVideoType(item) {
  const media =
    (item.media
      ? item.media
      : item.item && item.item.content
      ? item.item.content
      : {}) || {};
  return media.type;
}

class VideoContentWrap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLandscape: false,
      showVideo: false,
    };

    this.orientationDidChange = debounce(
      this.orientationDidChange.bind(this),
      50,
    );
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.

    // Run getInitial and getOrientations
    const initial = Orientation.getInitialOrientation();
    this.orientationDidChange(initial);
    this.checkOrientation();
  }

  componentDidMount() {
    this.toggleOrientation();
    // This doesn't work on Android...because of the navigation stuff
    Orientation.addOrientationListener(this.orientationDidChange);

    // Android is having issues with the orientation stuff, use this workaround
    if (theme.isAndroid) {
      Dimensions.addEventListener('change', ({ window: { width, height } }) => {
        const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        if (this.state.isLandscape && orientation !== 'LANDSCAPE') {
          this.orientationDidChange(orientation);
        } else if (!this.state.isLandscape && orientation !== 'PORTRAIT') {
          this.orientationDidChange(orientation);
        }
      });
    }

    setTimeout(() => {
      this.setState({ showVideo: true }, () => {
        // For iOS margin
        this.webview &&
          this.webview.getWrappedInstance &&
          this.webview.getWrappedInstance() &&
          this.webview.getWrappedInstance().removeMargin &&
          this.webview.getWrappedInstance().removeMargin();
      });
    }, 1000);

    // Check that the interval is correct every few seconds to fix it if it get's messed up.
    this.orientationInterval = setInterval(this.checkOrientation, 3000);
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(this.orientationDidChange);
    clearTimeout(this.orientationInterval);
  }

  checkOrientation = () => {
    Orientation.getOrientation((err, orientation) => {
      this.orientationDidChange(orientation);
    });
  };

  orientationDidChange(orientation) {
    if (getVideoType(this.props.item) === 'vimeo') {
      return;
    }
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      // LOG('landscape');
      if (!this.state.isLandscape) {
        this.setState({ isLandscape: true });
      }
    } else if (orientation === 'PORTRAIT') {
      // LOG('portrait');
      // do something with portrait layout
      if (this.state.isLandscape) {
        this.setState({ isLandscape: false });
      }
    }
  }

  toggleOrientation() {
    if (getVideoType(this.props.item) === 'vimeo') {
      Orientation.lockToPortrait();
    } else {
      Orientation.unlockAllOrientations();
    }
  }

  setCustomRender = item => this.setState({ customRender: item });

  handleShare = () => {
    const { conversation, onSelectVideo, me, dispatch, item } = this.props;

    Orientation.lockToPortrait();
    // This logic exists in the VideoDetails and the VideoList
    if (onSelectVideo) {
      dispatch(shareVideo(item, onSelectVideo, conversation));
    } else {
      this.pause();
      if (!me.first_name) {
        dispatch(
          navigatePush('voke.TryItNowName', {
            onComplete: () =>
              dispatch(
                navigatePush('voke.ShareFlow', {
                  video: item,
                }),
              ),
          }),
        );
      } else {
        dispatch(
          navigatePush('voke.ShareFlow', {
            video: item,
          }),
        );
      }
    }
  };

  handleVideoChange = videoState => {
    const { t, dispatch, type, item } = this.props;
    if (videoState === webviewStates.ERROR) {
      dispatch(toastAction(t('error.playingVideo')));
    }

    if (INTERACTION_STATES.includes(videoState)) {
      let id;
      let action = '';

      if (type === VIDEO_CONTENT_TYPES.VIDEODETAIL) {
        id = item.id;
      } else {
        id = item.item.id;
      }

      if (videoState === webviewStates.STARTED) {
        action = 'started';
      }
      if (videoState === webviewStates.PAUSED) {
        action = 'paused';
      }
      if (videoState === webviewStates.RESUMED) {
        action = 'resumed';
      }
      if (videoState === webviewStates.FINISHED) {
        action = 'finished';
      }
      dispatch(createVideoInteraction(id, action));
    }
  };

  pause = () => {
    if (
      this.webview &&
      this.webview.getWrappedInstance &&
      this.webview.getWrappedInstance() &&
      this.webview.getWrappedInstance().pause
    ) {
      this.webview.getWrappedInstance().pause();
    }
  };

  play = () => {
    if (
      this.webview &&
      this.webview.getWrappedInstance &&
      this.webview.getWrappedInstance() &&
      this.webview.getWrappedInstance().play
    ) {
      this.webview.getWrappedInstance().play();
    }
  };

  scrollToEnd = () => {
    setTimeout(() => this.scrollRef.props.scrollToEnd(), 10);
  };

  renderContent() {
    const { type, item, navToStep, inviteName, ...rest } = this.props;
    const allProps = {
      item,
      onPause: this.pause,
      onPlay: this.play,
      setCustomRender: this.setCustomRender,
      scrollToEnd: this.scrollToEnd,
      ...rest,
    };
    if (type === VIDEO_CONTENT_TYPES.VIDEODETAIL) {
      return <VideoDetailsContent video={item} {...allProps} />;
    }
    if (type === VIDEO_CONTENT_TYPES.ORGJOURNEY) {
      return <OrgJourneyDetail {...allProps} />;
    }
    if (type === VIDEO_CONTENT_TYPES.JOURNEYDETAIL) {
      return (
        <JourneyDetail
          navToStep={navToStep || undefined}
          inviteName={inviteName || undefined}
          {...allProps}
        />
      );
    }
    if (type === VIDEO_CONTENT_TYPES.JOURNEYSTEPDETAIL) {
      return <JourneyStepDetail {...allProps} />;
    }
    return (
      <Flex direction="column" style={{ paddingBottom: 110 }}>
        <Text> </Text>
      </Flex>
    );
  }

  handleBack = () => {
    const { dispatch, shouldNavigateHome } = this.props;
    this.pause();
    if (shouldNavigateHome) {
      dispatch(navigateResetHome({ index: 0 }));
    } else {
      dispatch(navigateBack());
    }
  };

  render() {
    const { item, type } = this.props;
    const { isLandscape, customRender } = this.state;

    const config = TYPE_CONFIGS[type] || {};
    let videoObj = {};
    let videoProps = { ...(config.videoProps || {}) };
    if (type === VIDEO_CONTENT_TYPES.VIDEODETAIL) {
      const videoMedia = item.media || {};
      if (!videoMedia || !videoMedia.type || !videoMedia.url) {
        return null;
      }
      videoObj = {
        start: item.media_start,
        end: item.media_end,
        type: videoMedia.type,
        url: videoMedia.url,
        hls: videoMedia.hls,
      };
    } else {
      videoProps.forceNoAutoPlay = true;
      if (
        !item ||
        !item.item ||
        !item.item.content ||
        !item.item.content.type ||
        !item.item.content.url ||
        !item.item.content.duration ||
        !item.item.content.thumbnails ||
        !item.item.content.thumbnails.medium
      ) {
        return null;
      }

      videoObj = {
        start: item.item.media_start,
        end: item.item.media_end,
        type: item.item.content.type,
        url: item.item.content.url,
        hls: item.item.content.hls,
        duration: item.item.content.duration,
        thumbnail: item.item.content.thumbnails.medium,
      };
    }

    const isTrailer =
      type === VIDEO_CONTENT_TYPES.ORGJOURNEY ||
      type === VIDEO_CONTENT_TYPES.JOURNEYDETAIL;

    return (
      <Flex value={1}>
        <SafeArea
          top={[isLandscape ? st.bgDeepBlack : config.topColor]}
          style={[st.f1, isLandscape ? st.bgDeepBlack : config.bgColor]}
        >
          <StatusBar hidden={!theme.isIphoneX} />
          <KeyboardAwareScrollView
            innerRef={c => (this.scrollRef = c)}
            style={[st.f1]}
            bounces={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            <Flex
              style={[
                styles.video,
                isLandscape
                  ? [
                      {
                        width: '100%',
                        height: st.isAndroid ? st.fullWidth : st.fullWidth - 20,
                        paddingTop: st.isAndroid ? 20 : undefined,
                      },
                    ]
                  : null,
              ]}
            >
              {this.state.showVideo ? (
                <WebviewVideo
                  ref={c => (this.webview = c)}
                  video={videoObj}
                  onChangeState={this.handleVideoChange}
                  isLandscape={isLandscape}
                  isTrailer={isTrailer}
                  videoName={(item || {}).name}
                  {...videoProps}
                />
              ) : null}
              <BackButton onBack={this.handleBack} />
            </Flex>
            {isLandscape ? null : this.renderContent()}
          </KeyboardAwareScrollView>
          {isLandscape ? null : customRender ? (
            isAndroid ? (
              customRender
            ) : (
              <KeyboardAvoidingView
                style={[st.bgBlue]}
                behavior={theme.isAndroid ? undefined : 'padding'}
                keyboardVerticalOffset={
                  theme.isAndroid ? undefined : st.hasNotch ? 45 : 0
                }
              >
                {customRender}
              </KeyboardAvoidingView>
            )
          ) : null}
          {type === VIDEO_CONTENT_TYPES.VIDEODETAIL ? (
            <FloatingButtonSingle onSelect={this.handleShare} />
          ) : null}
        </SafeArea>
      </Flex>
    );
  }
}

function BackButton({ onBack }) {
  return (
    <Flex style={styles.backHeader}>
      <Touchable
        borderless={true}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={onBack}
      >
        <Flex>
          <VokeIcon
            name="back_button"
            size={26}
            style={[{ color: 'rgba(255,255,255,0.6)' }]}
          />
        </Flex>
      </Touchable>
    </Flex>
  );
}

VideoContentWrap.propTypes = {
  item: PropTypes.object.isRequired,
  shouldNavigateHome: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(VIDEO_CONTENT_TYPES)),
  navToStep: PropTypes.object,
  inviteName: PropTypes.string,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('videos')(connect(mapStateToProps)(VideoContentWrap));
