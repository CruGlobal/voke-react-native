import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';


import styles from './styles';
import { anonLogin } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme.js';
import { Flex, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import LOGO from '../../../images/initial_voke.png';

const EMAIL_REGEX = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

class LoginInput extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: 'bengauthier@knights.ucf.edu',
      password: 'password',
      emailActive: false,
      passwordActive: false,
      disabled: false,
      // emailValidation: false,
      emailValidation: true,
    };

    this.login = this.login.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  checkEmail(text) {
    if (EMAIL_REGEX.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  login() {
    if (this.state.emailValidation && this.state.password) {
      this.props.dispatch(anonLogin(
        this.state.email,
        this.state.password
      )).then(() => {
        this.props.navigateResetHome();
      });
    } else {
      Alert.alert('Please enter a valid email and password','');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <StatusBar />
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
          <Flex direction="column" value={.8} align="center" justify="end" style={styles.logoWrapper}>
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
            </Flex>
          </Flex>
          <Flex value={1.2} align="center" justify="end" style={styles.actions}>
            <TextInput
              ref={(c) => this.email = c}
              onFocus={() => this.setState({emailActive: true})}
              onBlur={() => this.setState({emailActive: false})}
              value={this.state.email}
              autoCapitalize= "none"
              onChangeText={(text) => this.checkEmail(text)}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={this.state.emailActive ? theme.textColor : theme.accentColor}
              style={[
                styles.inputBox,
                this.state.emailActive ? styles.active : null,
              ]}
              autoCorrect={false}
            />
            <TextInput
              ref={(c) => this.password = c}
              onFocus={() => this.setState({passwordActive: true})}
              onBlur={() => this.setState({passwordActive: false})}
              autoCapitalize= "none"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              multiline={false}
              placeholder="Password"
              placeholderTextColor={this.state.passwordActive ? theme.textColor : theme.accentColor}
              style={[
                styles.inputBox,
                this.state.passwordActive ? styles.active : null,
              ]}
              autoCorrect={false}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Sign In"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.login}
              />
            </Flex>
            <Text>Forgot Password?</Text>
          </Flex>
          <Flex value={.6} direction="column" align="center" justify="start" style={styles.haveAccount}>
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Sign In with Facebook"
                buttonTextStyle={styles.signInButtonText}
                icon="account-box"
                style={this.state.disabled ? [styles.facebookButton, styles.disabled] : styles.facebookButton}
                onPress={()=>{console.warn('login with facebook');}}
              />
            </Flex>
            <Flex direction="row">
              <Text style={styles.signIn}>New to Voke? </Text>
              <Button
                text="Create Account"
                type="transparent"
                buttonTextStyle={styles.signInText}
                onPress={()=> this.props.navigatePush('voke.SignUpAccount')}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

LoginInput.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(LoginInput);
