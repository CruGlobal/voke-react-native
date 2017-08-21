import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';


import styles from './styles';
import { anonLogin } from '../../actions/auth';
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

  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <StatusBar />
        <Flex direction="column" value={1} align="center" justify="end" style={styles.logoWrapper}>
          <Flex style={styles.imageWrap} align="center" justify="center">
            <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
          </Flex>
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
              icon="facebook-square"
              iconType="FontAwesome"
              style={styles.actionButton}
              onPress={() => this.props.navigatePush('voke.LoginInput')}
            />
          </Flex>
          <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
            <Text style={styles.signIn}>Already have an account?</Text>
            <Button
              text="Sign In"
              type="transparent"
              buttonTextStyle={styles.signInText}
              onPress={() => this.props.navigatePush('voke.LoginInput')}
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
