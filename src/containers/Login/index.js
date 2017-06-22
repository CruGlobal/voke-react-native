import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { loginAction } from '../../actions/auth';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import LOGO from '../../../images/vokeLogo.png';

class Login extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <StatusBar />
        <Flex direction="column" value={3} align="center" justify="center" style={styles.logoWrapper}>
          <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
          <Text style={styles.headerText}>A free chat app that helps kickstart deeper conversations using thought-provoking videos</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.actions}>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Create Free Account"
              icon="mail-outline"
              buttonTextStyle={styles.signInButton}
              style={styles.actionButton}
              onPress={() => dispatch(loginAction('123', {
                id: '1',
                name: 'Bryan Eaton',
              }))}
            />
          </Flex>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Sign Up with Facebook"
              buttonTextStyle={styles.signInButton}
              icon="account-box"
              style={styles.actionButton}
              onPress={() => dispatch(loginAction('123', {
                id: '1',
                name: 'Bryan Eaton',
              }))}
            />
          </Flex>
          <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Button
              text="Sign In"
              type="transparent"
              buttonTextStyle={styles.signInButton}
              onPress={() => dispatch(loginAction('123', {
                id: '1',
                name: 'Bryan Eaton',
              }))}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Login);
