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

class LoginInput extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      active: false,
      active2: false,
      disabled: false,
      emailValidation: false,
    };

    this.login = this.login.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  checkEmail(text) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  login() {
    if (this.state.emailValidation && this.state.password){
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
              onFocus={() => this.setState({active: true})}
              onBlur={() => this.setState({active: false})}
              value={this.state.email}
              autoCapitalize= "none"
              onChangeText={(text) => this.checkEmail(text)}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={this.state.active ? theme.textColor : theme.accentColor}
              style={this.state.active ? [styles.inputBox, styles.active] : styles.inputBox}
              autoCorrect={false}
            />
            <TextInput
              ref={(c) => this.password = c}
              onFocus={() => this.setState({active2: true})}
              onBlur={() => this.setState({active2: false})}
              autoCapitalize= "none"
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              multiline={false}
              placeholder="Password"
              placeholderTextColor={this.state.active2 ? theme.textColor : theme.accentColor}
              style={this.state.active2 ? [styles.inputBox, styles.active] : styles.inputBox}
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
                onPress={this.login}
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
