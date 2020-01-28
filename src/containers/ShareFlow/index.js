import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  Share,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
// import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';
import { createShare } from '../../actions/messages';
import { navigateBack, navigateResetHome } from '../../actions/nav';
import { Flex, Button, Text, Touchable } from '../../components/common';
import ApiLoading from '../ApiLoading';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_LINK from '../../../images/vokebot_whole.png';
import theme from '../../theme';
import SafeArea from '../../components/SafeArea';
import st from '../../st';

class ShareFlow extends Component {
  state = {
    isLoading: false,
    showOverlay: false,
    name: '',
    conversationUrl: '',
    showWhatsThis: false,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.ShareName);
  }

  quit = () => {
    this.props.dispatch(navigateBack());
  };

  createConversationId() {
    const { t, dispatch, video } = this.props;
    const { name } = this.state;
    return new Promise((resolve, reject) => {
      const createData = {
        share: {
          first_name: name,
          item_id: `${video.id}`,
        },
      };

      // Show an alert when either API call fails
      const fail = () => {
        Alert.alert('', t('errorCreating'));
        this.setState({ isLoading: false });
        reject();
      };

      this.setState({ isLoading: true });
      dispatch(createShare(createData))
        .then(results => {
          this.setState(
            {
              conversationUrl: results.url,
              isLoading: false,
            },
            () => resolve(),
          );
        })
        .catch(fail);
    });
  }

  share = () => {
    Keyboard.dismiss();
    const { t } = this.props;
    const { name } = this.state;
    if (!name) {
      Alert.alert('', t('enterName'));
      return;
    }

    // Always create a new conversation id
    this.createConversationId().then(this.shareDialog);
  };

  shareDialog = () => {
    const { t, dispatch } = this.props;
    this.setState({ showOverlay: true });
    // Android uses message, not url
    Share.share(
      {
        message: this.state.conversationUrl,
        tintColor: '#fff',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.PostToTwitter',
        ],
      },
      {
        dialogTitle: t('share'),
      },
    )
      .then(({ action, activityType }) => {
        if (action === Share.sharedAction) {
          this.setState({ showOverlay: true });
          dispatch(navigateResetHome());
        } else {
          this.setState({ showOverlay: false });
          this.setState({
            conversationUrl: '',
          });
        }
      })
      .catch(err => {
        this.setState({ showOverlay: false });
        LOG('Share Error', err);
      });
  };

  renderOverlay() {
    const { t } = this.props;
    if (!this.state.showOverlay) return null;
    return (
      <Flex style={styles.overlay}>
        <Image
          resizeMode="contain"
          source={VOKE_LINK}
          style={styles.overlayImage}
        />
        <Flex style={styles.chatBubble}>
          <Text style={[st.blue]}>
            {t('linkReady', { name: this.state.name })}
          </Text>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;
    if (!this.props.video || !this.props.video.name) return null;
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
                onChangeText={t => this.setState({ name: t })}
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
                disabled={this.state.isLoading || !this.state.name}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.share}
              />
            </Flex>
            {this.renderOverlay()}
            {this.state.isLoading ? (
              <ApiLoading
                showMS={15000}
                force={true}
                text={t('loading.share')}
              />
            ) : null}
          </KeyboardAvoidingView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack onPress={this.quit} />
          </Flex>
        </SafeArea>
      </Flex>
    );
  }
}

ShareFlow.propTypes = {
  video: PropTypes.object.isRequired,
};
const mapStateToProps = ({ messages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isFirstTime: messages.conversations.length < 2,
});

export default translate('shareFlow')(connect(mapStateToProps)(ShareFlow));
