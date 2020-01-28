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
import {
  Flex,
  Button,
  Text,
  StatusBar,
  Touchable,
} from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import VOKE_LINK from '../../../images/vokebot_whole.png';
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
    const { t } = this.props;
    return (
      <Flex value={1}>
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={[st.f1, st.bgBlue]}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={
              theme.isAndroid ? undefined : st.hasNotch ? 45 : 20
            }
          >
            <Flex value={1} align="center" justify="end" style={[st.pb3]}>
              <Flex style={styles.shareWith}>
                <Image
                  resizeMode="contain"
                  source={VOKE_LINK}
                  style={styles.shareImage}
                />
                <Flex style={styles.shareBubble}>
                  <Text style={styles.chatText}>
                    {t('placeholder.whatIsFriendsName')}
                  </Text>
                </Flex>
                <Flex style={styles.chatTriangle} />
              </Flex>
              <Text style={styles.inputLabel}>
                {t('placeholder.firstName')}
              </Text>
              <SignUpInput
                value={this.state.name}
                type="new"
                onChangeText={t => this.setState({ firstName: t })}
                placeholder={t('placeholder.friendsName')}
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <Touchable
                onPress={() =>
                  this.setState({ showWhatsThis: !this.state.showWhatsThis })
                }
              >
                {this.state.showWhatsThis ? (
                  <Text style={styles.inputLabelExplanation}>
                    {t('placeholder.whyNeedFriendsName')}
                  </Text>
                ) : (
                  <Text style={styles.inputLabel}>
                    {t('placeholder.whyDoWeWantThis')}
                  </Text>
                )}
              </Touchable>
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text={t('continue')}
                type="filled"
                isLoading={this.state.isLoading}
                disabled={this.state.isLoading || !this.state.firstName}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.continue}
              />
            </Flex>
          </KeyboardAvoidingView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack
              onPress={() => this.props.dispatch(navigateBack())}
            />
          </Flex>
        </SafeArea>
      </Flex>
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
