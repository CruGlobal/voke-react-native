import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, StyleSheet, View } from 'react-native';

import { Flex, Text } from '../common';
import VideoControls from '../../components/VideoControls';
import { COLORS } from '../../theme';

import common from './common';

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

export default class WebviewVideo extends Component {
  constructor(props) {
    super(props);

    this.webView = null;

    this.handleMessage = this.handleMessage.bind(this);
    this.seek = this.seek.bind(this);
  }

  // Stop the component from updating if the url is the same
  shouldComponentUpdate(nextProps) {
    if (nextProps.url !== this.props.url) {
      return true;
    }
    return false;
  }

  handleMessage(event) {
    this.props.onChangeState(event.nativeEvent.data);
  }

  // Must pass in an object
  sendMessage(data) {
    this.webview.postMessage(JSON.stringify(data));
  }

  getHtml() {
    if (this.props.type === 'youtube') {
      const id = common.getYoutubeId(this.props.url);
      if (!id) { return null; }
      return YoutubeHTML(id, { start: this.props.start, end: this.props.end });
    } else if (this.props.type === 'vimeo') {
      // Vimeo is the worst...you can't play videos inline
      const id = common.getVimeoId(this.props.url);
      if (!id) { return null; }
      return VimeoHTML(id, { start: this.props.start, end: this.props.end });
    } else if (this.props.type === 'arclight') {
      return html5HTML(this.props.url, { thumbnail: this.props.thumbnail });
    }
    return null;
  }
  
  seek(seconds) {
    console.warn('seek to seconds', seconds);
    this.sendMessage({ seconds });
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
          style={{}}
          mediaPlaybackRequiresUserAction={true}
          allowsInlineMediaPlayback={true}
          scrollEnabled={false}
          bounces={false}
          injectedJavaScript={FIX_POSTMESSAGE}
          mediaPlaybackRequiresUserAction={false}
          onMessage={this.handleMessage}
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
