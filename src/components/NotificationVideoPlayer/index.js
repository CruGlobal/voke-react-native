import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import st from '../../st';

import { toastAction } from '../../actions/auth';
import { createMessageInteraction } from '../../actions/messages';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import { View, Icon, Flex, Touchable } from '../../components/common';
import { createVideoInteraction } from '../../actions/videos';

// Keep track of states that we want to make an API call if they happen
const INTERACTION_STATES = [
  webviewStates.STARTED,
  webviewStates.PAUSED,
  webviewStates.RESUMED,
  webviewStates.FINISHED,
];

class NotificationVideoPlayer extends Component {
  pause = () => {
    if (
      this.webview &&
      this.webview.getWrappedInstance &&
      this.webview.getWrappedInstance().pause
    ) {
      this.webview.getWrappedInstance().pause();
    }
  };

  handleVideoChange = (videoState, mediaViewTime) => {
    const { t, message, dispatch } = this.props;
    let interaction = {
      conversationId: message.conversation_id,
      messageId: message.id,
    };
    if (videoState === webviewStates.ERROR) {
      dispatch(toastAction(t('error.playingVideo')));
    } else if (INTERACTION_STATES.includes(videoState)) {
      interaction.action = videoState;
      interaction.mediaViewTime = mediaViewTime;
    }

    if (interaction.action) {
      dispatch(createMessageInteraction(interaction));
    }
  };

  render() {
    const { message, onClose } = this.props;
    const video = message.item;
    const videoMedia = video.media || {};
    if (!video) return null;
    const videoObj = {
      start: video.media_start,
      end: video.media_end,
      type: videoMedia.type,
      url: videoMedia.url,
      hls: videoMedia.hls,
    };
    return (
      <Flex
        style={[
          styles.video,
          this.props.isLandscape
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
        <WebviewVideo
          ref={c => (this.webview = c)}
          video={videoObj}
          onChangeState={this.handleVideoChange}
          isLandscape={this.props.isLandscape}
        />
        {this.props.isLandscape ? null : (
          <View style={styles.backHeader}>
            <Touchable borderless={true} onPress={onClose}>
              <View>
                <Icon name="close" size={28} style={styles.backIcon} />
              </View>
            </Touchable>
          </View>
        )}
      </Flex>
    );
  }
}

NotificationVideoPlayer.propTypes = {
  message: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  isLandscape: PropTypes.bool,
};

const mapStateToProps = ({ auth }, { message }) => ({
  // Figure out if the message is mine that I sent to someone
  isMyMessage: false,
});

export default translate(undefined, { wait: true, withRef: true })(
  connect(mapStateToProps, undefined, undefined, { withRef: true })(
    NotificationVideoPlayer,
  ),
);
