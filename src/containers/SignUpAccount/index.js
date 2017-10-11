import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, KeyboardAvoidingView, Linking, Alert, Keyboard, Platform } from 'react-native';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { createAccountAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Button, Touchable } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import CONSTANTS from '../../constants';

class SignUpAccount extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValidation: false,
    };
    this.createAccount = this.createAccount.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow() {
    // LOG('Keyboard shown');
  }

  keyboardDidHide() {
    // LOG('Keyboard hidden');
  }

  componentDidMount() {
    Analytics.screen('Create Account');
  }

  createAccount() {
    if (this.state.emailValidation && this.state.password) {
      if (this.state.password.length < 8) {
        Alert.alert('Invalid password', 'Passwords must be at least 8 characters');
        return;
      }
      this.props.dispatch(createAccountAction(this.state.email, this.state.password)).then((results) => {
        if (results.errors) {
          Alert.alert('Error', `${results.errors}`);
        } else {
          this.props.navigatePush('voke.SignUpProfile');
        }
      }).catch((err) => {
        LOG('error', err);
        if (err && err.errors && err.errors.includes('Email has already been taken')) {
          Alert.alert('Error Creating Account', 'Email has already been taken.');
        }
      });
    } else {
      Alert.alert('Invalid email/password', 'Please enter a valid email and password');
    }
    // // This is just for testing
    // this.props.navigatePush('voke.SignUpProfile');
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={Platform.OS === 'android' ? 'handled' : 'always'} style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <SignUpHeader
            title="Create Account"
            description="You are moments away from impacting your friends"
            onPress={()=> Keyboard.dismiss()}
          />
          <Flex value={1} align="center" justify="center" style={styles.inputs}>
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder="Email"
              autoCorrect={true}
              blurOnSubmit={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => this.password.focus()}
            />
            <SignUpInput
              ref={(c) => this.password = c}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder="Password"
              secureTextEntry={true}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Create Account"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.createAccount}
              />
            </Flex>
            <Flex direction="column">
              <Text style={styles.legalText}>By creating an account you agree to our </Text>
              <Flex direction="row" align="center" justify="center">
                <Button
                  text="Privacy Policy"
                  type="transparent"
                  buttonTextStyle={styles.legalLinkText}
                  style={styles.legalLink}
                  onPress={() => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY)}
                />
                <Text style={styles.legalText}>and
                </Text>
                <Button
                  text="Terms of Service"
                  type="transparent"
                  buttonTextStyle={styles.legalLinkText}
                  style={styles.legalLink}
                  onPress={() => this.handleLink(CONSTANTS.WEB_URLS.TERMS)}
                />
              </Flex>
            </Flex>
            <Flex direction="row" align="end" justify="center" style={styles.accountWrap}>
              <Text style={styles.haveAccountText}>Already have an account?</Text>
              <Button
                text="Sign In"
                type="transparent"
                buttonTextStyle={styles.haveAccountButton}
                style={styles.haveAccount}
                onPress={() => this.props.navigatePush('voke.LoginInput')}
              />
            </Flex>
          </Flex>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

SignUpAccount.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpAccount);
