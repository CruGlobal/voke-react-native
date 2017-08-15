import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';


import styles from './styles';
import { createAccountAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import BACK_ICON from '../../../images/back-arrow.png';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: BACK_ICON, // For iOS only
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
    if (this.state.emailValidation && this.state.password) {
      this.props.dispatch(createAccountAction(this.state.email, this.state.password)).then(() => {
        this.props.navigatePush('voke.SignUpProfile');
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
            />
            <TextInput
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
            <Text style={styles.legalText}>By creating an account you agree to our Privacy Policy and Terms of Service</Text>
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
