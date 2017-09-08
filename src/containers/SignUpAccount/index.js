import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView, KeyboardAvoidingView, Alert, Linking } from 'react-native';


import styles from './styles';
import { createAccountAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { vokeIcons } from '../../utils/iconMap';
import theme, { COLORS } from '../../theme';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: vokeIcons['back'], // For iOS only
    }],
  };
}

class SignUpAccount extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  };


  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValidation: false,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.createAccount = this.createAccount.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  createAccount() {
    // PUT THIS BACK IN, JUST FOR TESTING
    // if (this.state.emailValidation && this.state.password) {
    if (this.state.password) {
      this.props.dispatch(createAccountAction(this.state.email, this.state.password)).then((results) => {
        if (results.errors) {
          Alert.alert('Error', `${results.errors}`);
        }
        else {
          this.props.navigatePush('voke.SignUpProfile');
        }
      });
    } else {
      Alert.alert('Please enter a valid email and password','');
    }
  }

  checkEmail(text) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <ScrollView style={styles.container} value={1} align="center" justify="center">
        <KeyboardAvoidingView
          behavior="padding"
        >
          <StatusBar />
          <SignUpHeader
            title="Create Account"
            description="You are moments away from impacting your friends"
          />
          <Flex value={1} align="center" justify="center" style={styles.inputs}>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.email}
              onChangeText={(text) => this.checkEmail(text)}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
            <TextInput
              underlineColorAndroid="transparent"
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              multiline={false}
              placeholder="Password"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={false}
              secureTextEntry={true}
              autoCapitalize="none"
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
                  type= "transparent"
                  buttonTextStyle={styles.legalLinkText}
                  style={styles.legalLink}
                  onPress={() => this.handleLink('https://www.vokeapp.com/privacy-in-app/')}
                />
                <Text style={styles.legalText}>and
                </Text>
                <Button
                  text="Terms of Service"
                  type= "transparent"
                  buttonTextStyle={styles.legalLinkText}
                  style={styles.legalLink}
                  onPress={() => this.handleLink('https://www.vokeapp.com/terms-in-app/')}
                />
              </Flex>
            </Flex>
            <Flex direction="row" align="end" justify="center" style={styles.accountWrap}>
              <Text style={styles.haveAccountText}>Already have an account? </Text>
              <Button
                text="Sign In"
                type= "transparent"
                buttonTextStyle={styles.haveAccountButton}
                style={styles.haveAccount}
                onPress={()=> this.props.navigatePush('voke.LoginInput')}
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
