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
      : item.item && item.item.content ? item.item.content : {}) || {};
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

    const initial = Orientation.getInitialOrientation();
    // LOG(initial);
    // Only change this if the app is in landscape mode
    if (initial === 'LANDSCAPE') {
      this.setState({ isLandscape: true });
    }
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
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  orientationDidChange(orientation) {
    if (getVideoType(this.props.item) === 'vimeo') {
      return;
    }
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      // LOG('landscape');
      this.setState({ isLandscape: true });
    } else if (orientation === 'PORTRAIT') {
      // LOG('portrait');
      // do something with portrait layout
      this.setState({ isLandscape: false });
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
    if (videoState === webviewStates.STARTED) {
      let id;
      if (type === VIDEO_CONTENT_TYPES.VIDEODETAIL) {
        id = item.id;
      } else {
        id = item.item.id;
      }
      if (
        type === VIDEO_CONTENT_TYPES.ORGJOURNEY ||
        type === VIDEO_CONTENT_TYPES.JOURNEYDETAIL
      ) {
        return;
      }

      dispatch(createVideoInteraction(id));
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

  renderContent() {
    const { type, item, navToStep, inviteName, ...rest } = this.props;
    const allProps = {
      item,
      onPause: this.pause,
      onPlay: this.play,
      setCustomRender: this.setCustomRender,
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
      videoObj = {
        start: item.media_start,
        end: item.media_end,
        type: videoMedia.type,
        url: videoMedia.url,
      };
    } else {
      videoProps.forceNoAutoPlay = true;
      videoObj = {
        start: item.item.media_start,
        end: item.item.media_end,
        type: item.item.content.type,
        url: item.item.content.url,
        thumbnail: item.item.content.thumbnails.medium,
      };
    }

    return (
      <Flex value={1}>
        <SafeArea
          top={[isLandscape ? st.bgDeepBlack : config.topColor]}
          style={[st.f1, isLandscape ? st.bgDeepBlack : config.bgColor]}
        >
          <StatusBar hidden={!theme.isIphoneX} />
          <KeyboardAwareScrollView
            style={[st.f1]}
            bounces={false}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            <Flex
              style={[
                styles.video,
                isLandscape
                  ? [{ width: st.fullHeight, height: st.fullWidth - 20 }]
                  : null,
              ]}
            >
              {this.state.showVideo ? (
                <WebviewVideo
                  ref={c => (this.webview = c)}
                  video={videoObj}
                  onChangeState={this.handleVideoChange}
                  isLandscape={isLandscape}
                  {...videoProps}
                />
              ) : null}
              <BackButton onBack={this.handleBack} />
            </Flex>
            {isLandscape ? null : this.renderContent()}
          </KeyboardAwareScrollView>
          {customRender ? (
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
