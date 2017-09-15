import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput, ScrollView, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { createAccountAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme';

import { Flex, Text, Button, VokeIcon, Icon } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';
import CONSTANTS from '../../constants';

// function setButtons() {
//   return {
//     leftButtons: [{
//       id: 'back', // Android implements this already
//       icon: vokeIcons['back'], // For iOS only
//     }],
//   };
// }

const EMAIL_REGEX = /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

class SignUpAccount extends Component {
  static navigatorStyle = {
    // screenBackgroundColor: theme.primaryColor,
    // navBarButtonColor: theme.lightText,
    // navBarTextColor: theme.headerTextColor,
    // navBarBackgroundColor: theme.primaryColor,
    // navBarNoBorder: true,
    // topBarElevationShadowEnabled: false,
    navBarHidden: true,
  };


  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValidation: false,
    };
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.createAccount = this.createAccount.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  // onNavigatorEvent(event) {
  //   if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
  //     if (event.id == 'back') {
  //       this.props.navigateBack();
  //     }
  //   }
  // }

  componentDidMount() {
    Analytics.screen('Create Account');
  }

  // componentWillMount() {
    // this.props.navigator.setButtons(setButtons());
  // }

  createAccount() {
    if (this.state.emailValidation && this.state.password) {
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
    const emailValidation = EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
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
          <Flex
            style={{
              paddingTop: Platform.OS === 'android' ? 10 : 35,
              paddingLeft: Platform.OS === 'android' ? 15 : 30,
              alignSelf: 'flex-start',
            }}
          >
            <Button
              onPress={() => this.props.navigateBack()}
              type="transparent"
              style={{padding: 5}}
            >
              {
                Platform.OS === 'android' ? (
                  <Icon name="arrow-back" size={30} />
                ) : (
                  <VokeIcon name="back" />
                )
              }
            </Button>
          </Flex>

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
              selectionColor={COLORS.YELLOW}
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
              underlineColorAndroid="transparent"
              selectionColor={COLORS.YELLOW}
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
                  onPress={() => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY)}
                />
                <Text style={styles.legalText}>and
                </Text>
                <Button
                  text="Terms of Service"
                  type= "transparent"
                  buttonTextStyle={styles.legalLinkText}
                  style={styles.legalLink}
                  onPress={() => this.handleLink(CONSTANTS.WEB_URLS.TERMS)}
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
