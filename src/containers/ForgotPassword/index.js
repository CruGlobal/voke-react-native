import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { forgotPasswordAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS from '../../constants';

class ForgotPassword extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValidation: false,
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Forgot Password');
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  forgotPassword() {
    if (this.state.emailValidation) {
      this.props.dispatch(forgotPasswordAction(this.state.email)).then(() => {
        LOG('resetting password');
        Alert.alert(
          'Check your Email',
          'We sent you an email with instructions for resetting your password',
          [{ text: 'OK', onPress: () => this.props.navigateBack()}]
        );
      });
    }
    else {
      Alert.alert('Invalid Email', 'Please enter a valid email');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <Flex direction="column" value={1} align="center" justify="end" style={styles.logoWrapper}>
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
            </Flex>
            <Text style={styles.description}>Please enter your email to reset your password</Text>
          </Flex>
          <Flex value={1.5} align="center" justify="start" style={styles.actions}>
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Send"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.forgotPassword}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

ForgotPassword.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(ForgotPassword);
