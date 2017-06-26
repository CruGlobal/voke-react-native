import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { WebView } from 'react-native';

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

export default class WebviewVideo extends Component {
  constructor(props) {
    super(props);

    this.webView = null;

    this.handleMessage = this.handleMessage.bind(this);
  }

  // Stop the component from updating if the id is the same
  shouldComponentUpdate(nextProps) {
    if (nextProps.id !== this.props.id) {
      return true;
    }
    return false;
  }

  handleMessage(event) {
    console.warn('On Message', event.nativeEvent.data);
  }

  // sendPostMessage() {
  //   console.warn('send message to webview');
  //   this.webView.postMessage('Post message from react native');
  // }

  getHtml() {
    return YoutubeHTML('cUYSGojUuAU', { start: '' });
    // Vimeo is the worst...you can't play videos inline
    // return VimeoHTML('214496885', { start: '' });
  }

  render() {
    return (
      <WebView
        ref={(c) => this.webview = c}
        source={{
          html: this.getHtml(),
        }}
        style={{marginTop: 0}}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}
        bounces={false}
        injectedJavaScript={FIX_POSTMESSAGE}
        mediaPlaybackRequiresUserAction={false}
        onMessage={this.handleMessage}
      />
    );
  }
}

WebviewVideo.propTypes = {
  // video: PropTypes.object.isRequired,
};
