import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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
    const { t, isAnonUser } = this.props;
    Analytics.screen('Login Input');
    if (isAnonUser) {
      Alert.alert(t('login'), t('existingAccount'));
    }
  }

  login() {
    const { t, isAnonUser, dispatch, navigateResetHome } = this.props;
    if (this.state.emailValidation && this.state.password) {
      this.setState({ isLoading: true });
      if (isAnonUser) {
        // log out and destroy anon devices
        dispatch(logoutAction()).then(() => {
          dispatch(anonLogin(this.state.email, this.state.password))
            .then(() => {
              this.setState({ isLoading: false });
              dispatch({ type: RESET_ANON_USER });
              navigateResetHome();
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
        });
      } else {
        dispatch(anonLogin(this.state.email, this.state.password))
          .then(() => {
            this.setState({ isLoading: false });
            dispatch({ type: RESET_ANON_USER });
            navigateResetHome();
          })
          .catch(() => {
            this.setState({ isLoading: false });
          });
      }
    } else {
      Alert.alert(t('invalid'), t('enterValid'));
    }
  }

  render() {
    const { t, navigateBack, navigatePush, isAnonUser } = this.props;
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => navigateBack()} />
          <Flex
            direction="column"
            align="center"
            justify="end"
            style={styles.logoWrapper}
          >
            <Flex style={styles.imageWrap} align="center" justify="center">
              <Image
                resizeMode="contain"
                source={LOGO}
                style={styles.imageLogo}
              />
            </Flex>
          </Flex>
          <Flex align="center" justify="end" style={styles.actions}>
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder={t('placeholder.email')}
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
            />
            <SignUpInput
              ref={c => (this.password = c)}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
              placeholder={t('placeholder.password')}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text={t('signIn')}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.login}
              />
            </Flex>
            <Button
              text={t('forgotPassword')}
              type="transparent"
              buttonTextStyle={styles.signInText}
              onPress={() => navigatePush('voke.ForgotPassword')}
            />
          </Flex>
          <Flex
            value={1}
            direction="column"
            align="center"
            justify="center"
            style={styles.haveAccount}
          >
            <Flex style={styles.buttonWrapper}>
              <FacebookButton
                text={t('signInFb')}
                isSignIn={true}
                isAnonUser={isAnonUser}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
        {this.state.isLoading ? <ApiLoading force={true} /> : null}
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

export default translate('login')(
  connect(
    mapStateToProps,
    nav,
  )(LoginInput),
);
