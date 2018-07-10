import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import { completeChallenge, acceptChallenge } from '../../actions/adventures';
import { getVideo, createVideoInteraction } from '../../actions/videos';
import styles from './styles';
import { Flex, Text, Button, VokeIcon } from '../../components/common';
import CloseButton from '../../components/CloseButton';
import WebviewVideo from '../../components/WebviewVideo';
import webviewStates from '../../components/WebviewVideo/common';
import videoUtils from '../../utils/video';

class ChallengeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      video: null,
      isActive: props.challenge['active?'],
    };
  }

  componentDidMount() {
    Analytics.screen('Android: Report User');
    if (this.props.challenge.item) {
      this.props
        .dispatch(getVideo(this.props.challenge.item.id))
        .then(results => {
          this.setState({ video: results });
        });
    }
  }

  getIcon = c => {
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
      } else if (c['active?']) {
        return 'optional-active';
      } else {
        return 'optional-inactive';
      }
    }
  };

  handleButtonPress = () => {
    if (
      !this.props.challenge['required?'] &&
      !this.props.challenge['active?'] &&
      !this.state.isActive
    ) {
      this.setState({ isActive: true });
      this.props.dispatch(
        acceptChallenge(this.props.adventureId, this.props.challenge.id),
      );
    } else if (!this.props.challenge['required?']) {
      this.props.dispatch(
        completeChallenge(this.props.adventureId, this.props.challenge.id),
      );
      this.props.onDismiss();
    } else {
      this.props.onDismiss();
    }
  };

  handleVideoChange = videoState => {
    if (videoState === webviewStates.STARTED) {
      this.props.dispatch(createVideoInteraction(this.state.video.id));
    }
  };

  renderVideo = () => {
    const { video } = this.state;
    if (!video) return null;
    const videoMedia = video.media || {};
    const videoType = videoMedia.type;
    return (
      <Flex style={styles.video}>
        <WebviewVideo
          ref={c => (this.webview = c)}
          type={videoType}
          url={videoMedia.url}
          start={video.media_start || 0}
          onChangeState={this.handleVideoChange}
          isLandscape={false}
          width={videoUtils.WIDTH - 50}
          forceNoAutoPlay={true}
        />
      </Flex>
    );
  };

  render() {
    const { challenge, onDismiss } = this.props;
    const isActive = this.state.isActive;
    return (
      <ScrollView style={styles.container}>
        <Flex direction="column" align="center" justify="center">
          <Flex
            direction="column"
            align="start"
            justify="center"
            style={styles.modal}
          >
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
            {this.renderVideo()}
            <Flex value={1} align="end" justify="center">
              {challenge['required?'] && !challenge['completed?'] ? (
                <Button
                  text="Got It!"
                  buttonTextStyle={styles.buttonText}
                  style={styles.button}
                  onPress={this.handleButtonPress}
                />
              ) : !challenge['completed?'] ? (
                <Button
                  text={isActive ? 'Challenge Accepted' : 'Accept Challenge'}
                  buttonTextStyle={styles.buttonText}
                  style={
                    !isActive
                      ? styles.acceptButton
                      : styles.acceptButtonInactive
                  }
                  onPress={this.handleButtonPress}
                  disabled={isActive}
                />
              ) : null}
              {!challenge['required?'] && !challenge['completed?'] ? (
                <Button
                  text="Completed"
                  disabled={!isActive}
                  buttonTextStyle={styles.completeButtonText}
                  style={
                    isActive
                      ? styles.completeButton
                      : styles.inactiveCompleteButton
                  }
                  onPress={this.handleButtonPress}
                />
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    );
  }
}

ChallengeModal.propTypes = {
  challenge: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  adventureId: PropTypes.string.isRequired,
};

export default translate()(connect()(ChallengeModal));
