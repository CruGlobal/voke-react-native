import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { Flex, Button, Icon, VokeIcon } from '../common';

class SignUpHeaderBack extends Component {
  render() {
    return (
      <Flex
        self="start"
        style={{
          paddingTop: Platform.OS === 'android' ? 10 : 25,
          paddingLeft: 10,
        }}
      >
        <Button
          onPress={this.props.onPress}
          type="transparent"
          style={{ padding: 10 }}
        >
          {
            Platform.OS === 'android' ? (
              <Icon name="arrow-back" size={30} />
            ) : (
              <VokeIcon name="back" />
            )
          }
        </Button>
      </Flex>
    );
  }
}

SignUpHeaderBack.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default SignUpHeaderBack;
