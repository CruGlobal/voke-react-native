import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, WebView, StyleSheet, View } from 'react-native';
import { translate } from 'react-i18next';

import { Flex, Text } from '../common';
import RNVideo from './RNVideo';
import VideoControls from '../../components/VideoControls';
import { COLORS } from '../../theme';
import { isObject, isString } from '../../utils/common';
import theme from '../../theme';

import webviewCommon from './common';
import st from '../../st';

const FIX_POSTMESSAGE = `(function() {
  var originalPostMessage = window.postMessage;
  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };
  window.postMessage = patchedPostMessage;
})()`;

import YoutubeHTML from './youtube';
import VimeoHTML from './vimeo';
import html5HTML from './html5';

const isOlderAndroid = theme.isAndroid && Platform.Version < 23;
let shouldAddMargin = false;
if (!theme.isAndroid) {
  const iosVersion = parseInt(Platform.Version, 10);
  if (iosVersion >= 11) {
    shouldAddMargin = true;
  }
}

class WebviewVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      isPaused:
        (isOlderAndroid && props.video.type === 'arclight') ||
        props.video.type === 'vimeo' ||
        props.forceNoAutoPlay,
      time: 0,
      numOfErrors: 0,
      addMargin: shouldAddMargin,
      replay: false,
    };

    this.webview = null;

    this.handleMessage = this.handleMessage.bind(this);
    this.handleData = this.handleData.bind(this);
    this.pause = this.pause.bind(this);
    this.addMargin = this.addMargin.bind(this);
    this.removeMargin = this.removeMargin.bind(this);
    this.play = this.play.bind(this);
    this.seek = this.seek.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.replayVideo = this.replayVideo.bind(this);
  }

  componentDidMount() {
    const {
      forceNoAutoPlay,
      video: { type },
      onChangeState,
    } = this.props;
    // Youtube and arclight autoplay, so fire off the 'Start' interaction immediately
    if (!forceNoAutoPlay) {
      if (type === 'youtube' || type === 'arclight') {
        onChangeState(webviewCommon.STARTED);
      }
    } else {
      this.pause();
    }
  }

  addMargin() {
    this.setState({ addMargin: true });
  }

  removeMargin() {
    if (this.state.addMargin) {
      this.setState({ addMargin: false });
    }
  }

  pause() {
    this.sendMessage({ forcePause: true });
    this.setState({ isPaused: true });
  }

  play() {
    this.sendMessage({ forcePlay: true });
    this.setState({ isPaused: false });
  }

  handleData(data) {
    const {
      video: { type },
      forceNoAutoPlay,
      onChangeState,
    } = this.props;
    // console.log('________________', data);
    if (isObject(data) || data.indexOf('{') === 0) {
      let newData = data;
      if (isString(data)) {
        newData = JSON.parse(data);
      }
      if (newData.duration) {
        if (
          type === 'arclight' &&
          this.state.duration === 0 &&
          !forceNoAutoPlay
        ) {
          this.play();
        }
        this.setState({ duration: newData.duration });
      } else if (typeof newData.isPaused !== 'undefined') {
        this.setState({ isPaused: !!newData.isPaused });
      } else if (newData.time) {
        this.setState({ time: newData.time });
      }
    } else {
      // Arclight videos throw a bad error, so don't do anything when that happens
      if (data === webviewCommon.ERROR && type === 'arclight') {
        // If this is the second time an arclight error is being called, fire the callback
        if (this.state.numOfErrors > 0 || isOlderAndroid) {
          onChangeState(data);
        }
        this.setState({ numOfErrors: this.state.numOfErrors + 1 });
        return;
      }
      // Change the isPaused state based on the event
      if (data === webviewCommon.STARTED || data === webviewCommon.RESUMED) {
        if (this.state.isPaused) {
          this.setState({ isPaused: false });
        }
      } else if (
        data === webviewCommon.PAUSED ||
        data === webviewCommon.ERROR
      ) {
        if (!this.state.isPaused) {
          this.setState({ isPaused: true });
        }
      } else if (data === webviewCommon.FINISHED) {
        this.setState({ replay: true });
      }
      onChangeState(data);
    }
  }

  handleMessage(event) {
    let data = event.nativeEvent.data;
    // LOG('webview data', data);
    this.handleData(data);
  }

  // Must pass in an object
  sendMessage(data) {
    if (this.webview) {
      this.webview.postMessage(JSON.stringify(data));
    }
  }

  getHtml() {
    const {
      video: { type, start, end, thumbnail, url },
      forceNoAutoPlay,
    } = this.props;
    if (type === 'youtube') {
      const id = webviewCommon.getYoutubeId(url);
      if (!id) {
        return null;
      }
      return YoutubeHTML(id, {
        start: start,
        end: end,
        forceNoAutoPlay: forceNoAutoPlay || false,
      });
    } else if (type === 'vimeo') {
      // Vimeo is the worst...you can't play videos inline
      const id = webviewCommon.getVimeoId(url);
      if (!id) {
        return null;
      }
      return VimeoHTML(id, { start: start, end: end });
    } else if (type === 'arclight') {
      return html5HTML(url, {
        thumbnail: thumbnail,
        // forceNoAutoPlay: forceNoAutoPlay || false,
        forceNoAutoPlay: true,
      });
    }
    return null;
  }

  seek(seconds) {
    this.sendMessage({ seconds });
    if (this.rnvideo) {
      this.rnvideo.seekTo(seconds);
    }
  }

  togglePlay() {
    if (this.state.isPaused && this.props.forceNoAutoPlay) {
      this.play();
    } else {
      this.sendMessage({ togglePlay: true });
      this.setState({ isPaused: !this.state.isPaused });
    }
  }

  replayVideo() {
    this.sendMessage({ replayVideo: true });
    if (this.state.replay) {
      this.setState({ replay: false });
    }
  }

  renderVideo(html) {
    const {
      video: { type, start, url },
    } = this.props;
    const { isPaused, replay, addMargin } = this.state;
    if (type === 'arclight' && isOlderAndroid) {
      // if (theme.isAndroid) {
      return (
        <RNVideo
          ref={c => (this.rnvideo = c)}
          url={url}
          onUpdateData={this.handleData}
          isPaused={isPaused}
          replay={replay}
          start={start}
        />
      );
    }
    return (
      <WebView
        ref={c => (this.webview = c)}
        source={{ html }}
        style={{
          marginTop: addMargin ? -20 : 0,
        }}
        mixedContentMode="always"
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}
        bounces={false}
        injectedJavaScript={FIX_POSTMESSAGE}
        mediaPlaybackRequiresUserAction={false}
        onMessage={this.handleMessage}
      />
    );
  }

  render() {
    const {
      t,
      video: { type },
      isLandscape,
      width,
    } = this.props;
    const { isPaused, duration, replay, time } = this.state;
    const html = this.getHtml();
    if (!html) {
      return (
        <Flex
          value={1}
          align="center"
          justify="center"
          style={styles.errorWrap}
        >
          <Text style={styles.errorText}>{t('error.troubleVideo')}</Text>
        </Flex>
      );
    }
    return (
      <View style={[st.f1]}>
        {this.renderVideo(html)}
        <VideoControls
          isPaused={isPaused}
          onSeek={this.seek}
          onPlayPause={this.togglePlay}
          onReplay={this.replayVideo}
          duration={duration}
          replay={replay}
          time={time}
          type={type}
          isLandscape={isLandscape}
          width={width}
        />
      </View>
    );
  }
}

WebviewVideo.propTypes = {
  video: PropTypes.shape({
    type: PropTypes.oneOf(['youtube', 'arclight', 'vimeo']).isRequired,
    url: PropTypes.string.isRequired,
    start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    end: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    thumbnail: PropTypes.string,
  }),
  onChangeState: PropTypes.func.isRequired,
  isLandscape: PropTypes.bool.isRequired,
  forceNoAutoPlay: PropTypes.bool,
  width: PropTypes.number,
};

const styles = StyleSheet.create({
  errorWrap: {
    paddingHorizontal: 25,
    backgroundColor: COLORS.DEEP_BLACK,
  },
  errorText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default translate(undefined, { wait: true, withRef: true })(
  WebviewVideo,
);
