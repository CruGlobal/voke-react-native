import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import Analytics from '../../utils/analytics';

import styles from './styles';
import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme.js';
import { Flex, Text, Button, Icon, VokeIcon } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import LOGO from '../../../images/initial_voke.png';
// const SCOPE = ['public_profile', 'email'];

const EMAIL_REGEX = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const VERSION = 'v2.8';
const FIELDS = 'name,picture,about,cover,first_name,last_name';

class LoginInput extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: 'benlgauthier+voke1@gmail.com',
      password: 'password',
      emailActive: false,
      passwordActive: false,
      disabled: false,
      // emailValidation: false,
      emailValidation: true,
    };

    this.login = this.login.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  checkEmail(text) {
    if (EMAIL_REGEX.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  componentDidMount() {
    Analytics.screen('Login Input');
  }

  login() {
    //CHANGE BACK, ONLY FOR TESTING
    // if (this.state.emailValidation && this.state.password) {
    if (this.state.password) {
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

  facebookLogin() {
    LOG('Making FB Call');
    LoginManager.logInWithReadPermissions(['public_profile']).then((result)=>{
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
            version: VERSION,
            accessToken,
            parameters: {
              fields: {
                string: FIELDS,
              },
            },
          };
          // Create a graph request asking for user information with a callback to handle the response.
          const infoRequest = new GraphRequest('/me', getMeConfig, (err, meResult) => {
            if (err) {
              LOG('error getting facebook user', err);
              return;
            }
            LOG('me', meResult);
            this.props.dispatch(facebookLoginAction(accessToken)).then(()=> {
              this.props.dispatch(getMe()).then((results)=>{
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
        <StatusBar />
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
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
              style={{ padding: 5 }}
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
              underlineColorAndroid="transparent"
              selectionColor={COLORS.YELLOW}
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
              underlineColorAndroid="transparent"
              selectionColor={COLORS.YELLOW}
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
              onPress={()=> this.props.navigatePush('voke.ForgotPassword')}
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
