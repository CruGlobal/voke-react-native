import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { forgotPasswordAction } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme.js';
import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import LOGO from '../../../images/initial_voke.png';
import { vokeIcons } from '../../utils/iconMap';


const EMAIL_REGEX = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
  };
}

class ForgotPassword extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: 'bengauthier@knights.ucf.edu',
      // emailValidation: false,
      emailValidation: true,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.checkEmail = this.checkEmail.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  checkEmail(text) {
    if (EMAIL_REGEX.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  resetPassword() {
    if (this.state.emailValidation) {
      this.props.dispatch(forgotPasswordAction(this.state.email)).then(() => {
        LOG('resetting password');
        Alert.alert('Check your Email', 'We sent you an email with instructions for resetting your password', [
          {
            text: 'OK',
            onPress: () => this.props.navigateBack(),
          },
        ]);
      });
    }
    else {
      Alert.alert('Please enter a valid email','');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <StatusBar />
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
          <Flex direction="column" value={1} align="center" justify="end" style={styles.logoWrapper}>
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
            </Flex>
            <Text style={styles.description}>Please enter your email to reset your password</Text>
          </Flex>
          <Flex value={1.5} align="center" justify="start" style={styles.actions}>
            <TextInput
              ref={(c) => this.email = c}
              value={this.state.email}
              autoCapitalize= "none"
              onChangeText={(text) => this.checkEmail(text)}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={false}
              underlineColorAndroid="transparent"
              selectionColor={COLORS.YELLOW}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Send"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.resetPassword}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

ForgotPassword.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(ForgotPassword);
