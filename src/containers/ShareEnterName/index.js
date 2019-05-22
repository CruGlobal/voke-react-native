import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import styles from './styles';
import { navigateBack } from '../../actions/nav';
import { Flex, Button, Text, StatusBar } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import theme from '../../theme';
import st from '../../st';
import { sendJourneyInvite } from '../../actions/journeys';
import { keyboardShow, keyboardHide } from '../../utils/common';

class ShareEnterName extends Component {
  state = {
    isLoading: false,
    firstName: '',
    keyboardVisible: false,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.ShareEnterName);

    this.keyboardShowListener = keyboardShow(this.keyboardShow);
    this.keyboardHideListener = keyboardHide(this.keyboardHide);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardShow = () => {
    this.setState({ keyboardVisible: true });
  };

  keyboardHide = () => {
    this.setState({ keyboardVisible: false });
  };

  continue = async () => {
    const { dispatch, item } = this.props;
    const { firstName } = this.state;
    const name = (firstName || '').trim();
    try {
      this.setState({ isLoading: true });
      const result = await dispatch(
        sendJourneyInvite({
          organization_journey_id: item.id,
          name,
        }),
      );
      dispatch(
        navigatePush('voke.ShareJourneyInvite', {
          journeyInvite: result,
          friendName: name,
        }),
      );
    } catch (error) {
      LOG('error', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { t, dispatch } = this.props;
    const { isLoading, firstName, keyboardVisible } = this.state;
    return (
      <View style={styles.container} align="center">
        <StatusBar hidden={false} />
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={
              theme.isAndroid ? undefined : st.hasNotch ? 45 : 20
            }
          >
            {keyboardVisible ? (
              <Flex style={[st.pt(60)]} />
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                style={[st.pt(60)]}
                onPress={() => Keyboard.dismiss()}
              >
                <Flex align="center" justify="center">
                  <Flex style={styles.chatBubble}>
                    <Text style={styles.chatText}>
                      {t('whatIsFriendsName')}
                    </Text>
                  </Flex>
                  <Flex style={styles.chatTriangle} />
                </Flex>
                <Image
                  resizeMode="contain"
                  source={VOKE_FIRST_NAME}
                  style={styles.imageLogo}
                />
              </TouchableOpacity>
            )}
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
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
            <Flex value={1} justify="end">
              <Button
                text={t('continue')}
                type="filled"
                isLoading={isLoading}
                disabled={isLoading || !firstName}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.continue}
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

ShareEnterName.propTypes = {
  item: PropTypes.object,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('share')(connect(mapStateToProps)(ShareEnterName));
