import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { CREATE_ANON_USER } from '../../constants';

import { navigatePush } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import { createAccountAction } from '../../actions/auth';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import { navigateBack } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import theme from '../../theme';
import st from '../../st';

class TryItNowName extends Component {
  state = {
    isLoading: false,
    firstName: '',
    lastName: '',
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.TryItName);
  }

  createAccount = () => {
    const { dispatch, t } = this.props;

    Keyboard.dismiss();
    if (!this.state.firstName) {
      Alert.alert(t('firstNameRequired'));
      return;
    }
    if (this.state.isLoading) {
      return;
    }
    this.setState({ isLoading: true });

    dispatch(createAccountAction(null, null, true))
      .then(results => {
        LOG('create try it now account results', results);
        dispatch({ type: CREATE_ANON_USER });
        this.updateAcct();

        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  };

  updateAcct = () => {
    const { t, dispatch, onComplete } = this.props;
    const { firstName, lastName } = this.state;
    this.setState({ isLoading: true });
    let nameData = {
      me: {
        first_name: firstName,
      },
    };
    if (lastName) {
      nameData.me.last_name = lastName;
    }
    dispatch(updateMe(nameData))
      .then(() => {
        this.setState({ isLoading: false });
        if (onComplete) {
          onComplete();
        } else {
          dispatch(navigatePush('voke.AdventureCode', { onboarding: true }));
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
        Alert.alert('', t('error.tryAgain'));
      });
  };

  render() {
    const { t, dispatch } = this.props;
    const { firstName, lastName, isLoading } = this.state;
    return (
      <View style={styles.container} align="center">
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={theme.isAndroid ? undefined : 45}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ paddingTop: 60 }}
              onPress={() => Keyboard.dismiss()}
            >
              <Flex align="center" justify="center">
                <Flex style={styles.chatBubble}>
                  <Text style={styles.chatText}>{t('whatsYourName')}</Text>
                </Flex>
                <Flex style={styles.chatTriangle} />
              </Flex>
              <Image
                resizeMode="contain"
                source={VOKE_FIRST_NAME}
                style={styles.imageLogo}
              />
            </TouchableOpacity>
            <Flex
              align="center"
              justify="start"
              style={[styles.actions, st.mb4]}
            >
              <Text style={styles.inputLabel}>{t('firstName')}</Text>
              <SignUpInput
                value={firstName}
                type="new"
                onChangeText={text => this.setState({ firstName: text })}
                placeholder={t('firstNamePlaceholder')}
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => this.lastNameInput.focus()}
                blurOnSubmit={true}
              />
              <Text style={styles.inputLabel}>{t('lastName')}</Text>
              <SignUpInput
                ref={c => (this.lastNameInput = c)}
                value={lastName}
                type="new"
                onChangeText={text => this.setState({ lastName: text })}
                placeholder={t('lastNamePlaceholder')}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={this.createAccount}
              />
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text={t('continue')}
                type="filled"
                disabled={isLoading || !firstName}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.createAccount}
              />
            </Flex>
          </KeyboardAvoidingView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          </Flex>
        </SafeArea>
      </View>
    );
  }
}

TryItNowName.propTypes = {
  onComplete: PropTypes.func,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('tryItNow')(connect(mapStateToProps)(TryItNowName));
