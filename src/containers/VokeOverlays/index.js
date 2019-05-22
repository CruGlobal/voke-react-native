import React, { Component } from 'react';
import { Image, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Button, Text, Touchable } from '../../components/common';
import CloseButton from '../../components/CloseButton';
import SignUpButtons from '../SignUpButtons';
import { CLEAR_OVERLAY } from '../../constants';
import VOKEBOT_UKE from '../../../images/voke_uke.png';
import VOKEBOT from '../../../images/vokebot_whole.png';
import NOTIFICATIONS from '../../../images/allow_notifications.png';
import styles from './styles';
import { enablePushNotifications } from '../../actions/socket';
import { keyboardShow, keyboardHide } from '../../utils/common';

class VokeOverlays extends Component {
  state = {
    keyboardShown: false,
  };

  componentDidMount() {
    this.keyboardShowListener = keyboardShow(this.keyboardDidShow);
    this.keyboardHideListener = keyboardHide(this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ keyboardShown: true });
  };

  keyboardDidHide = () => {
    this.setState({ keyboardShown: false });
  };

  close = () => {
    const { type, dispatch } = this.props;
    dispatch({ type: CLEAR_OVERLAY, value: type });
  };

  allowNotifications = () => {
    this.props.dispatch(enablePushNotifications(true));
    this.close();
  };

  renderSignUp() {
    const { t, overlayProps } = this.props;
    let channelName = overlayProps.channelName || '';
    return (
      <Flex
        style={styles.overlay}
        align="center"
        justify="center"
        self="stretch"
      >
        <Flex style={styles.close}>
          <CloseButton onClose={this.close} />
        </Flex>
        <Flex value={1} align="center" justify="center">
          <Text style={styles.title}>{t('subscribe')}</Text>
          <Text style={styles.subtitle}>
            {t('signUpChannel', { channel: channelName })}
          </Text>
        </Flex>
        <Flex value={1} align="center" justify="center">
          <SignUpButtons
            isSignIn={true}
            filled={true}
            onNavigate={this.close}
          />
        </Flex>
      </Flex>
    );
  }

  renderPushPermissions() {
    const { t, user } = this.props;
    return (
      <Flex
        style={styles.overlay}
        align="center"
        justify="center"
        self="stretch"
      >
        <Flex style={styles.chatBubble}>
          <Text style={styles.chatText}>
            {t('playUkulele', {
              name: user && user.first_name ? user.first_name : t('friend'),
            })}
          </Text>
        </Flex>
        <Flex style={styles.chatTriangle} />
        <Image
          source={VOKEBOT_UKE}
          style={{ height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Button
          onPress={this.allowNotifications}
          type="filled"
          style={styles.closeButton}
          text={t('allowNotifications')}
        />
        <Button
          onPress={this.close}
          style={styles.clearButton}
          text={t('noThanks')}
        />
      </Flex>
    );
  }

  renderAdventurePushPermissions() {
    const { t } = this.props;
    return (
      <Flex
        style={styles.overlay}
        align="center"
        justify="center"
        self="stretch"
      >
        <Image
          source={NOTIFICATIONS}
          style={{ height: 150, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={styles.adventurePushNotificationText}>
          {t('adventurePush')}
        </Text>
        <Button
          onPress={this.allowNotifications}
          type="filled"
          style={styles.closeButton}
          text={t('allowNotifications')}
        />
        <Button
          onPress={this.close}
          style={styles.clearButton}
          text={t('noThanks')}
        />
      </Flex>
    );
  }

  renderMessageModal() {
    const { t, overlayProps } = this.props;
    let messageData = overlayProps.messageData || {};
    return (
      <Touchable style={styles.overlay} onPress={this.close} activeOpacity={1}>
        <Flex
          style={styles.overlay}
          align="center"
          justify="center"
          self="stretch"
        >
          <Flex style={styles.chatBubble}>
            <Text style={styles.chatText}>{messageData.content}</Text>
          </Flex>
          <Flex style={styles.chatTriangle} />
          <Image
            source={VOKEBOT}
            style={{ height: 100, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Button
            onPress={this.close}
            style={styles.clearButton}
            text={t('great')}
          />
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { type, overlayProps } = this.props;
    if (this.state.keyboardShown) return null;
    if (type === 'tryItNowSignUp') {
      return this.renderSignUp();
    } else if (type === 'pushPermissions') {
      return this.renderPushPermissions();
    } else if (type === 'messageModal' && overlayProps.messageData) {
      return this.renderMessageModal();
    } else if (type === 'adventurePushPermissions') {
      return this.renderAdventurePushPermissions();
    }
    return null;
  }
}

const mapStateToProps = ({ overlays, auth }) => {
  let type = overlays.tryItNowSignUp
    ? 'tryItNowSignUp'
    : overlays.pushPermissions
    ? 'pushPermissions'
    : overlays.messageModal
    ? 'messageModal'
    : overlays.adventurePushPermissions
    ? 'adventurePushPermissions'
    : null;
  return {
    overlayProps: overlays.overlayProps || {},
    type,
    user: auth.user,
    messageData: overlays.messageData,
  };
};
export default translate('overlays')(connect(mapStateToProps)(VokeOverlays));
