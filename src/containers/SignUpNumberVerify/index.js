import React, { Component } from 'react';
import { TextInput, Alert, Keyboard, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { verifyMobile, createMobileVerification } from '../../actions/auth';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
// import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';

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

class SignUpNumberVerify extends Component {
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

    this.state= {
      code: '',
      verificationSent: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleNext = this.handleNext.bind(this);
    this.resendCode = this.resendCode.bind(this);
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

  resendCode() {
    let data = {
      mobile: {
        mobile: this.props.mobile,
      },
    };
    if (!this.state.verifcationSent) {
      this.props.dispatch(createMobileVerification(data)).then(()=> {
        Alert.alert('New verification code sent', '');
      });
      this.setState({ verificationSent: true });
    } else {
      Alert.alert('A new verification code has already been sent, please wait a few seconds before re-sending','');
    }
    setTimeout(()=> {
      this.setState({ verifcationSent: false });
    }, 3000);
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
      this.props.dispatch(verifyMobile(data)).then(()=> {
        this.props.navigateResetHome();
      });
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
          <SignUpHeader
            title="Verification"
            description="Finally, enter the 4-Digit Code you received by TXT so we know you are a human."
          />
          <Flex value={1} align="center" justify="center" style={styles.inputs}>
            <Flex direction="row" align="center" justify="center">
              <Text>V-</Text>
              <TextInput
                onFocus={() => {}}
                keyboardType="numeric"
                onBlur={() => {}}
                value={this.state.code}
                onChangeText={(text) => this.setState({ code: text })}
                multiline={false}
                placeholder="Verification Code"
                placeholderTextColor={theme.accentColor}
                style={styles.inputBox}
                autoCorrect={false}
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
