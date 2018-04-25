import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Flex, Button, Text } from '../../components/common';
import CloseButton from '../../components/CloseButton';
import SignUpButtons from '../SignUpButtons';
import { CLEAR_OVERLAY } from '../../constants';
import VOKEBOT from '../../../images/voke_bot_face_large.png';
import styles from './styles';

class VokeOverlays extends Component {

  close = () => {
    const { type } = this.props;
    this.props.dispatch({ type: CLEAR_OVERLAY, value: type });
  }

  renderIntro() {
    return (
      <Flex style={styles.overlay} align="center" justify="center" self="stretch">
        <Flex style={styles.chatBubble}>
          <Text style={styles.chatText}>
            We all have someone in our life who needs hope.
            {'\n'}
            As you explore Voke, ask God to guide you towards someone in your life.
            {'\n'}
            {'\n'}
            Step out and share. See what God will do.
          </Text>
        </Flex>
        <Flex style={styles.chatTriangle} />
        <Image source={VOKEBOT} style={{ height: 100 }} resizeMode="contain" />
        <Button
          onPress={this.close}
          type="filled"
          style={styles.closeButton}
          text="Got It"
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

  render() {
    const { type, overlays } = this.props;
    if (type === 'tryItNowIntro' && overlays[type]) {
      return this.renderIntro();
    } else if (type === 'tryItNowSignUp' && overlays[type]) {
      return this.renderSignUp();
    }
    return null;
  }
}

VokeOverlays.propTypes = {
  type: PropTypes.oneOf(['tryItNowIntro', 'tryItNowSignUp']).isRequired,
};

const mapStateToProps = ({ overlays }) => ({ overlays });

export default connect(mapStateToProps)(VokeOverlays);
