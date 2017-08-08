import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';


import styles from './styles';
import { loginAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import LOGO from '../../../images/initial_voke.png';

class Login extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }

  login() {
    this.props.dispatch(loginAction('123', {
      id: '1',
      name: 'Bryan Eaton',
    })).then(() => {
      this.props.navigateResetHome();
    });
  }

  render() {
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
              onPress={() => this.props.navigatePush('voke.SignUpAccount')}
            />
          </Flex>
          <Flex style={styles.buttonWrapper}>
            <Button
              text="Sign Up with Facebook"
              buttonTextStyle={styles.signInButton}
              icon="account-box"
              style={styles.actionButton}
              onPress={this.login}
            />
          </Flex>
          <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Button
              text="Sign In"
              type="transparent"
              buttonTextStyle={styles.signInButton}
              onPress={this.login}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

Login.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Login);
