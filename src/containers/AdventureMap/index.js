import React, { Component } from 'react';
import { Image, Modal } from 'react-native';
import { connect } from 'react-redux';

import { Flex, Text } from '../../components/common';
import { getMe } from '../../actions/auth';
import theme from '../../theme';
import AdventureMarker from '../../components/AdventureMarker';
import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';
import ChallengeModal from '../ChallengeModal';

const IMAGE_HEIGHT = 1480;
const IMAGE_WIDTH = 517;

class AdventureMap extends Component {

  state={
    modalVisible: false,
    activeChallenge: null,
  };

  componentDidMount() {
    const { challenges } = this.props;
    this.load();
    if (challenges.length > 0) {
      setTimeout(() => this.challengesLoaded(challenges), 500);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.challenges.length > this.props.challenges.length) {
      this.challengesLoaded(nextProps.challenges);
    }
  }

  load() {
    this.props.dispatch(getMe());
  }

  challengesLoaded(challenges) {
    const challenge = challenges.find((c) => c.isActive);
    LOG('challenge', challenge);
    if (challenge) {
      this.scrollTo(challenge.point_y);
    }
  }

  handleChallengeModal = (c) => {
    this.setState({ activeChallenge: c, modalVisible: true });
  }

  scrollTo = (y) => {
    const headerHeight = theme.isAndroid ? 56 : theme.isIphoneX ? 90 : 65;
    const tabHeight = 45;
    // Get the visible screen area
    const screenHeight = theme.fullHeight - (headerHeight + tabHeight);
    // This is the furthest down you can scroll
    const maxBottomScroll = IMAGE_HEIGHT - screenHeight;

    const padding = 150; // Padding below scroll point
    let actualY = (IMAGE_HEIGHT / 2 + y) - screenHeight + padding;


    if (actualY < 0) actualY = 0;
    else if (actualY > maxBottomScroll) actualY = maxBottomScroll;
    this.props.scrollTo(actualY);
  }

  renderChallenges() {
    const { challenges } = this.props;
    return (
      challenges.map((i)=> (
        <AdventureMarker
          key={i.id}
          width={theme.fullWidth}
          height={IMAGE_HEIGHT}
          onPress={() => this.handleChallengeModal(i)}
          challenge={i}
        />
      ))
    );
  }

  render() {
    const { challenges } = this.props;
    LOG('challenges', challenges);
    return (
      <Flex style={styles.wrap}>
        {
          this.props.backgroundImage ? (
            <Image
              source={{ uri: `${this.props.backgroundImage}` }}
              style={{
                // Once the image loads and we get the width and height, adjust it to center
                marginLeft: -((IMAGE_WIDTH - theme.fullWidth) / 2),
                height: IMAGE_HEIGHT,
                width: IMAGE_WIDTH,
              }}
              resizeMode="cover"
            />
          ) : null
        }
        <Flex style={styles.overlay}>
          {
            challenges && challenges.length > 0 ? this.renderChallenges() : null
          }
        </Flex>
        {
          !this.props.backgroundImage ? (
            <Flex align="center" style={styles.loadingOverlay}>
              <Image resizeMode="contain" source={ANIMATION} />
              <Text style={styles.loadingText}>
                Loading your Adventures
              </Text>
            </Flex>
          ) : null
        }

        <Modal transparent={true} visible={this.state.modalVisible} >
          {
            this.state.activeChallenge ? (
              <ChallengeModal adventureId={this.props.adventureId} onDismiss={() => this.setState({ modalVisible: false })} challenge={this.state.activeChallenge} />
            ) : null
          }
        </Modal>
      </Flex>
    );
  }
}

AdventureMap.propTypes = {

};

const mapStateToProps = ({ auth, adventures }) => ({
  user: auth.user,
  backgroundImage: adventures.backgroundImageUrl,
  challenges: adventures.challenges,
  adventureId: adventures.adventureId,
});

export default connect(mapStateToProps)(AdventureMap);
