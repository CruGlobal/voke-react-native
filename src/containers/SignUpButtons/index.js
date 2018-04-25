import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import FacebookButton from '../FacebookButton';
import styles from './styles';

class SignUpButtons extends Component {
  render() {
    return (
      <Flex align="center" justify="center" style={styles.actions}>
        <Flex style={styles.buttonWrapper}>
          <Button
            text="Sign Up with Email"
            icon="mail-outline"
            style={styles.actionButton}
            onPress={() => this.props.dispatch(navigatePush('voke.SignUpAccount'))}
          />
        </Flex>
        <Flex style={styles.buttonWrapper}>
          <FacebookButton />
        </Flex>
        <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
          <Text style={styles.signIn}>Already have an account?</Text>
          <Button
            text="Sign In"
            type="transparent"
            buttonTextStyle={styles.signInText}
            onPress={() => this.props.dispatch(navigatePush('voke.LoginInput'))}
          />
        </Flex>
      </Flex>
    );
  }
}

export default connect()(SignUpButtons);
