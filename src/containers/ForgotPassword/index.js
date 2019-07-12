import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { forgotPasswordAction } from '../../actions/auth';
import { navigateBack } from '../../actions/nav';

import { Flex, Text, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';
import CONSTANTS from '../../constants';
import st from '../../st';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValidation: false,
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.ForgotPassword);
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  back = () => this.props.dispatch(navigateBack());

  forgotPassword() {
    const { t, dispatch } = this.props;
    if (this.state.emailValidation) {
      dispatch(forgotPasswordAction(this.state.email)).then(() => {
        LOG('resetting password');
        Alert.alert(t('checkEmail'), t('emailPrompt'), [
          { text: t('ok'), onPress: this.back },
        ]);
      });
    } else {
      Alert.alert(t('invalid'), t('enter'));
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Flex style={styles.container} value={1} align="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={this.back} />
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={styles.logoWrapper}
          >
            <Image
              resizeMode="contain"
              source={LOGO}
              style={styles.imageLogo}
            />
            <Text style={styles.description}>{t('description')}</Text>
          </Flex>
          <Flex
            value={1.5}
            align="center"
            justify="start"
            style={styles.actions}
          >
            <SignUpInput
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder={t('placeholder.email')}
              keyboardType="email-address"
              style={st.isAndroid ? styles.input : undefined}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text={t('send')}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.forgotPassword}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

export default translate('forgotPassword')(connect()(ForgotPassword));
