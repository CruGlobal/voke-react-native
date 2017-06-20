import React, { Component } from 'react';
import { Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loginAction } from '../../actions/auth';

import { Flex, Text } from '../../components/common';

class Login extends Component {
  static navigationOptions = {
    title: 'Login',
  };
  render() {
    const { dispatch } = this.props;
    return (
      <Flex value={1} align="center" justify="center">
        <Text>Hello, please login to continue!</Text>
        <Button
          title="Login to app"
          onPress={() => dispatch(loginAction('123', {
            id: '1',
            name: 'Bryan Eaton',
          }))}
        />
      </Flex>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Login);