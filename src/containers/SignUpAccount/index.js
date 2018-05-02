import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, KeyboardAvoidingView, Linking, Alert, Keyboard } from 'react-native';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { createAccountAction, updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Text, Button } from '../../components/common';
import ApiLoading from '../ApiLoading';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import CONSTANTS from '../../constants';
import theme from '../../theme';

class SignUpAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      emailValidation: false,
    };
    // this.createAccount = this.createAccount.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Create Account');
  }

  moveForward(results) {
    if (results.errors) {
      Alert.alert('Error', `${results.errors}`);
    } else {
      this.props.navigatePush('voke.SignUpProfile');
    }
  }

  updateAnonAccount() {
    const data = {
      me: {
        email: this.state.email,
        password: this.state.password,
      },
    };
    this.setState({ isLoading: true });
    this.props.dispatch(updateMe(data)).then((results) => {
      this.setState({ isLoading: false });
      this.moveForward(results);
    }).catch((err) => {
      this.setState({ isLoading: false });
      LOG('error', err);
      if (err && err.errors && err.errors.includes('Email has already been taken')) {
        Alert.alert('Error Creating Account', 'Email has already been taken.');
      }
    });
  }
  //
  // createAccount() {
  //   if (this.state.emailValidation && this.state.password) {
  //     if (this.state.password.length < 8) {
  //       Alert.alert('Invalid password', 'Passwords must be at least 8 characters');
  //       return;
  //     }
  //     if (this.props.isAnonUser) {
  //       this.updateAnonAccount();
  //       return;
  //     }
  //     this.setState({ isLoading: true });
  //     this.props.dispatch(createAccountAction(this.state.email, this.state.password)).then((results) => {
  //       this.setState({ isLoading: false });
  //       this.moveForward(results);
  //     }).catch((err) => {
  //       this.setState({ isLoading: false });
  //       LOG('error', err);
  //       if (err && err.errors && err.errors.includes('Email has already been taken')) {
  //         Alert.alert('Error Creating Account', 'Email has already been taken.');
  //       }
  //     });
  //   } else {
  //     Alert.alert('Invalid email/password', 'Please enter a valid email and password');
  //   }
  //   // // This is just for testing
  //   // this.props.navigatePush('voke.SignUpProfile');
  // }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps={theme.isAndroid ? 'handled' : 'always'} style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={theme.isAndroid ? undefined : 'padding'}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <SignUpHeader
            title="Create Account"
            description="You are moments away from impacting your friends"
            onPress={()=> Keyboard.dismiss()}
          />
          <Flex value={1} align="center" justify="start" style={styles.inputs}>
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
                onPress={this.updateAnonAccount}
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
          </Flex>
        </KeyboardAvoidingView>
        {
          this.state.isLoading ? <ApiLoading force={true} /> : null
        }
      </ScrollView>
    );
  }
}

SignUpAccount.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isAnonUser: auth.isAnonUser,
});

export default connect(mapStateToProps, nav)(SignUpAccount);
