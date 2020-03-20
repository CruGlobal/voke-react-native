import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { anonLogin, logoutAction } from '../../actions/auth';
import ApiLoading from '../ApiLoading';
import { Flex, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import FacebookButton from '../FacebookButton';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS, { RESET_ANON_USER } from '../../constants';
import {
  navigateBack,
  navigatePush,
  navigateResetHome,
} from '../../actions/nav';
import { keyboardShow, keyboardHide } from '../../utils/common';

class LoginInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      emailValidation: false,
      anonUserId: undefined,
      keyboardVisible: false,
    };

    this.login = this.login.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
  }

  componentDidMount() {
    const { t, isAnonUser, myId } = this.props;
    Analytics.screen(Analytics.s.Login);
    if (isAnonUser) {
      Alert.alert(t('login'), t('existingAccount'));
      this.setState({ anonUserId: myId });
    }

    this.keyboardShowListener = keyboardShow(this.keyboardShow);
    this.keyboardHideListener = keyboardHide(this.keyboardHide);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardShow = () => {
    clearTimeout(this.keyboardHideTimeout);
    this.setState({ keyboardVisible: true });
  };

  keyboardHide = () => {
    this.keyboardHideTimeout = setTimeout(() => {
      this.setState({ keyboardVisible: false });
    }, 200);
  };

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  login() {
    const { t, isAnonUser, dispatch } = this.props;
    const { emailValidation, email, password, anonUserId } = this.state;
    if (emailValidation && password) {
      this.setState({ isLoading: true });
      if (isAnonUser) {
        // log out and destroy anon devices
        dispatch(logoutAction()).then(() => {
          dispatch(anonLogin(email, password, anonUserId))
            .then(() => {
              this.setState({ isLoading: false });
              dispatch({ type: RESET_ANON_USER });
              dispatch(navigateResetHome());
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
        });
      } else {
        dispatch(anonLogin(email, password))
          .then(() => {
            this.setState({ isLoading: false });
            dispatch({ type: RESET_ANON_USER });
            dispatch(navigateResetHome());
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
    const { t, dispatch, isApiLoading } = this.props;
    const { email, password, isLoading, keyboardVisible } = this.state;
    return (
      <Flex style={styles.container} value={1} align="center" justify="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          <Flex
            direction="column"
            align="center"
            justify="end"
            style={styles.logoWrapper}
          >
            {keyboardVisible ? null : (
              <Flex style={styles.imageWrap} align="center" justify="center">
                <Image
                  resizeMode="contain"
                  source={LOGO}
                  style={styles.imageLogo}
                />
              </Flex>
            )}
          </Flex>
          <Flex
            align="center"
            justify="end"
            style={styles.actions}
            ref={x => Analytics.markSensitive(x)}
          >
            <SignUpInput
              value={email}
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
              value={password}
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
              onPress={() => dispatch(navigatePush('voke.ForgotPassword'))}
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
              <FacebookButton text={t('signInFb')} isSignIn={true} />
            </Flex>
          </Flex>
        </TouchableOpacity>
        {isLoading || isApiLoading ? (
          <ApiLoading showMS={15000} force={true} />
        ) : null}
      </Flex>
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  myId: auth.user ? auth.user.id : null,
  isAnonUser: auth.isAnonUser,
  isApiLoading: auth.apiActive > 0,
});

export default translate('login')(connect(mapStateToProps)(LoginInput));
