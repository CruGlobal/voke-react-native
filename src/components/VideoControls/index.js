import React, { Component } from 'react';
import { Slider } from 'react-native';
import PropTypes from 'prop-types';

import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import { Button, Flex, Icon, Text } from '../common';
import styles from './styles';

function convertTime(time) {
  let seconds = '00' + (time % 60);
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
      time: 0,
    };
  }

  render() {
    const { onSeek, duration } = this.props;
    return (
      <Flex direction="row" style={styles.controlWrapper} align="center" justify="center">
        <Flex value={.2} align="center">
          <Icon name="play-circle-filled" size={25} style={styles.playIcon} />
        </Flex>
        <Flex value={.2} align="center">
          <Text style={styles.time}>{this.state.timeElapsedStr}</Text>
        </Flex>
        <Flex value={1.2}>
          <Slider
            thumbImage={iconsMap['ios-radio-button-on']}
            minimumTrackTintColor={theme.primaryColor}
            step={1}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={() => onSeek(this.state.time)}
            onValueChange={(value) => this.setState({
              time: value,
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
  filled: PropTypes.bool,
  duration: PropTypes.number.isRequired,
  onSeek: PropTypes.func.isRequired,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
