import React, { Component } from 'react';
import { Slider, View } from 'react-native';
import PropTypes from 'prop-types';

import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import { Touchable, Flex, Icon, Text } from '../common';
import styles from './styles';

function convertTime(time) {
  let seconds = '00' + Math.ceil(time % 60);
  let minutes = '00' + Math.floor(time / 60);
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ stateTime: nextProps.time });
  }
  

  render() {
    const { time, isPaused, onSeek, duration, onPlayPause } = this.props;
    return (
      <Flex direction="row" style={styles.controlWrapper} align="center" justify="center">
        <Flex value={.2} align="center">
          <Touchable onPress={onPlayPause}>
            <View>
              <Icon name={!isPaused ? 'pause-circle-filled' : 'play-circle-filled'} size={25} style={styles.playIcon} />
            </View>
          </Touchable>
        </Flex>
        <Flex value={.2} align="center">
          <Text style={styles.time}>{convertTime(this.state.stateTime)}</Text>
        </Flex>
        <Flex value={1.2}>
          <Slider
            thumbImage={iconsMap['ios-radio-button-on']}
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
    );
  }
}

VideoControls.propTypes = {
  isPaused: PropTypes.bool,
  time: PropTypes.number,
  duration: PropTypes.number.isRequired,
  onSeek: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
