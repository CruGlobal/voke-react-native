import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS from '../../constants';

class LoginInput extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      // email: '',
      password: 'password',
      disabled: false,
      // emailValidation: false,
      // TODO: Remove these things
      email: 'benlgauthier+voke1@gmail.com',
      emailValidation: true,
    };

    this.login = this.login.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  componentDidMount() {
    Analytics.screen('Login Input');
  }

  login() {
    if (this.state.emailValidation && this.state.password) {
      this.props.dispatch(anonLogin(
        this.state.email,
        this.state.password
      )).then((results) => {
        LOG('login results', results);
        this.props.navigateResetHome();
      }).catch(() => {});
    } else {
      Alert.alert('Invalid email/password', 'Please enter a valid email and password');
    }
  }

  facebookLogin() {
    LOG('Making FB Call');
    LoginManager.logInWithReadPermissions(CONSTANTS.FACEBOOK_SCOPE).then((result) => {
      LOG('RESULT', result);
      if (result.isCancelled) {
        LOG('facebook login was canceled', result);
      } else {
        LOG('successful facebook login', result);
        AccessToken.getCurrentAccessToken().then((data) => {
          if (!data.accessToken) {
            LOG('access token doesnt exist');
            return;
          }
          const accessToken = data.accessToken.toString();
          const getMeConfig = {
            version: CONSTANTS.FACEBOOK_VERSION,
            accessToken,
            parameters: {
              fields: {
                string: CONSTANTS.FACEBOOK_FIELDS,
              },
            },
          };
          // Create a graph request asking for user information with a callback to handle the response.
          const infoRequest = new GraphRequest('/me', getMeConfig, (err, meResult) => {
            if (err) {
              LOG('error getting facebook user', err);
              return;
            }
            LOG('facebook me', meResult);
            this.props.dispatch(facebookLoginAction(accessToken)).then(() => {
              this.props.dispatch(getMe()).then((results) => {
                if (results.state === 'configured') {
                  this.props.navigateResetHome();
                } else {
                  this.props.navigatePush('voke.SignUpFBAccount', {
                    me: meResult,
                  });
                }
              });
            });
          });
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      }
    }, (err) => {
      LOG('err', err);
      LoginManager.logOut();
    }).catch(() => {
      LOG('catch');
    });
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <Flex direction="column" value={.8} align="center" justify="end" style={styles.logoWrapper}>
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
            </Flex>
          </Flex>
          <Flex value={1.2} align="center" justify="end" style={styles.actions}>
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder="Email"
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
          <Flex value={.6} direction="column" align="center" justify="start" style={styles.haveAccount}>
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Sign In with Facebook"
                buttonTextStyle={styles.signInButtonText}
                icon="account-box"
                style={this.state.disabled ? [styles.facebookButton, styles.disabled] : styles.facebookButton}
                onPress={this.facebookLogin}
              />
            </Flex>
            <Flex direction="row">
              <Text style={styles.signIn}>New to Voke? </Text>
              <Button
                text="Create Account"
                type="transparent"
                buttonTextStyle={styles.signInText}
                onPress={() => this.props.navigatePush('voke.SignUpAccount')}
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
