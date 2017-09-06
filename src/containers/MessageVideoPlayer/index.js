import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toastAction } from '../../actions/auth';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import { Icon, Flex, Touchable } from '../../components/common';

class MessageVideoPlayer extends Component {

  constructor(props) {
    super(props);

    this.handleVideoChange = this.handleVideoChange.bind(this);
  }

  handleVideoChange(videoState) {
    // LOG(videoState);
    if (videoState === webviewStates.ERROR) {
      // this.props.dispatch(toastAction('There was an error playing the video.'));
    } else if (videoState === webviewStates.STARTED) {
      // this.props.dispatch(toastAction('There was an error playing the video.'));
    }
  }

  render() {
    const { message, onClose } = this.props;
    // const url = 'https://www.youtube.com/watch?v=cUYSGojUuAU';
    // const url = 'https://vimeo.com/1084537';
    // const url = 'http://arc.gt/p6zz7';
    // type="vimeo"
    // type="arclight"
    return (
      <Flex style={styles.video}>
        <WebviewVideo
          type={message.item.media.type}
          url={message.item.media.url}
          start={message.item.media.media_start || 0}
          onChangeState={this.handleVideoChange}
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

export default connect()(MessageVideoPlayer);
