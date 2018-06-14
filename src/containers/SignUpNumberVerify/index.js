import React, { Component } from 'react';
import { Alert, Keyboard, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import { verifyMobile, createMobileVerification } from '../../actions/auth';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';

import ApiLoading from '../ApiLoading';
import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import theme from '../../theme';

class SignUpNumberVerify extends Component {
  constructor(props) {
    super(props);

    this.state= {
      code: '',
      verificationSent: false,
      disableNext: false,
      isLoading: false,
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
        Alert.alert('New verification code sent');
      });
      this.setState({ verificationSent: true });
    } else {
      Alert.alert('', 'A new verification code has already been sent, please wait a few seconds before re-sending');
    }
    // Reset this variable after a few seconds so that the user can resend the code
    setTimeout(() => {
      this.setState({ verifcationSent: false });
    }, 5000);
  }

  skip = () => {
    this.props.navigateBack(4);
  }

  handleNext() {
    let data = {
      mobile: {
        mobile: this.props.mobile,
        code: this.state.code,
      },
    };
    if (!this.state.code) {
      Alert.alert('Please enter the code that was sent');
    } else {
      this.setState({ disableNext: true, isLoading: true });
      this.props.dispatch(verifyMobile(data)).then(() => {
        this.setState({ disableNext: false, isLoading: false });
        // if (!this.props.onboardCompleted) {
        //   this.props.navigatePush('voke.SignUpWelcome', {
        //     onlyOnboarding: true,
        //   }, {
        //     overrideBackPress: true,
        //   });
        // } else {
        this.props.navigateResetHome();
        // }
      }).catch(() => {
        this.setState({ disableNext: false, isLoading: false });
        Alert.alert('Invalid code','Code does not match the code that was sent to the mobile number');
      });
    }
  }

  render() {
    return (
      <ScrollView style={styles.container} value={1} keyboardShouldPersistTaps="always" align="center" justify="start">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={theme.isAndroid ? undefined : 'padding'}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <SignUpHeader
              title="Verification"
              description="Finally, enter the 4-Digit Code you received by TXT so we know you are a human."
              onPress={()=> Keyboard.dismiss()}
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
              <Flex value={1} align="center" justify="center">
                <Button
                  text="Next"
                  disabled={this.state.disableNext}
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
                <Button
                  text="Skip"
                  type="transparent"
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButton}
                  onPress={this.skip}
                />
              </Flex>
            </Flex>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {
          this.state.isLoading ? <ApiLoading force={true} /> : null
        }
      </ScrollView>
    );
  }
}

SignUpNumberVerify.propTypes = {
  ...NavPropTypes,
  mobile: PropTypes.string.isRequired,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  // onboardCompleted: auth.onboardCompleted,
});

export default connect(mapStateToProps, nav)(SignUpNumberVerify);
