import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Flex, Button, Text } from '../../components/common';
import CloseButton from '../../components/CloseButton';
import SignUpButtons from '../SignUpButtons';
import { CLEAR_OVERLAY } from '../../constants';
import VOKEBOT from '../../../images/vokebot_whole.png';
import VOKEBOT_UKE from '../../../images/voke_uke.png';
import styles from './styles';
import { enablePushNotifications } from '../../actions/socket';

class VokeOverlays extends Component {

  close = () => {
    const { type, onClose, dispatch } = this.props;
    dispatch({ type: CLEAR_OVERLAY, value: type });
    // If the user passes in an onClose callback, call it
    if (onClose) onClose();
  }

  allowNotifications = () => {
    this.props.dispatch(enablePushNotifications(true));
    this.close();
  }

  renderIntro() {
    return (
      <Flex style={styles.overlay} align="center" justify="center" self="stretch">
        <Flex style={styles.chatBubble}>
          <Text style={styles.chatText}>
            We all have someone in our life who needs hope.
            {'\n'}
            Step out and share. See what God will do.
          </Text>
        </Flex>
        <Flex style={styles.chatTriangle} />
        <Image source={VOKEBOT} style={{ height: 90, marginBottom: 20 }} resizeMode="contain" />
        <Button
          onPress={this.close}
          type="filled"
          style={styles.closeButton}
          text="Got It!"
        />
      </Flex>
    );
  }

  renderSignUp() {
    return (
      <Flex style={styles.overlay} align="center" justify="center" self="stretch">
        <CloseButton onClose={this.close} />
        <Flex value={1} align="center" justify="center">
          <Image source={VOKEBOT} style={{ height: 100 }} resizeMode="contain" />
        </Flex>
        <Flex value={1} align="center" justify="center">
          <SignUpButtons />
        </Flex>
      </Flex>
    );
  }

  renderPushPermissions() {
    const { user } = this.props;
    return (
      <Flex style={styles.overlay} align="center" justify="center" self="stretch">
        <Flex style={styles.chatBubble}>
          <Text style={styles.chatText}>
            {user ? `${user.first_name}, ` : ''}
            I will play my ukulele when your friends start watching videos. This is the best time to have deeper conversations.
            {'\n'}
            {'\n'}
            First, I need your permission to send notifications.
          </Text>
        </Flex>
        <Flex style={styles.chatTriangle} />
        <Image source={VOKEBOT_UKE} style={{ height: 100, marginBottom: 20 }} resizeMode="contain" />
        <Button
          onPress={this.allowNotifications}
          type="filled"
          style={styles.closeButton}
          text="Allow Notifications"
        />
        <Button
          onPress={this.close}
          style={styles.clearButton}
          text="No Thanks"
        />
      </Flex>
    );
  }

  render() {
    const { type, overlays } = this.props;
    if (type === 'tryItNowIntro' && overlays[type]) {
      return this.renderIntro();
    } else if (type === 'tryItNowSignUp' && overlays[type]) {
      return this.renderSignUp();
    } else if (type === 'pushPermissions' && overlays[type]) {
      return this.renderPushPermissions();
    }
    return null;
  }
}

VokeOverlays.propTypes = {
  type: PropTypes.oneOf(['tryItNowIntro', 'tryItNowSignUp', 'pushPermissions']).isRequired,
  onClose: PropTypes.func,
};

const mapStateToProps = ({ overlays, auth }) => ({
  overlays,
  user: auth.user,
});

export default connect(mapStateToProps)(VokeOverlays);
