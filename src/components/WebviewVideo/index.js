import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, WebView, StyleSheet, View } from 'react-native';

import { Flex, Text } from '../common';
import VideoControls from '../../components/VideoControls';
import { COLORS } from '../../theme';

import webviewCommon from './common';

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

const isOlderAndroid = Platform.OS === 'android' && Platform.Version < 23;

export default class WebviewVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 0,
      isPaused: (isOlderAndroid && props.type === 'arclight') || props.type === 'vimeo',
      time: 0,
      numOfErrors: 0,
    };

    this.webview = null;

    this.handleMessage = this.handleMessage.bind(this);
    this.seek = this.seek.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  // Stop the component from updating if the url is the same
  shouldComponentUpdate(nextProps, nextState) {
    // if (nextProps.url !== this.props.url || nextProps.isHidden !== this.props.isHidden) {
    if (nextProps.url !== this.props.url) {
      return true;
    }
    if (nextState.isPaused !== this.state.isPaused || nextState.duration !== this.state.duration || nextState.time !== this.state.time) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    // Youtube and arclight autoplay, so fire off the 'Start' interaction immediately
    if (this.props.type === 'youtube' || this.props.type === 'arclight') {
      this.props.onChangeState(webviewCommon.STARTED);
    }
  }

  pause() {
    // TODO: Implement this force pause in all the .js files
    // this.sendMessage({ forcePause: true });
  }

  play() {
    // TODO: Implement this force pause in all the .js files
    // this.sendMessage({ forcePlay: true });
  }

  handleMessage(event) {
    let data = event.nativeEvent.data;
    // LOG('webview data', data);
    if (data.indexOf('{') === 0) {
      data = JSON.parse(data);
      if (data.duration) {
        this.setState({ duration: data.duration });
      } else if (typeof data.isPaused !== 'undefined') {
        this.setState({ isPaused: !!data.isPaused });
      } else if (data.time) {
        this.setState({ time: data.time });
      }
    } else {
      // Arclight videos throw a bad error, so don't do anything when that happens
      if (data === webviewCommon.ERROR && this.props.type === 'arclight') {
        // If this is the second time an arclight error is being called, fire the callback
        if (this.state.numOfErrors > 0 || isOlderAndroid) {
          this.props.onChangeState(data);
        }
        this.setState({ numOfErrors: this.state.numOfErrors + 1 });
        return;
      }
      // Change the isPaused state based on the event
      if (data === webviewCommon.STARTED || data === webviewCommon.RESUMED) {
        this.setState({ isPaused: false });
      } else if (data === webviewCommon.PAUSED || data === webviewCommon.ERROR) {
        this.setState({ isPaused: true });
      }
      this.props.onChangeState(data);
    }
  }

  // Must pass in an object
  sendMessage(data) {
    this.webview.postMessage(JSON.stringify(data));
  }

  getHtml() {
    const { type, start, end, thumbnail, url } = this.props;
    if (type === 'youtube') {
      const id = webviewCommon.getYoutubeId(url);
      if (!id) { return null; }
      return YoutubeHTML(id, { start: start, end: end });
    } else if (type === 'vimeo') {
      // Vimeo is the worst...you can't play videos inline
      const id = webviewCommon.getVimeoId(url);
      if (!id) { return null; }
      return VimeoHTML(id, { start: start, end: end });
    } else if (type === 'arclight') {
      return html5HTML(url, { thumbnail: thumbnail });
    }
    return null;
  }

  seek(seconds) {
    this.sendMessage({ seconds });
  }

  togglePlay() {
    this.sendMessage({ togglePlay: true });
  }

  render() {
    const html = this.getHtml();
    if (!html) {
      return (
        <Flex value={1} align="center" justify="center" style={styles.errorWrap}>
          <Text style={styles.errorText}>We had trouble finding that video</Text>
        </Flex>
      );
    }
    return (
      <View style={{flex: 1}}>
        <WebView
          ref={(c) => this.webview = c}
          source={{ html }}
          style={Platform.OS === 'android' ? {} : {marginTop: -20}}
          mixedContentMode="always"
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          scrollEnabled={false}
          bounces={false}
          injectedJavaScript={FIX_POSTMESSAGE}
          mediaPlaybackRequiresUserAction={false}
          onMessage={this.handleMessage}
        />
        <VideoControls
          isPaused={this.state.isPaused}
          onSeek={this.seek}
          onPlayPause={this.togglePlay}
          duration={this.state.duration}
          time={this.state.time}
          type={this.props.type}
        />
      </View>
    );
  }
}

WebviewVideo.propTypes = {
  type: PropTypes.oneOf(['youtube', 'arclight', 'vimeo']).isRequired,
  url: PropTypes.string.isRequired,
  onChangeState: PropTypes.func.isRequired,
  thumbnail: PropTypes.string,
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
