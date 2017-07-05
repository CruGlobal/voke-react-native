import React, { Component } from 'react';
import { Slider } from 'react-native';
import PropTypes from 'prop-types';

import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import { Button, Flex, Icon, Text } from '../common';
import styles from './styles';

export default class VideoControls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  render() {
    return (
      <Flex direction="row" style={styles.controlWrapper} align="center" justify="center">
        <Flex value={.2} align="center">
          <Icon name="play-circle-filled" size={25} style={styles.playIcon} />
        </Flex>
        <Flex value={.2} align="center">
          <Text style={styles.time}>{this.state.time}</Text>
        </Flex>
        <Flex value={1.2}>
          <Slider
            thumbImage={iconsMap['ios-radio-button-on']}
            minimumTrackTintColor={theme.primaryColor}
            minimumValue={0}
            maximumValue={15}
            onSlidingComplete={() => {console.warn('seek to ', this.state.time)}}
            onValueChange={(value) => this.setState({ time: value })}
            style={styles.slider}
          />
        </Flex>
        <Flex align="center" value={.3}>
          <Text style={styles.time}>01:05</Text>
        </Flex>
      </Flex>
    );
  }
}

VideoControls.propTypes = {
  filled: PropTypes.bool,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
