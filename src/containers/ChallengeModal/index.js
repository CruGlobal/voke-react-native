import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import { completeChallenge } from '../../actions/adventures';
import styles from './styles';
import { Flex, Text, Button, VokeIcon } from '../../components/common';
import CloseButton from '../../components/CloseButton';

class ChallengeModal extends Component {

  componentDidMount() {
    Analytics.screen('Android: Report User');
  }

  getIcon = (c) => {
    if (c['required?']) {
      if (c['completed?']) {
        return 'marker-completed';
      } else if (c.isActive) {
        return 'marker-active';
      } else {
        return 'marker-inactive';
      }
    } else {
      if (c['completed?']) {
        return 'optional-completed';
      } else {
        return 'optional-active';
      }
    }
  }

  handleButtonPress = () => {
    if (!this.props.challenge['required?'] && !this.props.challenge['completed?']) {
      this.props.dispatch(completeChallenge(this.props.adventureId, this.props.challenge.id));
      this.props.onDismiss();
    } else {
      this.props.onDismiss();
    }
  }

  render() {
    const { challenge, onDismiss } = this.props;
    return (
      <Flex direction="column" align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="start" justify="center" style={styles.modal}>
          <Flex style={styles.close}>
            <CloseButton onClose={onDismiss} />
          </Flex>
          <VokeIcon name={this.getIcon(challenge)} style={styles.icon} />
          <Flex align="start">
            <Text style={styles.title}>{challenge.name}</Text>
          </Flex>
          <Flex align="start">
            <Text style={styles.description}>{challenge.description}</Text>
          </Flex>
          <Flex value={1} align="end" justify="center">
            <Button
              text={challenge['required?'] ? 'Got It!' : 'Complete'}
              buttonTextStyle={styles.buttonText}
              style={styles.button}
              onPress={this.handleButtonPress}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

ChallengeModal.propTypes = {
  challenge: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  adventureId: PropTypes.string.isRequired,
};

export default connect()(ChallengeModal);
