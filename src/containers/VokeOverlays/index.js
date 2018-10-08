import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Button, Text } from '../../components/common';
import CloseButton from '../../components/CloseButton';
import SignUpButtons from '../SignUpButtons';
import { CLEAR_OVERLAY } from '../../constants';
import VOKEBOT_UKE from '../../../images/voke_uke.png';
import VOKEBOT from '../../../images/vokebot_whole.png';
import styles from './styles';
import { enablePushNotifications } from '../../actions/socket';

class VokeOverlays extends Component {
  close = () => {
    const { type, onClose, dispatch } = this.props;
    dispatch({ type: CLEAR_OVERLAY, value: type });
    // If the user passes in an onClose callback, call it
    if (onClose) onClose();
  };

  allowNotifications = () => {
    this.props.dispatch(enablePushNotifications(true));
    this.close();
  };

  renderSignUp() {
    const { t, channelName } = this.props;
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
          <SignUpButtons filled={true} />
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

  renderMessageModal() {
    const { t, messageData } = this.props;
    return (
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
        <Button onPress={this.close} style={styles.clearButton} text="Great!" />
      </Flex>
    );
  }

  render() {
    const { type, overlays, messageData } = this.props;
    if (type === 'tryItNowSignUp' && overlays[type]) {
      return this.renderSignUp();
    } else if (type === 'pushPermissions' && overlays[type]) {
      return this.renderPushPermissions();
    } else if (type === 'messageModal' && overlays[type] && messageData) {
      return this.renderMessageModal();
    }
    return null;
  }
}

VokeOverlays.propTypes = {
  type: PropTypes.oneOf(['tryItNowSignUp', 'pushPermissions', 'messageModal'])
    .isRequired,
  onClose: PropTypes.func,
  channelName: PropTypes.string,
};

const mapStateToProps = ({ overlays, auth }) => ({
  overlays,
  user: auth.user,
  messageData: overlays.messageData,
});

export default translate('overlays')(connect(mapStateToProps)(VokeOverlays));
