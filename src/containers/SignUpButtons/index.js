import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import FacebookButton from '../FacebookButton';
import styles from './styles';

class SignUpButtons extends Component {
  render() {
    const { filled } = this.props;
    return (
      <Flex align="center" justify="center" style={styles.actions}>
        <Flex style={styles.buttonWrapper}>
          <Button
            text="Sign Up with Email"
            icon="mail-outline"
            type={filled ? 'filled' : undefined}
            style={[styles.actionButton, filled ? styles.filled : null]}
            onPress={() => this.props.dispatch(navigatePush('voke.SignUpAccount'))}
          />
        </Flex>
        <Flex style={styles.buttonWrapper}>
          <FacebookButton
            type={filled ? 'filled' : undefined}
            style={filled ? styles.filled : undefined}
          />
        </Flex>
        <Flex direction="row" align="center" justify="center" style={styles.haveAccount}>
          <Text style={[styles.signIn, filled ? styles.signInFilled : null]}>Already have an account?</Text>
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
