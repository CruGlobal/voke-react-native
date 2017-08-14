import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { connect } from 'react-redux';


import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
// import { iconsMap } from '../../utils/iconMap';
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
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleNext = this.handleNext.bind(this);
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

  handleNext() {
    // this.props.navigateResetHome();
    this.props.navigatePush('voke.SignUpWelcome');
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <SignUpHeader
          title="Verification"
          description="Finally, enter the 4-Digit Code you received by TXT so we know you are a human."
        />
        <Flex value={1} align="center" justify="center" style={styles.inputs}>
          <Flex direction="row" align="center" justify="center">
            <Text>V-</Text>
            <TextInput
              onFocus={() => {}}
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
            onPress={this.handleNext}
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
      </Flex>
    );
  }
}

SignUpNumberVerify.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpNumberVerify);
