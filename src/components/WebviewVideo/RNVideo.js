import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';

import { COLORS, DEFAULT } from '../../theme';
import videoUtils from '../../utils/video';
import webviewCommon from './common';
import { isString } from '../../utils/common';


export default class RNVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPlayed: !props.isPaused,
    };

    this.player = null;

    this.handleLoad = this.handleLoad.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // If 'isPaused' gets toggled, fire off the corresponding event
    if (nextProps.isPaused !== this.props.isPaused) {
      if (nextProps.isPaused) {
        this.props.onUpdateData(webviewCommon.PAUSED);
      } else {
        if (this.state.hasPlayed) {
          this.props.onUpdateData(webviewCommon.RESUMED);
        } else {
          this.setState({ hasPlayed: true });
          this.props.onUpdateData(webviewCommon.STARTED);
        }
      }
    }

    // If replay was set to true, but becomes false, force a replay
    if (!nextProps.replay && this.props.replay) {
      if (this.props.start) {
        const start = isString(this.props.start) ? parseInt(this.props.start) : this.props.start;
        // Restart at the correct start position
        this.player.seek(start || 0);
      } else {
        this.video.seek(0);
      }
    }
  }

  handleLoad(data) {
    this.props.onUpdateData({ duration: data.duration });

    // If the video should be autoplayed, fire the 'started' event when it loads
    if (this.state.hasPlayed) {
      this.props.onUpdateData(webviewCommon.STARTED);
    }
  }

  handleProgress(data) {
    this.props.onUpdateData({ time: data.currentTime });
  }

  render() {
    const { url, isPaused } = this.props;
    // playInBackground, playWhenInactive, ignoreSilentSwitch are all iOS properties
    return (
      <Video
        source={{ uri: url }}
        ref={(c) => this.player = c}
        paused={isPaused}
        resizeMode="contain"
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        progressUpdateInterval={500.0}
        onLoad={this.handleLoad}
        onProgress={this.handleProgress}
        onEnd={() => this.props.onUpdateData(webviewCommon.FINISHED)}
        onError={() => this.props.onUpdateData(webviewCommon.ERROR)}
        style={styles.video} />
    );
  }
}

RNVideo.propTypes = {
  url: PropTypes.string.isRequired,
  isPaused: PropTypes.bool.isRequired,
  replay: PropTypes.bool,
  onUpdateData: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
    // backgroundColor: COLORS.DEEP_BLACK,
    // height: videoUtils.HEIGHT,
    // width: videoUtils.WIDTH,
  },
  landscapeVideo: {
    // backgroundColor: COLORS.DEEP_BLACK,
    // height: DEFAULT.FULL_WIDTH,
    // width: DEFAULT.FULL_HEIGHT,
  },
});
