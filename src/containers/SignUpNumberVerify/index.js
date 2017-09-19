import React, { Component } from 'react';
import { Alert, Keyboard, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import { verifyMobile, createMobileVerification } from '../../actions/auth';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';

class SignUpNumberVerify extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.state= {
      code: '',
      verificationSent: false,
    };

    this.handleNext = this.handleNext.bind(this);
    this.resendCode = this.resendCode.bind(this);
  }

  componentDidMount() {
    Analytics.screen('SignUp Verify Number');
  }

  resendCode() {
    const data = {
      mobile: { mobile: this.props.mobile },
    };
    if (!this.state.verificationSent) {
      this.props.dispatch(createMobileVerification(data)).then(() => {
        Alert.alert('New verification code sent', '');
      });
      this.setState({ verificationSent: true });
    } else {
      Alert.alert('A new verification code has already been sent, please wait a few seconds before re-sending','');
    }
    setTimeout(() => {
      this.setState({ verifcationSent: false });
    }, 5000);
  }

  handleNext() {
    let data = {
      mobile: {
        mobile: this.props.mobile,
        code: this.state.code,
      },
    };
    if (!this.state.code) {
      Alert.alert('Please enter the code that was sent','');
    } else {
      this.props.dispatch(verifyMobile(data)).then(() => {
        this.props.navigateResetHome();
      });
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeader
            title="Verification"
            description="Finally, enter the 4-Digit Code you received by TXT so we know you are a human."
          />
          <Flex value={1} align="center" justify="center" style={styles.inputs}>
            <Flex direction="row" align="center" justify="center">
              <Text>V-</Text>
              <SignUpInput
                style={styles.inputBox}
                keyboardType="numeric"
                value={this.state.code}
                onChangeText={(text) => this.setState({ code: text })}
                placeholder="Verification Code"
              />
            </Flex>
            <Button
              text="Resend Code"
              type="transparent"
              buttonTextStyle={styles.resendCode}
              style={styles.actionButton}
              onPress={this.resendCode}
            />
            <Flex value={1} align="center" justify="end">
              <Button
                text="Next"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.handleNext}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

SignUpNumberVerify.propTypes = {
  ...NavPropTypes,
  mobile: PropTypes.string.isRequired,
};

export default connect(null, nav)(SignUpNumberVerify);
