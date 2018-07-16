import React, { Component } from 'react';
import { Image, Modal } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Svg,{ Line, Path } from 'react-native-svg';

import Analytics from '../../utils/analytics';
import { Flex, Text, Touchable } from '../../components/common';
import { getMe } from '../../actions/auth';
import { getAdventure } from '../../actions/adventures';
import theme from '../../theme';
import AdventureMarker from '../../components/AdventureMarker';
import AdventureIcons from '../../components/AdventureIcons';
import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';
import ChallengeModal from '../ChallengeModal';

const IMAGE_HEIGHT = 1480;
const IMAGE_WIDTH = 517;

class AdventureMap extends Component {
  state = {
    modalVisible: false,
    activeChallenge: null,
    linesArray: [],
  };

  componentDidMount() {
    const { challenges } = this.props;
    this.load();
    if (challenges.length > 0) {
      setTimeout(() => this.challengesLoaded(challenges), 100);
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
    const challenge = challenges.find(c => c.isActive);
    const completed = challenges.find(c => c['completed?']);
    if (!completed) {
      this.props.scrollTo('end');
    } else if (challenge) {
      this.scrollTo(challenge.point_y);
    }

    let linesArray = [];

    challenges.filter(c => c['required?']).forEach((c, index) => {
      if (index === 0) return;
      let points = {
        pointA: {x: challenges[index-1].point_x + IMAGE_WIDTH/2 -((IMAGE_WIDTH - theme.fullWidth) / 2) + 20, y: challenges[index-1].point_y + IMAGE_HEIGHT/2 + 20},
        pointB: {x: c.point_x + IMAGE_WIDTH/2 -((IMAGE_WIDTH - theme.fullWidth) / 2) - 20, y: c.point_y + IMAGE_HEIGHT/2 - 20},
      };
      linesArray.push(points);
    });

    this.setState({ linesArray });
  }

  handleChallengeModal = c => {
    if (c) {
      this.setState({ activeChallenge: c, modalVisible: true });
    }
  };

  handleChangeAdventure = adventure => {
    this.props.dispatch(getAdventure(adventure.adventure_id));
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
    Analytics.screen(Analytics.s.AdventuresTab);
  };

  scrollTo = y => {
    const headerHeight = theme.isAndroid ? 56 : theme.isIphoneX ? 90 : 65;
    const tabHeight = 45;
    // Get the visible screen area
    const screenHeight = theme.fullHeight - (headerHeight + tabHeight);
    // This is the furthest down you can scroll
    const maxBottomScroll = IMAGE_HEIGHT - screenHeight;

    const padding = 150; // Padding below scroll point
    let actualY = IMAGE_HEIGHT / 2 + y - screenHeight + padding;

    if (actualY < 0) actualY = 0;
    else if (actualY > maxBottomScroll) actualY = maxBottomScroll;
    this.props.scrollTo(actualY);
  };

  renderChallenges() {
    const { challenges } = this.props;
    return challenges.map(i => (
      <AdventureMarker
        key={i.id}
        width={theme.fullWidth}
        height={IMAGE_HEIGHT}
        onPress={() => this.handleChallengeModal(i)}
        challenge={i}
      />
    ));
  }

  renderLines() {
    const { linesArray } = this.state;
    return (
      <Flex style={{position: 'absolute', width: IMAGE_WIDTH, height: IMAGE_HEIGHT}}>
        <Svg
          height={IMAGE_HEIGHT}
          width={IMAGE_WIDTH}
        >
          {
            linesArray.map((i) => (
              <Path
                d={`C${i.pointA.x} ${i.pointA.y} C${i.pointB.x} ${i.pointB.y}`}
                fill="none"
                stroke="red"
              />
            ))
          }
        </Svg>
      </Flex>
    );
  }

  renderTitle(ad) {
    return (
      <Touchable
        isAndroidOpacity={true}
        activeOpacity={0.8}
        onPress={() => {
          const challenge = this.props.challenges.find(c => c.isActive);
          this.handleChallengeModal(challenge);
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={styles.titleContainer}
        >
          {ad.icon && ad.icon.medium ? (
            <Image
              source={{ uri: `${ad.icon.medium}` }}
              style={{ height: 48, width: 48 }}
            />
          ) : null}
          <Text style={styles.title}>
            {ad.name ? ad.name.toUpperCase() : ''}
          </Text>
          <Text style={styles.description}>{ad.description}</Text>
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { t, challenges, activeAdventure } = this.props;
    return (
      <Flex style={styles.wrap}>
        {this.props.backgroundImage ? (
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
        ) : null}
        {this.renderLines()}
        {!this.props.backgroundImage ? (
          <Flex align="center" style={styles.loadingOverlay}>
            <Image resizeMode="contain" source={ANIMATION} />
            <Text style={styles.loadingText}>{t('loading.adventures')}</Text>
          </Flex>
        ) : null}

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          {this.state.activeChallenge ? (
            <ChallengeModal
              adventureId={this.props.adventureId}
              onDismiss={this.closeModal}
              challenge={this.state.activeChallenge}
            />
          ) : null}
        </Modal>
        <AdventureIcons
          onChangeAdventure={this.handleChangeAdventure}
          adventures={this.props.adventures}
        />
        <Flex style={styles.overlay}>
          {challenges && challenges.length > 0 ? this.renderChallenges() : null}
        </Flex>
        {activeAdventure ? this.renderTitle(activeAdventure) : null}
      </Flex>
    );
  }
}

AdventureMap.propTypes = {};

const mapStateToProps = ({ auth, adventures }) => ({
  user: auth.user,
  backgroundImage: adventures.backgroundImageUrl,
  challenges: adventures.challenges,
  adventures: adventures.adventures,
  activeAdventure: adventures.activeAdventure,
  adventureId: adventures.adventureId,
});

export default translate()(connect(mapStateToProps)(AdventureMap));
