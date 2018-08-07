import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { toastAction } from '../../actions/auth';
import { createMessageInteraction } from '../../actions/messages';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import { Icon, Flex, Touchable } from '../../components/common';

// Keep track of states that we want to make an API call if they happen
const INTERACTION_STATES = [
  webviewStates.STARTED,
  webviewStates.PAUSED,
  webviewStates.RESUMED,
  webviewStates.FINISHED,
];

class MessageVideoPlayer extends Component {
  pause = () => {
    if (
      this.webview &&
      this.webview.getWrappedInstance &&
      this.webview.getWrappedInstance().pause
    ) {
      this.webview.getWrappedInstance().pause();
    }
  };

  handleVideoChange = videoState => {
    const { t, message, dispatch, isMyMessage } = this.props;
    let interaction = {
      conversationId: message.conversation_id,
      messageId: message.id,
    };
    if (videoState === webviewStates.ERROR) {
      dispatch(toastAction(t('error.playingVideo')));
    } else if (INTERACTION_STATES.includes(videoState)) {
      interaction.action = videoState;
    }

    // If the user is interacting with a video and it was someone else that sent it,
    // send the interaction to the API
    if (interaction.action && !isMyMessage) {
      dispatch(createMessageInteraction(interaction));
    }
  };

  render() {
    const { message, onClose } = this.props;
    const video = message.item;
    const videoMedia = video.media || {};
    const videoType = videoMedia.type;
    return (
      <Flex style={styles.video}>
        <WebviewVideo
          ref={c => (this.webview = c)}
          type={videoType}
          url={videoMedia.url}
          start={video.media_start || 0}
          onChangeState={this.handleVideoChange}
          isLandscape={false}
        />
        <View style={styles.backHeader}>
          <Touchable borderless={true} onPress={onClose}>
            <View>
              <Icon name="close" size={28} style={styles.backIcon} />
            </View>
          </Touchable>
        </View>
      </Flex>
    );
  }
}

MessageVideoPlayer.propTypes = {
  message: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }, { message }) => ({
  // Figure out if the message is mine that I sent to someone
  isMyMessage:
    message &&
    message.messenger_id &&
    auth.user.id &&
    message.messenger_id === auth.user.id,
});

export default translate(undefined, { wait: true, withRef: true })(
  connect(mapStateToProps, undefined, undefined, { withRef: true })(
    MessageVideoPlayer,
  ),
);
