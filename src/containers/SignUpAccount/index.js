import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';


import styles from './styles';
import { createAccountAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';

import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: iconsMap['ios-arrow-back'], // For iOS only
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
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.createAccount = this.createAccount.bind(this);
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
    this.props.dispatch(createAccountAction('email@address.co', 'password')).then(() => {
      this.props.navigatePush('voke.SignUpProfile');
    });
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
          <Flex align="center" justify="center" style={styles.inputs}>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={theme.secondaryColor}
              style={styles.inputBox}
              autoCorrect={false}
            />
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              multiline={false}
              placeholder="Password"
              placeholderTextColor={theme.secondaryColor}
              style={styles.inputBox}
              autoCorrect={false}
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
            <Flex direction="row">
              <Text style={styles.haveAccountText}>Already have an account? </Text>
              <Button
                text="Sign In"
                type= "transparent"
                buttonTextStyle={styles.haveAccountButton}
                style={styles.haveAccount}
                onPress={this.createAccount}
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
