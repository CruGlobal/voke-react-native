import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { anonLogin, logoutAction } from '../../actions/auth';
import ApiLoading from '../ApiLoading';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import FacebookButton from '../FacebookButton';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS, { RESET_ANON_USER } from '../../constants';

class LoginInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      emailValidation: false,
      // TODO: Remove these things
      // email: 'benlgauthier+voke1@gmail.com',
      // emailValidation: true,
      // password: 'password',
    };

    this.login = this.login.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  componentDidMount() {
    Analytics.screen('Login Input');
    if (this.props.isAnonUser) {
      Alert.alert('Login', 'If you login with an existing account, you will lose any activity that you have on the guest account you have been using. If you would like to save this activity, please go back and create a new account.');
    }
  }

  login() {
    if (this.state.emailValidation && this.state.password) {
      this.setState({ isLoading: true });
      if (this.props.isAnonUser) {
        // log out and destroy anon devices
        this.props.dispatch(logoutAction()).then(()=> {
          this.props.dispatch(anonLogin(
            this.state.email,
            this.state.password
          )).then(() => {
            this.setState({ isLoading: false });
            this.props.dispatch({ type: RESET_ANON_USER });
            this.props.navigateResetHome();
          }).catch(() => {
            this.setState({ isLoading: false });
          });
        });
      } else {
        this.props.dispatch(anonLogin(
          this.state.email,
          this.state.password
        )).then(() => {
          this.setState({ isLoading: false });
          this.props.dispatch({ type: RESET_ANON_USER });
          this.props.navigateResetHome();
        }).catch(() => {
          this.setState({ isLoading: false });
        });
      }
    } else {
      Alert.alert('Invalid email/password', 'Please enter a valid email and password');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <Flex direction="column" align="center" justify="end" style={styles.logoWrapper}>
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
            </Flex>
          </Flex>
          <Flex align="center" justify="end" style={styles.actions}>
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder="Email"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
            />
            <SignUpInput
              ref={(c) => this.password = c}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder="Password"
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Sign In"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.login}
              />
            </Flex>
            <Button
              text="Forgot Password?"
              type="transparent"
              buttonTextStyle={styles.signInText}
              onPress={() => this.props.navigatePush('voke.ForgotPassword')}
            />
          </Flex>
          <Flex value={1} direction="column" align="center" justify="center" style={styles.haveAccount}>
            <Flex style={styles.buttonWrapper}>
              <FacebookButton
                text="Sign In with Facebook"
                isSignIn={true}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
        {
          this.state.isLoading ? <ApiLoading force={true} /> : null
        }
      </Flex>
    );
  }
}

LoginInput.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isAnonUser: auth.isAnonUser,
});

export default connect(mapStateToProps, nav)(LoginInput);
