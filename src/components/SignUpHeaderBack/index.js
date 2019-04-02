import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Button, Icon, VokeIcon } from '../common';
import theme from '../../theme';
import st from '../../st';

class SignUpHeaderBack extends Component {
  render() {
    return (
      <Flex
        self="start"
        style={{
          paddingTop: theme.isAndroid ? 10 : 25,
          paddingLeft: 10,
        }}
      >
        <Button
          onPress={this.props.onPress}
          type="transparent"
          style={{ padding: 10 }}
        >
          {theme.isAndroid ? (
            <Icon name="arrow-back" size={30} style={[st.white]} />
          ) : (
            <VokeIcon name="back_arrow" style={[st.white]} />
          )}
        </Button>
      </Flex>
    );
  }
}

SignUpHeaderBack.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default SignUpHeaderBack;
