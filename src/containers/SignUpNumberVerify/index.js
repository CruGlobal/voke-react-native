import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { verifyMobile, createMobileVerification } from '../../actions/auth';

import styles from './styles';
import { navigateBack, navigateResetHome } from '../../actions/nav';
import ApiLoading from '../ApiLoading';
import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import theme from '../../theme';

class SignUpNumberVerify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      verificationSent: false,
      disableNext: false,
      isLoading: false,
    };

    this.handleNext = this.handleNext.bind(this);
    this.resendCode = this.resendCode.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.SignUpNumberVerify);
  }

  resendCode() {
    const { t, mobile, dispatch } = this.props;
    const data = {
      mobile: { mobile: mobile },
    };
    if (!this.state.verificationSent) {
      dispatch(createMobileVerification(data)).then(() => {
        Alert.alert(t('codeSent'));
      });
      this.setState({ verificationSent: true });
    } else {
      Alert.alert('', t('codeSentWait'));
    }
    // Reset this variable after a few seconds so that the user can resend the code
    setTimeout(() => {
      this.setState({ verifcationSent: false });
    }, 5000);
  }

  skip = () => {
    this.props.dispatch(navigateBack(4));
  };

  handleNext() {
    const { t, mobile, dispatch } = this.props;
    let data = {
      mobile: {
        mobile: mobile,
        code: this.state.code,
      },
    };
    if (!this.state.code) {
      Alert.alert(t('enterCodeSent'));
    } else {
      this.setState({ disableNext: true, isLoading: true });
      dispatch(verifyMobile(data))
        .then(() => {
          this.setState({ disableNext: false, isLoading: false });
          // if (!this.props.onboardCompleted) {
          //   this.props.dispatch(navigatePush('voke.SignUpWelcome', {
          //     onlyOnboarding: true,
          //   }, {
          //     overrideBackPress: true,
          //   }));
          // } else {
          dispatch(navigateResetHome());
          // }
        })
        .catch(() => {
          this.setState({ disableNext: false, isLoading: false });
          Alert.alert(t('invalidCode'), t('codeNotMatch'));
        });
    }
  }

  render() {
    const { t, dispatch } = this.props;
    return (
      <ScrollView
        style={styles.container}
        value={1}
        keyboardShouldPersistTaps="always"
        align="center"
        justify="start"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={theme.isAndroid ? undefined : 'padding'}
        >
          <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
          >
            <SignUpHeader
              title={t('title.verification')}
              description={t('verifyDescription')}
              onPress={() => Keyboard.dismiss()}
            />
            <Flex
              value={1}
              align="center"
              justify="center"
              style={styles.inputs}
            >
              <Flex direction="row" align="center" justify="center">
                <Text>V-</Text>
                <SignUpInput
                  style={styles.inputBox}
                  keyboardType="numeric"
                  value={this.state.code}
                  onChangeText={text => this.setState({ code: text })}
                  placeholder={t('placeholder.verification')}
                />
              </Flex>
              <Button
                text={t('resend')}
                type="transparent"
                buttonTextStyle={styles.resendCode}
                style={styles.actionButton}
                onPress={this.resendCode}
              />
              <Flex value={1} align="center" justify="center">
                <Button
                  text={t('next')}
                  disabled={this.state.disableNext}
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
                <Button
                  text={t('skip')}
                  type="transparent"
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButtonSkip}
                  onPress={this.skip}
                />
              </Flex>
            </Flex>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {this.state.isLoading ? <ApiLoading force={true} /> : null}
      </ScrollView>
    );
  }
}

SignUpNumberVerify.propTypes = {
  mobile: PropTypes.string.isRequired,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  onboardCompleted: auth.onboardCompleted,
});

export default translate('signUp')(
  connect(mapStateToProps)(SignUpNumberVerify),
);
