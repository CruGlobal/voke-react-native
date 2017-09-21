import React, { Component } from 'react';
import { Slider } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../../theme';
import { Touchable, Flex, Icon, VokeIcon, Text } from '../common';
import styles from './styles';
import { vokeIcons } from '../../utils/iconMap';

function convertTime(time) {
  const roundedTime = Math.round(time);
  let seconds = '00' + (roundedTime % 60);
  let minutes = '00' + Math.floor(roundedTime / 60);
  let hours = '';
  let str = `${minutes.substr(-2)}:${seconds.substr(-2)}`;
  if (time / 3600 >= 1) {
    hours = Math.floor(time / 3600);
    str = `${hours}:${str}`;
  }
  return str;
}

export default class VideoControls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeElapsedStr: convertTime(0),
      stateTime: 0,
    };

    this.handleScreenPress = this.handleScreenPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ stateTime: nextProps.time });
  }

  handleScreenPress() {
    this.props.onPlayPause();
  }

  render() {
    const { time, isPaused, onSeek, duration } = this.props;
    return (
      <Flex direction="column" style={styles.outerWrap}>
        <Flex style={styles.viewBlock} align="center" justify="center">
          <Touchable activeOpacity={.5} onPress={this.handleScreenPress}>
            <Flex animation="zoomIn" style={styles.screenPress}>
              {
                isPaused ? (
                  <Icon name={'play-circle-filled'} size={50} style={styles.playIcon} />
                ) : null
              }
            </Flex>
          </Touchable>
        </Flex>
        <Flex direction="row" style={styles.controlWrapper} align="center" justify="center">
          <Flex value={.2} align="center">
            <Touchable onPress={this.handleScreenPress}>
              <VokeIcon name={!isPaused ? 'pause' : 'play'} style={styles.playIcon} />
            </Touchable>
          </Flex>
          <Flex value={.2} align="center">
            <Text style={styles.time}>{convertTime(this.state.stateTime)}</Text>
          </Flex>
          <Flex value={1.2}>
            <Slider
              thumbImage={vokeIcons['thumb']}
              minimumTrackTintColor={theme.primaryColor}
              step={1}
              value={time}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={() => onSeek(this.state.stateTime)}
              onValueChange={(value) => this.setState({
                stateTime: value,
                timeElapsedStr: convertTime(value),
              })}
              style={styles.slider}
            />
          </Flex>
          <Flex align="center" value={.3}>
            <Text style={styles.time}>{convertTime(duration)}</Text>
          </Flex>
        </Flex>
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
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
