import React, { Component } from 'react';
import Slider from 'react-native-slider';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import theme from '../../theme';
import { Touchable, Flex, Icon, VokeIcon, Text } from '../common';
import styles from './styles';

function convertTime(time) {
  const roundedTime = Math.round(time);
  let seconds = '00' + roundedTime % 60;
  let minutes = '00' + Math.floor(roundedTime / 60);
  let hours = '';
  let str = `${minutes.substr(-2)}:${seconds.substr(-2)}`;
  if (time / 3600 >= 1) {
    hours = Math.floor(time / 3600);
    str = `${hours}:${str}`;
  }
  return str;
}

class VideoControls extends Component {
  state = {
    seekTime: null,
    stateTime: 0,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ stateTime: nextProps.time });
  }

  seek = () => {
    const { onSeek } = this.props;
    const { seekTime } = this.state;
    if (seekTime) {
      onSeek(seekTime);
      // Delay resetting the seekTime so that the view doesn't jump between times too much.
      setTimeout(() => this.setState({ seekTime: null }), 750);
    }
  };

  handleScreenPress = () => {
    this.props.onPlayPause();
  };

  handleReplay = () => {
    this.props.onReplay();
  };

  render() {
    const {
      time,
      isPaused,
      duration,
      replay,
      width,
      isLandscape,
      isTrailer,
      videoName,
      t,
    } = this.props;
    const { seekTime, stateTime } = this.state;
    return (
      <Flex direction="column" style={styles.outerWrap}>
        <Flex
          style={[
            isLandscape ? styles.landscapeSize : styles.portraitSize,
            styles.viewBlock,
            width ? { width } : {},
          ]}
          align="center"
          justify="center"
        >
          <Touchable
            activeOpacity={0.5}
            onPress={!replay ? this.handleScreenPress : this.handleReplay}
          >
            <Flex
              animation="zoomIn"
              style={[
                isLandscape ? styles.landscapeSize : styles.portraitSize,
                styles.screenPress,
              ]}
            >
              {(isPaused || replay) && !isTrailer ? (
                <Icon
                  type={replay ? undefined : 'Voke'}
                  name={replay ? 'replay' : 'play'}
                  size={50}
                  style={[{ color: 'rgba(255,255,255,0.6)' }]}
                />
              ) : null}
            </Flex>
          </Touchable>
        </Flex>
        {isTrailer && isPaused ? (
          <Flex
            direction="row"
            style={[
              isLandscape ? styles.landscapeSize : styles.portraitSize,
              width ? { width } : {},
              { backgroundColor: 'rgba(0,0,0,0.3)' },
            ]}
            align="center"
            justify="center"
          >
            <Flex align="center">
              <Touchable onPress={this.handleScreenPress}>
                <Text
                  style={{
                    fontSize: 20,
                    paddingHorizontal: 25,
                    paddingVertical: 4,
                  }}
                >
                  {videoName}
                </Text>
                <Flex
                  style={{
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    width: '75%',
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 15,
                      paddingVertical: 4,
                      textAlign: 'center',
                    }}
                  >
                    {t('watchTrailer')}
                  </Text>
                </Flex>
              </Touchable>
            </Flex>
          </Flex>
        ) : (
          <Flex
            direction="row"
            style={[
              isLandscape ? styles.landscapeSize : styles.portraitSize,
              styles.controlWrapper,
              width ? { width } : {},
            ]}
            align="center"
            justify="center"
          >
            <Flex value={0.2} align="center">
              <Touchable onPress={this.handleScreenPress}>
                <VokeIcon
                  name={!isPaused ? 'pause' : 'play'}
                  style={styles.playIcon}
                />
              </Touchable>
            </Flex>
            <Flex value={0.4} align="center">
              <Text style={styles.time}>
                {convertTime(seekTime || stateTime)}
              </Text>
            </Flex>
            <Flex value={1.2}>
              <Slider
                thumbTintColor={theme.primaryColor}
                minimumTrackTintColor={theme.primaryColor}
                step={1}
                thumbStyle={styles.thumbStyle}
                value={seekTime || time}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={this.seek}
                onValueChange={value => this.setState({ seekTime: value })}
                style={styles.slider}
              />
            </Flex>
            <Flex align="center" value={0.3}>
              <Text style={styles.time}>{convertTime(duration)}</Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  }
}

VideoControls.propTypes = {
  isPaused: PropTypes.bool,
  time: PropTypes.number,
  duration: PropTypes.number.isRequired,
  onSeek: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isLandscape: PropTypes.bool.isRequired,
  replay: PropTypes.bool.isRequired,
  isTrailer: PropTypes.bool,
  videoName: PropTypes.string,
  width: PropTypes.number,
  onReplay: PropTypes.func.isRequired,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};

export default translate('videos')(VideoControls);
