import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { CREATE_ANON_USER } from '../../constants';

import { navigatePush } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import { createAccountAction, setupFirebaseLinks } from '../../actions/auth';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import { navigateBack } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import theme, { COLORS } from '../../theme';
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
    const { dispatch } = this.props;

    Keyboard.dismiss();
    if (!this.state.firstName) {
      Alert.alert('First Name is required');
      return;
    }

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
    const { t } = this.props;
    this.setState({ isLoading: true });
    let nameData = {
      me: {
        first_name: this.state.firstName,
      },
    };
    if (this.state.lastName) {
      nameData = {
        me: {
          ...nameData.me,
          last_name: this.state.lastName,
        },
      };
    }
    this.props
      .dispatch(updateMe(nameData))
      .then(() => {
        this.setState({ isLoading: false });
        if (this.props.onComplete) {
          this.props.onComplete();
        } else {
          this.props.dispatch(navigatePush('voke.TryItNowProfilePhoto'));
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
        Alert.alert('', t('error.tryAgain'));
      });
  };

  render() {
    const { t, dispatch } = this.props;
    return (
      <View style={styles.container} align="center">
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={theme.isAndroid ? undefined : 0}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ paddingTop: 70 }}
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
            <Flex align="center" justify="start" style={[styles.actions]}>
              <Text style={styles.inputLabel}>First Name (Required)</Text>
              <SignUpInput
                value={this.state.firstName}
                type="new"
                onChangeText={t => this.setState({ firstName: t })}
                placeholder="First"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <Text style={styles.inputLabel}>Last Name</Text>
              <SignUpInput
                value={this.state.lastName}
                type="new"
                onChangeText={t => this.setState({ lastName: t })}
                placeholder="Last"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text="Continue"
                type="filled"
                disabled={this.state.isLoading || !this.state.firstName}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.createAccount}
              />
            </Flex>
          </KeyboardAvoidingView>
          <Flex style={{ position: 'absolute', top: 0, left: 0 }} align="start">
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
