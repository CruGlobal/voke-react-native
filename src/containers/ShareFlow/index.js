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
import {
  createConversation,
  getConversation,
  deleteConversation,
} from '../../actions/messages';
import {
  navigateBack,
  navigateResetMessage,
  navigatePush,
} from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
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
    conversation: null,
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
        conversation: {
          messengers_attributes: [
            {
              first_name: name,
            },
          ],
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
      dispatch(createConversation(createData))
        .then(results => {
          // Grab the friendfrom the results
          const friend = results.messengers[0];
          // LOG('create voke conversation results', results);
          dispatch(getConversation(results.id))
            .then(c => {
              this.setState(
                {
                  conversationUrl: friend.url,
                  conversation: c.conversation,
                  isLoading: false,
                },
                () => resolve(),
              );
            })
            .catch(fail);
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
          LOG('shared!', activityType);
          // Navigate to the new conversation after sharing
          dispatch(
            navigateResetMessage({
              conversation: this.state.conversation,
            }),
          );
        } else {
          LOG('not shared!');
          this.setState({ showOverlay: false });
          // Delete the conversation
          dispatch(deleteConversation(this.state.conversation.id)).then(() => {
            this.setState({
              conversationUrl: '',
              conversation: null,
            });
          });
        }
      })
      .catch(err => {
        this.setState({ showOverlay: false });
        LOG('Share Error', err);
      });
  };

  openAddrBook = () => {
    Keyboard.dismiss();
    this.props.dispatch(
      navigatePush('voke.SelectFriend', {
        video: this.props.video.id,
      }),
    );
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
          <Text style={styles.chatText}>
            {t('linkReady', { name: this.state.name })}
          </Text>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <SafeArea style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
            style={{ paddingTop: 50 }}
          >
            <Flex style={styles.shareWith}>
              <Image
                resizeMode="contain"
                source={VOKE_LINK}
                style={styles.shareImage}
              />
              <Flex style={styles.shareBubble}>
                <Text style={styles.chatText}>
                  {t('who')}{' '}
                  <Text style={{ color: theme.secondaryColor }}>
                    "{this.props.video.name}"
                  </Text>{' '}
                  {t('with')} {this.props.isFirstTime ? t('noNeed') : null}
                </Text>
              </Flex>
            </Flex>
            <Flex justify="center" align="center" style={styles.actions}>
              <SignUpInput
                ref={x => Analytics.markSensitive(x)}
                value={this.state.name}
                onChangeText={t => this.setState({ name: t })}
                placeholder={t('placeholder.friendsName')}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <Button
                text={t('share')}
                disabled={this.state.isLoading || !this.state.name}
                type={this.state.name ? 'filled' : 'disabled'}
                style={styles.shareButton}
                onPress={this.share}
              />
              <Flex direction="row" align="center">
                <Flex value={1} style={styles.line} />
                <Text style={styles.orText}>{t('or').toUpperCase()}</Text>
                <Flex value={1} style={styles.line} />
              </Flex>
              <Button
                text={t('openAddr')}
                type="filled"
                style={styles.addrButton}
                onPress={this.openAddrBook}
              />
            </Flex>
          </TouchableOpacity>
          {this.renderOverlay()}
        </KeyboardAvoidingView>
        {this.state.isLoading ? (
          <ApiLoading force={true} text={t('loading.share')} />
        ) : null}
        <Flex
          style={{ position: 'absolute', top: st.hasNotch ? 20 : 0, left: 0 }}
          align="start"
        >
          <SignUpHeaderBack onPress={this.quit} />
        </Flex>
      </SafeArea>
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
