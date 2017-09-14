import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { Flex, Text, VokeIcon, Button } from '../common';

class CustomNavBar extends Component {
  render() {
    const { leftButtonName, leftButtonStyle, titleStyle, title, rightButtonName, rightButtonStyle } = this.props;
    return (
      <Flex justify="center" style={styles.wrap}>
        <Flex value={1} align="start" style={[styles.leftButton, leftButtonStyle]}>
          {
            leftButtonName ? (
              <Button
                onPress={this.props.onLeftPress}
              >
                <VokeIcon name={leftButtonName} />
              </Button>
            ) : null
          }
        </Flex>
        <Flex value={1} align="center" style={[styles.title, titleStyle]}>
          {
            title ? (
              <Text style={styles.titleText}>{title}</Text>
            ) : null
          }
        </Flex>
        <Flex value={1} align="end" style={[styles.rightButton, rightButtonStyle]}>
          {
            rightButtonName ? (
              <VokeIcon name={rightButtonName} />
            ) : null
          }
        </Flex>
      </Flex>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 60,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    paddingVertical: 10,
  },
});

CustomNavBar.propTypes = {
  leftButtonName: PropTypes.string,
  title: PropTypes.string,
  leftButtonStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  onLeftPress: PropTypes.func,
};

export default CustomNavBar;
